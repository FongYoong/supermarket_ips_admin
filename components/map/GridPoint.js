import { forwardRef, useState } from 'react'

// eslint-disable-next-line react/display-name
export const GridPoint = forwardRef(({metadata, enabled=true, selected=false, onClick, ...props}, ref) => {
    
    const [hover, setHover] = useState(false);

    return (
        <mesh ref={ref}
            {...props}
            //visible={!disabled}
            onPointerEnter={(e) => {
                if (enabled) {
                    e.stopPropagation();
                    setHover(true);
                }
            }}
            onPointerLeave={(e) => {
                if (enabled) {
                    e.stopPropagation();
                    setHover(false);
                }
            }}
            onClick={() => {
                onClick(metadata);
            }}
        >
            <sphereGeometry args={[1.5, 32, 16]} />
            <meshStandardMaterial
                transparent
                opacity={enabled ? 1 : 0.2}
                color={enabled ? 0x00ff00 : 0xff0000}
                emissive={selected ? 0xffae00 : 0xffe9ab}
                emissiveIntensity={selected ? 1 : (hover ? 0.5 : 0)}
            />
        </mesh>
    )
});