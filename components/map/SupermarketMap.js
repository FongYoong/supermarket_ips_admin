import { forwardRef, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Stack, Group, Text, NumberInput, Button, Box, Slider } from '@mantine/core';
import { useDatabaseSnapshot  } from "@react-query-firebase/database";
import { getTrolleyHistoryRef, toArray } from '../../lib/clientDb';
import * as THREE from "three";
import { Canvas } from '@react-three/fiber';
import { MapControls, PerspectiveCamera } from "@react-three/drei";
import { Line } from "./Line";
import { FloorMesh } from "./FloorMesh";
import { threeDimensions, cameraParameters, sections, gridDimensions } from '../../lib/supermarket_layout';
import { rawGrid, stringToPhysicalCoordinates, physicalCoordinatesToThreeCoordinates } from "../../lib/supermarket_grid";
import { ShelfMesh } from "./ShelfMesh";
import { GridPoint } from "./GridPoint";
import { Waveform } from '@uiball/loaders'
import { TrolleyMesh } from "./TrolleyMesh";
import { TrolleyHistory } from "./MapUIElements";



const degToRad = degrees => degrees * (Math.PI / 180);

const maxHistoryQueryLimit = 15;

// eslint-disable-next-line react/display-name
const SupermarketMap = forwardRef(({
    showGrid=false, editGrid=false, initialSelectedGridPoint=null, onGridClick,
    showShelves=true, enableShelfSelect=true, categories=[],
    trolleys=[], onTrolleyClick,
    selectedTrolley, deselectTrolley,
    ...props
}, ref) => {

    const [historyQueryLimit, setHistoryQueryLimit] = useState(5);
    const selectedTrolleyId = selectedTrolley ? selectedTrolley.id : 'undefined';
    const trolleyHistoryRef = useMemo(() => {
        return getTrolleyHistoryRef(selectedTrolleyId, maxHistoryQueryLimit);
    }, [selectedTrolleyId]);
    const trolleyHistoryQuery = useDatabaseSnapshot(["trolley_past_data", selectedTrolleyId], trolleyHistoryRef,
    {
        subscribe: true,
    },
    {
        select: (result) => {
          const historyData = toArray(result).map((data) => {
            const coordinates = stringToPhysicalCoordinates(data.coordinates);
            return {
              ...data,
              coordinates,
              dateCreated: new Date(data.dateCreated)
            }
          }).reverse();
          return historyData;
        },
    });

    const controlsRef = useRef();
    const cameraRef = useRef();
    const floorRef = useRef();
    const hoveredMaterialRef = useRef();
    const selectedBoundingBoxRef = useRef();
    const [selectedGridPoint, setSelectedGridPoint] = useState(initialSelectedGridPoint);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sceneLoading, setSceneLoading] = useState(true);

    useEffect(() => {
        if(controlsRef.current) {
            controlsRef.current.saveState();
        }
    }, [controlsRef.current])

    const shelves = useMemo(() => [].concat(...sections.map((section, i) => {
        if (showShelves) {
            const sectionShelves = section.models.map((model, j) => {
                return (
                    <ShelfMesh key={`shelves${i}-${j}`}
                        enabled={categories.length > 0 && categories.includes(section.productCategory) || categories.length <= 0 }
                        enableSelect={enableShelfSelect}
                        metadata={model}
                        position={[model.position.x, model.position.y, model.position.z]}
                        rotateY={degToRad(model.rotationY)}
                        onHover={(material) => {
                            if (hoveredMaterialRef.current) {
                                hoveredMaterialRef.current.emissiveIntensity = 0;
                            }
                            hoveredMaterialRef.current = material;
                            hoveredMaterialRef.current.emissiveIntensity = 0.3;
                        }}
                        onHoverExit={() => {
                            if (hoveredMaterialRef.current) {
                                hoveredMaterialRef.current.emissiveIntensity = 0;
                            }
                            hoveredMaterialRef.current = null;
                        }}
                        onSelect={(boundingBox) => {
                            if (selectedBoundingBoxRef.current) {
                                selectedBoundingBoxRef.current.visible = false;
                            }
                            selectedBoundingBoxRef.current = boundingBox;
                            boundingBox.visible = true;
                            setSelectedSection(section);
                        }}
                    />
                )
            })
            return sectionShelves;
        }
        else {
            return null;
        }
    })), [showShelves, enableShelfSelect]);

    const gridPoints = useMemo(() => {
        const points = [];
        if (showGrid) {
            rawGrid.forEach((row, y) => {
                row.forEach((point, x) => {
                    points.push(
                        <GridPoint
                            key={`grid${y}-${x}`}
                            metadata={{ x, y }}
                            enabled={point !== 0}
                            selected={selectedGridPoint && selectedGridPoint.x === x && selectedGridPoint.y === y}
                            position={[gridDimensions.initialX + gridDimensions.deltaX * x, 1, gridDimensions.initialZ + gridDimensions.deltaZ * y]}
                            onClick={(value) => {
                                if (editGrid) {
                                    setSelectedGridPoint(value)
                                }
                                if (onGridClick) {
                                    onGridClick(value);
                                }
                            }}
                        />
                    )
                })
            })
        }
        return points;
    }, [showGrid, selectedGridPoint])

    const trolleyMeshes = useMemo(() => {
        let meshes = [];
        if (trolleys) {
            meshes = trolleys.map((trolleyData, index) => {
                const coords = physicalCoordinatesToThreeCoordinates(trolleyData.coordinates.x, trolleyData.coordinates.y);
                return (
                    <TrolleyMesh key={index} trolleyData={trolleyData} position={[coords.x, 3, coords.z-7]}
                        onClick={() => {
                            console.log(123)
                        }}
                    />
                )}
            )
        }
        return meshes;
    }, [trolleys])

    const trolleyHistoryData = useMemo(() => {
        return trolleyHistoryQuery.data ? trolleyHistoryQuery.data.slice(0, historyQueryLimit) : []
    }, [trolleyHistoryQuery, historyQueryLimit])

    const historyLine = useMemo(() => {
        if (trolleyHistoryData) {
            const points = trolleyHistoryData.map((data) => {
                const coords = data.coordinates;
                const threeCoords = physicalCoordinatesToThreeCoordinates(coords.x, coords.y);
                return threeCoords;
            });
            const lines = [];
            for (let i = 1; i < points.length; i++) {
                const start = points[i-1];
                const end = points[i];
                const p = [
                    start.x, 1, start.z,
                    end.x, 1, end.z
                ];
                lines.push(<Line key={i} points={p} width={1.5} opacity={0.3} color={new THREE.Color( 0x268bff )} />);
            }
            return lines;
        }
        else {
            return null
        }
    }, [trolleyHistoryData])

    const setupScene = useCallback(state => {
        const renderer = state.gl;
        renderer.setClearColor(0xf2f2f2);
        //const { width, height } = state.size;
        setSceneLoading(false);

    }, []);

    return (
        <Box ref={ref} {...props}
            style={{
                position: 'relative',
                ...props.style
            }}
        >
            {sceneLoading && 
                <Box
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        zIndex: 1
                    }}
                >
                    <Waveform 
                        size={40}
                        lineWeight={3.5}
                        speed={1} 
                        color="black" 
                    />
                </Box>

            }
            {/* {!sceneLoading && 

            } */}
            {!sceneLoading && 
                <Stack
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 1,
                        height: '100%',
                        width: '30%'
                        //maxHeight: '100%',
                    }}
                >
                    <Button variant='light' color='pink'
                        //style={{ flex: selectedTrolley ? 1: null }}
                        onClick={() => {
                            if(controlsRef.current) {
                                controlsRef.current.reset();
                            }
                        }}
                    >
                        Reset View
                    </Button>
                    {selectedTrolley &&
                        <Stack style={{
                            background: 'rgba(255,255,255,0.5)',
                            borderRadius: '0.5em',
                            width: '100%'
                        }} >
                            {/* <NumberInput label="Limit to:" value={historyQueryLimit} min={1} step={1} max={15}
                                onChange={(val) => {
                                    if (val && val >= 1) {
                                        setHistoryQueryLimit(Math.round(val))
                                    }
                                }}
                            /> */}
                            <Text p={4} weight={700} align='start' >
                                Limit to:
                            </Text>
                            <Slider 
                                style={{
                                    width: '100%'
                                }}
                                labelAlwaysOn min={1} max={15} defaultValue={historyQueryLimit} onChangeEnd={setHistoryQueryLimit}
                            />
                        </Stack>
                    }

                    <TrolleyHistory
                        selectedTrolley={selectedTrolley} deselectTrolley={deselectTrolley}
                        historyData={trolleyHistoryData} loading={trolleyHistoryQuery.isLoading}
                        style={{
                            flex: 5,
                        }}
                    />
                </Stack>
            }
            <Canvas
                flat
                onCreated={setupScene}
                // camera={{
                //     fov: cameraParameters.initialFov,
                //     near: cameraParameters.near,
                //     far: cameraParameters.far,
                //     position: [cameraParameters.initialX, cameraParameters.height, cameraParameters.initialZ],
                //     rotation: [degToRad(cameraParameters.rotationX), 0, 0]
                // }}
                shadows={{
                    enabled: true,
                    type: THREE.PCFSoftShadowMap
                }}
            >
                <MapControls
                    ref={controlsRef}
                    autoRotate={false}
                    enableRotate={false}
                    //target={new THREE.Vector3(0, 0, 0)}
                    zoomSpeed={1.5}
                    minDistance={30}
                    maxDistance={cameraParameters.height}
                />
                <PerspectiveCamera makeDefault position={[cameraParameters.initialX, cameraParameters.height, cameraParameters.initialZ]}
                    fov={cameraParameters.initialFov}
                    near={cameraParameters.near}
                    far={cameraParameters.far}
                    rotation={[degToRad(cameraParameters.rotationX), 0, 0]}
                    onUpdate={(camera) => {
                        cameraRef.current = camera;
                    }}
                />
                <directionalLight position={[0, 10, 0]} color={0xffffff} intensity={0.2} target={floorRef.current} />
                <directionalLight position={[-30, 10, 0]} color={0xffffff} intensity={0.3} target={floorRef.current} />
                <directionalLight position={[30, 10, 0]} color={0xffffff} intensity={0.3} target={floorRef.current} />
                <directionalLight position={[0, 10, 30]} color={0xffffff} intensity={0.3} target={floorRef.current} />
                <directionalLight position={[0, 10, -30]} color={0xffffff} intensity={0.3} target={floorRef.current} />

                <FloorMesh ref={floorRef} position={[0, 0, 0]} length={threeDimensions.length} width={threeDimensions.width} />
                { shelves }
                { gridPoints }
                { trolleyMeshes }
                { historyLine }

                {/* <mesh position={[-threeDimensions.length/2, 0, 0]} >
                    <sphereBufferGeometry />
                    <meshStandardMaterial color="hotpink" />
                </mesh> */}
                {/* <ShelfMesh metadata={{type: 'shelf1'}} position={[-threeDimensions.length/2, 0, 20]} rotation={[0, degToRad(90), 0]} />
                <ShelfMesh metadata={{type: 'shelf1'}} position={[-threeDimensions.length/2, 0, -20]} rotation={[0, degToRad(-90), 0]} /> */}

            </Canvas>
        </Box>
    )
});

export default SupermarketMap;