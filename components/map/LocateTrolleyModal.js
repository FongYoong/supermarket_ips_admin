import { useState, useEffect } from 'react'
import { Stack, Text, Group, Divider, Modal } from '@mantine/core';
import SupermarketMap from '../map/SupermarketMap'
import { useDatabaseValue } from "@react-query-firebase/database";
import { getTrolleyDataRef } from '../../lib/clientDb';
import { stringToPhysicalCoordinates } from '../../lib/supermarket_grid';
import { calculateTimeAgo } from '../../lib/utils';
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { AiFillWarning } from 'react-icons/ai'

function LocateTrolleyModal({trolleyId, show, setShow}) {

    const trolleyDataRef = getTrolleyDataRef(trolleyId);
    const trolleyDataQuery = useDatabaseValue(["trolley_data", trolleyId], trolleyDataRef,
    {
        subscribe: true,
    },
    {
        select: (result) => {
            if (result) {
                const coordinates = stringToPhysicalCoordinates(result.coordinates);
                return {
                    ...result,
                    id: trolleyId,
                    coordinates,
                    dateCreated: new Date(result.dateCreated)
                }
            }
            return null;
        },
    });

    const trolleyData = trolleyDataQuery.data;

    console.log(trolleyDataQuery.data)

    return (
        <Modal
            opened={show}
            onClose={() => setShow(false)}
            size='xl'
            title="Locate Trolley"
            transition="pop"
            transitionDuration={300}
            transitionTimingFunction="ease"
        >
            <Divider />
            <Stack mt={16} >
                <Text size="md">
                    Trolley ID: <b>{trolleyId}</b>
                </Text>
                <Group spacing={4} >
                    {trolleyData ?
                        <IoIosInformationCircleOutline size='1.5em' color='green' />
                        :
                        <AiFillWarning size='1.5em' color='red' />
                    }
                    {trolleyData ?
                        <Text size="md" >
                            <span>The last known position was recorded&nbsp;</span>
                            <b>{calculateTimeAgo(trolleyData.dateCreated)}</b>
                            <span>&nbsp;ago.</span>
                        </Text>
                        :
                        <Text size="md">
                            Looks like this trolley <b>does not exist</b> anymore.
                        </Text>
                    }
                </Group>

                <SupermarketMap
                    style={{
                        width: '100%',
                        height: '50vh'
                    }}
                    enableShelfSelect={false}
                    trolleys={trolleyData ? [trolleyData] : []}
                    selectedTrolley={trolleyData}
                />
                {/* <SupermarketMap
                    ref={mapRef}
                    style={{
                        height: '50vh',
                        flexGrow: 1
                    }}
                    showGrid={showGrid}
                    showShelves={showShelves}
                    trolleys={trolleysDataQuery.data}
                    selectedTrolley={selectedTrolleyData} deselectTrolley={() => setSelectedTrolleyData(undefined)}
                /> */}
            </Stack>
        </Modal>
    )
}
export default LocateTrolleyModal;