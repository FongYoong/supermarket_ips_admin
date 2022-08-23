import { useState, useEffect } from 'react';
import { Card, Avatar, Stack, Group, Text } from '@mantine/core';
import { RaceBy } from '@uiball/loaders'
import { calculateTimeAgo } from '../../lib/utils';

function ChatListItem({selected=false, id, name, subtitle, latestDate, onClick, ...props}) {

    const [timeStatus, setTimeStatus] = useState('');

    useEffect(() => {
        setTimeStatus(calculateTimeAgo(latestDate));
        const id = setInterval(() => {
            setTimeStatus(calculateTimeAgo(latestDate));
        }, 4000);
        return () => clearInterval(id);
    }, [latestDate])

    return (
        <Card shadow="sm" p="xs" withBorder sx={{
            backgroundColor: selected ? '#f0f0f0' : 'white',
            transition: 'transform .2s',
            '&:hover': {
              transform: 'scale(1.05)'
            },
            cursor: 'pointer',
            width: '100%'
          }}
          onClick={onClick}
          {...props}
        >
            <Group spacing={4}
                position='apart'
            >
                <Group>
                    <Avatar size='md' radius="xl" />
                    <Stack spacing={4} >
                        <Text size='sm' weight={600} lineClamp={1} >
                            {name}
                        </Text>
                        <Text color="dimmed" size='xs' weight={300} lineClamp={1} >
                            {subtitle}
                        </Text>
                    </Stack>
                </Group>
                <Stack align='center' justify='center' >
                    <Text size='sm' weight={300} >
                        {timeStatus ? timeStatus + ' ago' : ''} 
                    </Text>
                </Stack>
            </Group>
        </Card>
    )
}

function ChatList ({loading=false, selectedUser, data, onClick, ...props}) {

    return (
        <Stack align='center' justify='center' {...props} >
            {loading ? 
                <RaceBy
                    style={{

                    }}
                    lineWeight={5}
                    speed={1.4} 
                    color="black"
                />
                :
                <>
                    {
                        data.length > 0 ?
                            data.map((item, index) => 
                                <ChatListItem key={index} selected={selectedUser ? selectedUser.id === item.id : false} {...item}
                                        onClick={() => onClick(item)}
                                    />
                                )
                        :
                            <Text>
                                This chat list is empty.
                            </Text>
                    }
                </>

            }
        </Stack>
    )
}


export default ChatList;
