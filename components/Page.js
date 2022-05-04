import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../lib/firebaseAuth';
import { AppShell } from '@mantine/core';
import PageHeader from './PageHeader';
import PageNavbar from './PageNavbar';
import { pages } from '../lib/constants';

export default function Page({currentPage, children}) {
    const { authUser, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !authUser) {
            router.replace('/login');
        }
    }, [authUser, loading]);

    const [navbarOpened, setNavbarOpened] = useState(false);
    const pageDetails = pages.find((page) => page.url == currentPage);

    return (
        <AppShell
            styles={(theme) => ({
                main: { 
                    backgroundColor: theme.colors.gray[0],
                },
            })}
            padding="md"
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            fixed
            navbar={pageDetails.showNav ? <PageNavbar loading={authUser} currentPage={currentPage} navbarOpened={navbarOpened} setNavbarOpened={setNavbarOpened} /> : null}
            header={<PageHeader title={pageDetails.title} showNavbar={pageDetails.showNav} navbarOpened={navbarOpened} setNavbarOpened={setNavbarOpened} />}
            >
            {children}
        </AppShell>
  )
}