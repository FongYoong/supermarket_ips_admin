import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Stack, Text, Box, Button, Divider, NativeSelect, Modal } from '@mantine/core';
import { productCategories } from '../lib/constants'
import { AiOutlineRight } from 'react-icons/ai'
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox'


function ProductDetailsModal({data, show, setShow}) {

    return (
        <SimpleReactLightbox>
            <Modal
                opened={show}
                onClose={() => setShow(false)}
                title="View Product"
                transition="slide-up"
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
                    </Stack>
                }
            </Modal>
        </SimpleReactLightbox>
    )
}
export default ProductDetailsModal;