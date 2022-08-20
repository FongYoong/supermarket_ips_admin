import { useRef, useMemo, useState, useEffect } from 'react';
import { Card, Avatar, Stack, Group, Text } from '@mantine/core';
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
            cursor: 'pointer'
          }}
          onClick={onClick}
          {...props}
        >
            <Group spacing={4} >
                <Avatar size='md' radius="xl" />
                <Stack spacing={4} >
                    <Text size='sm' weight={600} lineClamp={1} >
                        {name}
                    </Text>
                    <Text color="dimmed" size='xs' weight={300} lineClamp={1} >
                        {subtitle}
                    </Text>
                </Stack>
                <Stack align='center' justify='center' >
                    <Text size='sm' weight={300} >
                        {timeStatus ? timeStatus + ' ago' : ''} 
                    </Text>
                </Stack>
            </Group>
        </Card>
    )
}

function ChatList ({selectedUser, data, onClick, ...props}) {

    return (
        <Stack {...props} >
            {
                data.map((item, index) => 
                    <ChatListItem key={index} selected={selectedUser ? selectedUser.id === item.id : false} {...item}
                        onClick={() => onClick(item)}
                    />
                )
            }
        </Stack>
    )
}


export default ChatList;
