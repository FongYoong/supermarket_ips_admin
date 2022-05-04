import { useState, forwardRef } from 'react';
import { useAuth } from '../lib/firebaseAuth';
import Link from 'next/link'
import { Navbar, Stack, Group, ThemeIcon, UnstyledButton, Button, Text, useMantineTheme, Skeleton, Popover } from '@mantine/core';
import { pages } from '../lib/constants';
import { IoExitOutline } from 'react-icons/io5';

const navbarWidthlg = 300;
const navbarWidthsm = 200;

// eslint-disable-next-line react/display-name
const NavbarButton = forwardRef(({ onClick, href, highlight, page }, ref) => {
    const theme = useMantineTheme();
    let backgroundColor, backgroundColorHover, textColor;
    if (highlight) {
        backgroundColor = '#59ff90';
        backgroundColorHover = '#10e858';
        textColor = 'black';
    }
    else {
        backgroundColor = 'white';
        backgroundColorHover = theme.colors.gray[1];
        textColor = '';
    }

    return (
        <a href={href} onClick={onClick} ref={ref} style={{width: '100%'}} >
            <UnstyledButton 
                sx={(theme) => ({
                    backgroundColor: backgroundColor,
                    borderRadius: theme.radius.md,
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: backgroundColorHover,
                    },
                    padding: '0.5em',
                    width: '100%'
                })}
            >
                <Group align='center' noWrap >
                    <ThemeIcon size="lg" variant="light" color={page.color} >
                        <page.icon />
                    </ThemeIcon>
                    <Text color={textColor} >{page.title}</Text>
                </Group>
            </UnstyledButton>
        </a>
    )
  })

export default function PageNavbar({ currentPage, navbarOpened, setNavbarOpened, loading }) {
    const { signOut } = useAuth();

    const [showSignOut, setShowSignOut] = useState(false);


    return (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!navbarOpened} width={{ sm: navbarWidthsm, lg: navbarWidthlg }}>
            <Skeleton visible={!loading} style={{width: '100%'}} >
                <Group spacing={0} style={{width: '100%'}} >
                    {pages.filter((page) => page.showNav).map((page, index) => 
                        <Link key={index} href={page.url} passHref >
                            <NavbarButton highlight={currentPage == page.key} page={page} onClick={() => {
                                setNavbarOpened(false);
                            }} />
                        </Link>
                    )}
                    <Popover
                        style={{
                            width: '100%'
                        }}
                        opened={showSignOut}
                        onClose={() => setShowSignOut(false)}
                        target={
                            <Button fullWidth mt='md' leftIcon={<IoExitOutline />} variant="outline" color="red"
                                onClick={() => {
                                    setShowSignOut(true);
                                }}
                            >
                                Sign Out
                            </Button>
                        }
                        //width={260}
                        position="bottom"
                        withArrow
                    >
                        <Stack>
                            <Text >Are you sure?</Text>
                            <Group>
                                <Button color="green" onClick={() => {
                                    setNavbarOpened(false);
                                    signOut();
                                }}>
                                    Yes
                                </Button>
                                <Button color="red" onClick={() => setShowSignOut(false)}>No</Button>
                            </Group>
                        </Stack>
                    </Popover>
                </Group>
            </Skeleton>
            {/* <Navbar.Section>
                <User />
            </Navbar.Section> */}
        </Navbar>
    )
}