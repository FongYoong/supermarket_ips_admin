import { forwardRef, useRef, useEffect, useMemo } from 'react'
import { Text } from '@mantine/core';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { useTexture, Html } from '@react-three/drei'

const modelAssets = {
    shelf1: "/models/shelf1.obj",
    shelf2: "/models/shelf2.obj",
    shelf3: "/models/shelf3.obj",
    shelf4: "/models/shelf4.obj",
    shelf5: "/models/shelf5.obj",
};
  
const textureAssets = {
shelf1: "/images/map/textures/metal.jpg",
shelf2: "/images/map/textures/shelf2.jpg",
shelf3: "/images/map/textures/metal.jpg",
shelf4: "/images/map/textures/metal.jpg",
shelf5: "/images/map/textures/metal.jpg",
};

const boundingBoxMaterial = new THREE.LineBasicMaterial( {
    color: 0xff0000,
    linewidth: 1
});

// eslint-disable-next-line react/display-name
export const ShelfMesh = forwardRef(({metadata, rotateY,
        enabled=true, enableSelect=true, selected=false, onHover, onHoverExit, onSelect, onDeselect, ...props
    }, ref) => {
    
    const loadedModel = useLoader(OBJLoader, modelAssets[metadata.type], (loader) => {
    
    });

    const boundingBoxRef = useRef();

    const model = useMemo(() => {
        const model = loadedModel.clone();
        const boundingBox = new THREE.BoxHelper(model, 0xff0000);
        boundingBox.material = boundingBoxMaterial;
        boundingBox.visible = false;
        model.add(boundingBox);
        boundingBoxRef.current = boundingBox;
        return model;
    }, [loadedModel]);

    const texture = useTexture(textureAssets[metadata.type], (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(6, 6);
    });

    const material = useMemo(() => new THREE.MeshStandardMaterial({
        map: texture,
        emissive: 0xffe9ab,
        emissiveIntensity: 0,
        transparent: true,
        opacity: enabled ? 1 : 0.1
    }), [texture, enabled]);


    useEffect(() => {
        model.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.position.set(0, 0, 0)
                child.material = material;
            }
        });
        model.position.set(0, 0, 0);
    }, [model, material])

    useEffect(() => {
        if (metadata.scale !== undefined) {
            model.scale.set(metadata.scale, metadata.scale, metadata.scale);
        }
    }, [model, metadata])

    useEffect(() => {
        if (rotateY !== undefined) {
            model.rotation.set(0, rotateY, 0);
        }
    }, [model, rotateY])

    useEffect(() => {
        if (enableSelect && boundingBoxRef.current) {
            boundingBoxRef.current.visible = selected;
        }
    }, [enableSelect, selected])
    
    return (
        <mesh ref={ref} {...props}
            onPointerEnter={(e) => {
                if (enabled && enableSelect) {
                    e.stopPropagation();
                    onHover(material);
                }
            }}
            onPointerLeave={(e) => {
                if (enabled && enableSelect) {
                    e.stopPropagation();
                    onHoverExit();
                }
            }}
            onClick={(e) => {
                if (enabled && enableSelect) {
                    e.stopPropagation();
                    if (selected) {
                        onDeselect();
                    }
                    else {
                        onSelect(metadata);
                    }
                }
            }}
        >
            <primitive object={model} >
            </primitive>
            <Html position={[0, 0, 0]} center={true} 
                style={{ 
                    pointerEvents: "none", display: selected ? "block" : "none"
                }}
            >
                <div style={{
                    backgroundColor: 'rgba(111, 0, 158, 0.8)',
                    borderRadius: '8',
                    padding: 4,
                }}>
                    <Text color='white' size='sm' weight={300} align='center' >
                        {metadata.productCategory}
                    </Text>
                </div>

            </Html>
        </mesh>
    )
});

{/* <meshStandardMaterial attach="material" color='blue' >
    <primitive attach="map" object={texture} />
</meshStandardMaterial> */}

// meshStandardMaterial

// export class FloorMesh extends THREE.Mesh {
//     static async create(length, width, height=1) {
//       const geometry = new THREE.BoxBufferGeometry(length, height, width);
//       const texture = await ExpoTHREE.loadAsync(require("../../assets/textures/tiles.jpg"));
//       texture.wrapS = THREE.RepeatWrapping;
//       texture.wrapT = THREE.RepeatWrapping;
//       texture.repeat.set(6, 6);
//       const material = new THREE.MeshPhongMaterial({
//         map: texture,
//       });
//       return new THREE.Mesh(geometry, material);
//     }
//   }