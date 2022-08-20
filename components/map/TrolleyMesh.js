import { forwardRef, useState, useMemo } from 'react'
import { Text } from '@mantine/core';
import { useTexture, Html } from '@react-three/drei';
import { calculateTimeAgo } from '../../lib/utils';

// eslint-disable-next-line react/display-name
export const TrolleyMesh = forwardRef(({trolleyData, ...props}, ref) => {
    const texture = useTexture("/images/map/current_location_marker.png", (texture) => {
        
    })
    
    const [hover, setHover] = useState(false);

    const timeStatus = useMemo(() => {
        return calculateTimeAgo(trolleyData.dateCreated)
        // return trolleyData.dateCreated ? prettyMilliseconds(new Date() - new Date(trolleyData.dateCreated), {compact: true}) : '-';
    }, [hover]);

    return (
        <mesh
            ref={ref}
            onPointerEnter={(e) => {
                e.stopPropagation();
                setHover(true);
            }}
            onPointerLeave={(e) => {
                e.stopPropagation();
                setHover(false);
            }}
            {...props}
        >
            {/* <Text
                color='#EC2D2D'
                fontSize={12}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign='left'
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={2}
                outlineColor="#ffffff"
            >
                Trolley A
            </Text> */}
            <Html position={[0, 0, 10]} center={true} 
                style={{ 
                    width: '8em',
                    pointerEvents: "none", display: hover ? "block" : "none"
                }}
            >
                <div style={{
                    backgroundColor: 'rgba(111, 0, 158, 0.8)',
                    borderRadius: '8',
                    padding: 4,
                }}>
                    <Text color='white' size='sm' weight={700} align='center' >
                        {trolleyData.name}
                    </Text>
                    <Text color='white' size='sm' weight={300} align='center' >
                        Last active: {timeStatus}
                    </Text>
                </div>

            </Html>
            <sprite
                scale={[15, 15, 1]}
            >
                <spriteMaterial attach="material" 
                    transparent={true}
                    color={hover ? 0xffae00 : 0xffffff}
                >
                    <primitive attach="map" object={texture} />
                </spriteMaterial>
            </sprite>
        </mesh>
    )
});

// export class CurrentLocationSprite extends THREE.Sprite {
//   static async create() {
//     const texture = await ExpoTHREE.loadAsync(require("../../assets/images/layout/current_location_marker.png"));
//     const material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
//     const sprite = new THREE.Sprite(material);
//     sprite.scale.set(7, 7, 1);
//     return sprite;
//   }
// }

// export class TargetLocationSprite extends THREE.Sprite {
//   static async create() {
//     const texture = await ExpoTHREE.loadAsync(require("../../assets/images/layout/target_location_marker.png"));
//     const material = new THREE.SpriteMaterial( { map: texture, color: 0xffffff } );
//     const sprite = new THREE.Sprite(material);
//     sprite.scale.set(7, 7, 1);
//     return sprite;
//   }
// }


