import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Stack, Text, Box, Button, Divider, NativeSelect, Modal } from '@mantine/core';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox'
import SupermarketMap from './map/SupermarketMap'


function ProductDetailsModal({data, show, setShow}) {

    return (
        <SimpleReactLightbox>
            <Modal
                opened={show}
                onClose={() => setShow(false)}
                size='lg'
                title="View Product"
                transition="pop"
                transitionDuration={300}
                transitionTimingFunction="ease"
            >
                {data &&
                    <Stack>
                        <Box mx='auto' >
                            <SRLWrapper>
                                <Image src={data.imageUrl} alt={data.name} height={150} width={267} objectFit="contain" />
                            </SRLWrapper>
                        </Box>
                        <Divider />
                        <Text size="md">
                            Name: {data.name }
                        </Text>
                        <Text size="md">
                            Quantity: {data.quantity > 0 ? `${data.quantity}` : 'Out of stock' }
                        </Text>
                        <Text size="md">
                            Price: RM {data.price.toFixed(2)}
                        </Text>
                        <Text size="md">
                            Category: {data.category }
                        </Text>
                        <SupermarketMap
                            style={{
                                width: '100%',
                                height: '50vh'
                            }}
                            showGrid
                            enableShelfSelect={false}
                            categories={[data.category]}
                            initialSelectedGridPoint={data.mapPin}
                        />
                    </Stack>
                }
            </Modal>
        </SimpleReactLightbox>
    )
}
export default ProductDetailsModal;