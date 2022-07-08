import { forwardRef, useMemo } from 'react'
import * as THREE from "three";
import { useTexture } from '@react-three/drei';

// eslint-disable-next-line react/display-name
export const FloorMesh = forwardRef(({length, width, height=1, ...props}, ref) => {
    const texture = useTexture("/images/map/textures/tiles.jpg", (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(6, 6);
    })
    
    return (
        <mesh
            ref={ref}
            {...props}
        >
            <boxBufferGeometry args={[length, height, width]} />
            <meshStandardMaterial attach="material" >
                <primitive attach="map" object={texture} />
            </meshStandardMaterial>
        </mesh>
    )
});
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