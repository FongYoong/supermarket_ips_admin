import { useEffect, useState } from 'react';
import { Card, Divider, Stack, Group, Popover, Button, Box, Text, MediaQuery } from '@mantine/core';
import { Image } from '../Image';
import { useDatabaseValue, useDatabaseUpdateMutation } from "@react-query-firebase/database";
import { getTrolleyConfigRef } from '../../lib/clientDb';
import { RaceBy } from '@uiball/loaders'
import { TbCurrentLocationOff, TbCurrentLocation } from 'react-icons/tb';
import { MdHistory } from 'react-icons/md';

function isOnline(date) {
    const nowDate = new Date();
    return (nowDate - date) <= 30 * 1000
}

function TrolleyStatusCard({data, viewPastData}) {

    const [trolleyData, setTrolleyData] = useState(data);
    useEffect(() => {
        if (!isNaN(data.dateCreated)) {
            setTrolleyData(data);
        }
    }, [data])

    const trolleyConfigRef = getTrolleyConfigRef(data.id);
    const trolleyConfigQuery = useDatabaseValue(["trolley_config", data.id], trolleyConfigRef, {
        subscribe: true
    });
    const updateTrolleyConfigQuery = useDatabaseUpdateMutation(trolleyConfigRef);
    const enabled = trolleyConfigQuery.isSuccess && trolleyConfigQuery.data.enabled;
    const [online, setOnline] = useState(isOnline(trolleyData.dateCreated));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setOnline(isOnline(trolleyData.dateCreated));
        }, 2000)
        return () => clearInterval(intervalId)
    }, [trolleyData])

    const [showEnablePopover, setShowEnablePopover] = useState(false);

    return (
        <Card shadow="sm" p="sm" withBorder sx={{
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform .2s',
            '&:hover': {
              transform: 'scale(1.05)'
            },
            cursor: 'pointer',
            opacity: enabled ? 1 : 1
            //width: 150,
            //minHeight: 200,
          }}
          onClick={() => {}}
        >
            <Box style={{
                position: 'relative',
                height: 50,
            }}>
                <Image src="/images/trolley.svg" alt={"trolley 1"} layout='fill' objectFit='contain' />
            </Box>
            <Text weight={700} mt={8} align='center' >
                {trolleyData.name}
            </Text>
            <Divider my="sm" />
            {trolleyConfigQuery.isLoading &&
                <RaceBy
                    style={{
                        marginTop: 4
                    }}
                    //size={80}
                    lineWeight={5}
                    speed={1.4} 
                    color="black" 
                />
            }
            {trolleyConfigQuery.isSuccess && 
                <Popover
                    opened={showEnablePopover}
                    onClose={() => setShowEnablePopover(false)}
                    target={
                        <Button fullWidth variant='filled' color={enabled ? "green" : "red"}
                            leftIcon={enabled ? <TbCurrentLocation /> : <TbCurrentLocationOff />}
                            onClick={() => {
                                setShowEnablePopover(true)
                            }}
                            loading={updateTrolleyConfigQuery.isLoading}
                        >
                            {enabled ? "Enabled" : "Disabled"}
                        </Button>
                    }
                    position="bottom"
                    withArrow
                >
                    <Stack>
                        <Text >{enabled ? "Disable" : "Enable"} the trolley?</Text>
                        <Group>
                            <Button color="green" onClick={() => {
                                setShowEnablePopover(false);
                                updateTrolleyConfigQuery.mutate({
                                    enabled: !enabled,
                                });
                            }}>
                                Yes
                            </Button>
                            <Button color="red" onClick={() => setShowEnablePopover(false)}>No</Button>
                        </Group>
                    </Stack>
                </Popover>
            }
            <Button fullWidth mt={2} mb='sm' color="indigo"
                leftIcon={<MdHistory color='white' />}
                onClick={viewPastData}>
                View Past Data
            </Button>
            <Text size='sm' weight={700} align='center' >
                {online ? "Online" : "Offline"}
            </Text>
            <Text size='sm' align='center' style={{
                //wordWrap: 'break-word',
                //wordBreak: 'break-word',
                maxWidth: '12em'
            }} >
                Last active:&nbsp;
                {trolleyData.dateCreated.toLocaleString('en-US', {
                    dateStyle: "medium",
                    timeStyle: 'short'
                })}
            </Text>

        </Card>
    )
}
{/* <Image src={data.imageUrl} alt={data.name} layout='fill' objectFit='contain' /> */}


export default TrolleyStatusCard;