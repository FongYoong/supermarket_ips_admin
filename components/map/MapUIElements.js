import { useState } from "react";
import { Stack, Group, Text, Card, Popover, ActionIcon } from '@mantine/core';
import { RaceBy } from '@uiball/loaders'
import { AiFillCloseCircle } from 'react-icons/ai'

const HistoryItem = ({data}) => {

    const [showPopover, setShowPopover] = useState(false);

    return (
        <Popover position="left" withArrow shadow="md"
            opened={showPopover}
            onClose={() => setShowPopover(false)}
            target={
                <Card shadow="sm" p="xs" m={0} withBorder sx={{
                    // width: 150,
                    // minHeight: 200,
                    transition: 'transform .2s',
                    '&:hover': {
                    transform: 'scale(1.05)'
                    },
                    cursor: 'pointer'
                }}
                onClick={() => {
                    setShowPopover(true);
                }}
                >
                    <Group>
                        <Text weight={300} align='center' >
                            {`x: ${data.coordinates.x.toFixed(2)}, y: ${data.coordinates.y.toFixed(2)}`}
                        </Text>
                    </Group>
                </Card>
            }
        >
            <Stack
                style={{
                    backgroundColor: 'white',
                }}
            >
                <Text weight={700} align='center' >
                    {data.dateCreated.toLocaleString('en-US', {
                        dateStyle: "medium",
                        timeStyle: 'medium'
                    })}
                </Text>
            </Stack>
        </Popover>
    )
}

export const TrolleyHistory = ({selectedTrolley, deselectTrolley, historyData, loading, ...props}) => {
    return (
        <>
            {selectedTrolley &&
                <Stack
                    style={{
                        backgroundColor: '#e3fcff',
                        borderRadius: '0.5em',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        ...props.style,
                    }}
                    spacing={0}
                    p={4}
                >
                    <Group position='apart' align='center' spacing={0} >
                        <Text p={4} weight={700} align='center' >
                            {selectedTrolley.name}
                        </Text>
                        <ActionIcon variant='outline' color='gray'
                            onClick={() => {
                                if (deselectTrolley) {
                                    deselectTrolley();
                                }
                            }}
                        >
                            <AiFillCloseCircle size='1.5em' />
                        </ActionIcon>
                    </Group>
                    <Stack
                        style={{
                            flex: 5,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                        spacing={4}
                    >
                        {loading ?
                            <RaceBy
                                style={{
                                    marginTop: 4
                                }}
                                lineWeight={5}
                                speed={1.4} 
                                color="black"
                            />
                            :
                            <>
                                {historyData.length > 0 ?
                                    historyData.map((data, index) => 
                                        <HistoryItem key={index} data={data} />
                                    )
                                    :
                                    <Text p={4} weight={300} align='center' >
                                        Empty history.
                                    </Text>
                                }

                            </>

                        }
                    </Stack>

                </Stack>
            }
        </>
    )
}