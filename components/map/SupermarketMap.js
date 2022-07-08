import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Text, Button, Box } from '@mantine/core';
import * as THREE from "three";
import { Canvas, useThree } from '@react-three/fiber';
import { MapControls, PerspectiveCamera } from "@react-three/drei";
import { FloorMesh } from "./FloorMesh";
import { generalDimensions, cameraParameters, sections, gridDimensions } from '../../lib/supermarket_layout';
import { ShelfMesh } from "./ShelfMesh";
import { GridPoint } from "./GridPoint";
import { rawGrid } from "../../lib/supermarket_grid";
import { Waveform } from '@uiball/loaders'


const degToRad = degrees => degrees * (Math.PI / 180);

function SupermarketMap ({showGrid=false, editGrid=false, enableShelfSelect=true, categories=[], initialSelectedGridPoint=null, onGridClick, ...props}) {

    // const topLight = new THREE.DirectionalLight(0xffffff, 0.2);
    // topLight.position.set(0, 10, 0);
    // topLight.target = floor;
    // scene.add(topLight);
    // const xLightLeft = new THREE.DirectionalLight(0xffffff, 0.8);
    // xLightLeft.position.set(-30, 10, 0);
    // xLightLeft.target = floor;
    // scene.add(xLightLeft);
    // const xLightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    // xLightRight.position.set(30, 10, 0);
    // xLightRight.target = floor;
    // scene.add(xLightRight);
    // const zLight = new THREE.DirectionalLight(0xffffff, 0.8);
    // zLight.position.set(0, 10, 30);
    // zLight.target = floor;
    // scene.add(zLight);

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
    })), []);

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
                                onGridClick(value);
                            }}
                        />
                    )
                })
            })
        }
        return points;
    }, [showGrid, selectedGridPoint])

    const setupScene = useCallback(state => {
        const renderer = state.gl;
        renderer.setClearColor(0xf2f2f2);
        //const { width, height } = state.size;

        setSceneLoading(false);

    }, []);

    return (
        <Box {...props}
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
            {!sceneLoading && 
                <Button variant='light' color='pink'
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 1
                    }}
                    onClick={() => {
                        if(controlsRef.current) {
                            controlsRef.current.reset();
                        }
                    }}
                >
                    Reset View
                </Button>
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

                <FloorMesh ref={floorRef} position={[0, 0, 0]} length={generalDimensions.length} width={generalDimensions.width} />
                { shelves }
                { gridPoints }
                {/* <mesh position={[-generalDimensions.length/2, 0, 0]} >
                    <sphereBufferGeometry />
                    <meshStandardMaterial color="hotpink" />
                </mesh> */}
                {/* <ShelfMesh metadata={{type: 'shelf1'}} position={[-generalDimensions.length/2, 0, 20]} rotation={[0, degToRad(90), 0]} />
                <ShelfMesh metadata={{type: 'shelf1'}} position={[-generalDimensions.length/2, 0, -20]} rotation={[0, degToRad(-90), 0]} /> */}

            </Canvas>
        </Box>
    )
}

export default SupermarketMap;