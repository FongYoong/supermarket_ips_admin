import { useRef, useState, useEffect } from 'react';
import { Divider, Stack, Group, Text, Textarea, Button, ActionIcon, Popover } from '@mantine/core';
import { FiSend, FiMapPin } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

function MessageListItem({position, content, dateCreated, trolley, onLocateTrolley, ...props}) {

    const [showPopover, setShowPopover] = useState(false);

    return (
        <Popover position={position === 'left' ? 'right' : 'left'} withArrow shadow="md"
            style={{
                alignSelf: position === 'left' ? 'flex-start' : 'flex-end'
            }}
            opened={showPopover}
            onClose={() => setShowPopover(false)}
            target={
                <Group spacing={4} >
                    <Group p="xs" align='center' position='center' sx={{
                        backgroundColor: position === 'left' ? '#f0f0f0' : '#921ff0',
                        color: position === 'left' ? 'black' : 'white',
                        transition: 'transform .2s',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        },
                        cursor: 'pointer',
                        borderRadius: '0.5em',
                    }}
                    onClick={() => setShowPopover(true)}
                    {...props}
                    >
                        <Text size='sm' weight={300} >
                            {content}
                        </Text>
                    </Group>
                    {trolley && 
                        <ActionIcon variant='filled' color='green'
                            onClick={() => {
                                onLocateTrolley(trolley);
                            }}
                        >
                            <FiMapPin size='1.5em' />
                        </ActionIcon>
                    }

                </Group>

            }
        >
            <Stack
                style={{
                    backgroundColor: 'white',
                }}
            >
                <Text weight={700} align='center' >
                    {dateCreated.toLocaleString('en-US', {
                        dateStyle: "medium",
                        timeStyle: 'medium'
                    })}
                </Text>
            </Stack>
        </Popover>
    )
}

function MessageList ({selectedUser, disabled, data, onSend, onDeleteAll, onLocateTrolley, ...props}) {

    const [showDeletePopover, setShowDeletePopover] = useState(false);
    const messageContainerEnd = useRef();
    const messageTextAreaRef = useRef();

    useEffect(() => {
        if (messageContainerEnd.current) {
            messageContainerEnd.current.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
        }
    }, [data])

    return (
        <Stack
            sx={{
                border: "1px solid rgba(38, 0, 189, 0.5)",
                borderRadius: '0.5em',
                padding: 8,
                backgroundColor: 'white'
            }}
            {...props}
        >
            <Group p={8} position='apart' >
                <Text size='md' weight={600} >
                    {selectedUser ? selectedUser.name : ''}
                </Text>
                <Group>
                    <Popover
                        opened={showDeletePopover}
                        onClose={() => setShowDeletePopover(false)}
                        target={
                            <Button variant='filled' color="red"
                                disabled={disabled}
                                leftIcon={<MdDelete />}
                                onClick={() => setShowDeletePopover(true)}
                            >
                                Delete All
                            </Button>
                        }
                        position="bottom"
                        withArrow
                    >
                        <Stack>
                            <Text>Delete all the messages?</Text>
                            <Group>
                                <Button color="green" onClick={() => {
                                    setShowDeletePopover(false);
                                    onDeleteAll();
                                }}>
                                    Yes
                                </Button>
                                <Button color="red" onClick={() => setShowDeletePopover(false)}>No</Button>
                            </Group>
                        </Stack>
                    </Popover>
                </Group>
            </Group>
            <Divider />
            <Stack style={{
                padding: 8,
                overflowY: 'auto',
                flex: 1
            }}>
                {
                    data.map((item, index) => 
                        <MessageListItem key={index} onLocateTrolley={onLocateTrolley} {...item}   />
                    )
                }
                <div ref={messageContainerEnd} />
            </Stack>
            <Group>
                <Textarea
                    ref={messageTextAreaRef}
                    style={{
                        flex: 1
                    }}
                    disabled={disabled}
                    placeholder="Message"
                />
                <Button variant='filled' color="violet"
                    disabled={disabled}
                    leftIcon={<FiSend />}
                    onClick={() => {
                    if(messageTextAreaRef.current && messageTextAreaRef.current.value) {
                        onSend(messageTextAreaRef.current.value);
                        messageTextAreaRef.current.value = '';
                    }
                    }}
                >
                    Send
                </Button>
            </Group>
        </Stack>
    )
}


export default MessageList;
