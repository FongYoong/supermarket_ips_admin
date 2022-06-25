import { useState, useEffect } from 'react'
import { Stack, Text, Button, Divider, Group, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { deleteProduct } from '../lib/clientDb'

function ProductDetailsModal({data, show, setShow, onSuccess}) {

    const deleteProductFromFirebase = () => {
        const successHandler = () => {
            console.log("Firebase Success");
            showNotification({
                title: `Deleted ${data.category} product!`,
                message: `Name: ${data.name}, Quantity: ${data.quantity}, Price: RM ${data.price.toFixed(2)}`,
                autoClose: 4000
            });
            onSuccess();
        };
        const errorHandler = (e) => {
            alert("Firebase Error");
            console.log(e)
        };
        deleteProduct(data.id, successHandler, errorHandler);
    }

    return (
        <Modal
            opened={show}
            onClose={() => setShow(false)}
            title="Delete Product"
            transition="slide-up"
            transitionDuration={300}
            transitionTimingFunction="ease"
        >
            {data &&
                <Stack>
                    <Divider />
                    <Text size="md">
                        Name: {data.name }
                    </Text>
                    <Text size="md">
                        Quantity: {data.quantity > 0 ? `${data.quantity}` : 'Out of stock' }
                    </Text>
                    <Text size="md">
                        Category: {data.category }
                    </Text>
                    <Divider />
                    <Text weight={700} size="md">
                        Are you sure?
                    </Text>
                    <Group>
                        <Button color="red" variant="filled" onClick={deleteProductFromFirebase} >
                            Yes
                        </Button>
                        <Button color="blue" variant="outline" onClick={() => setShow(false)} >
                            No
                        </Button>
                    </Group>

                </Stack>
            }
        </Modal>
    )
}
export default ProductDetailsModal;