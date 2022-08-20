import { extend } from '@react-three/fiber';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
extend({ MeshLine, MeshLineMaterial })

export function Line({ points, width, color, opacity }) {
    return (
        <mesh>
            <meshLine attach="geometry" points={points} />
            <meshLineMaterial attach="material"
                transparent
                depthTest={false}
                lineWidth={width}
                color={color}
                opacity={opacity}
                // map={null}
                // useMap={false}
                // dashArray={1}

            />
        </mesh>
    )
}