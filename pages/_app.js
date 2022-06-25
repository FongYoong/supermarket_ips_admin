import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import { AuthUserProvider } from '../lib/firebaseAuth';
import Head from '../components/Head'
import Page from '../components/Page'
import NextNProgress from 'nextjs-progressbar'
import { LazyMotion, AnimatePresence, domAnimation, m } from "framer-motion";
import { JellyTriangle } from '@uiball/loaders'
import '../styles/globals.css';

const queryClient = new QueryClient();

export const animation = {
  name: "Fade",
  variants: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  },
  transition: {
    duration: 0.2,
  },
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [ loadedFirstTime, setLoadedFirstTime ] = useState(false);
  const [ showWaitText, setShowWaitText ] = useState(false);

  useEffect(() => {
    setLoadedFirstTime(true);
    setTimeout(() => {
      setShowWaitText(true);
    }, 2000);
    // const start = () => {
    // };
    // const end = () => {
    //   setLoadedFirstTime(true);
    // };
    // //router.events.on("routeChangeStart", start);
    // router.events.on("routeChangeComplete", end);
    // router.events.on("routeChangeError", end);
    // return () => {
    //   //router.events.off("routeChangeStart", start);
    //   router.events.off("routeChangeComplete", end);
    //   router.events.off("routeChangeError", end);
    // };
  }, []);

  return (
      <AuthUserProvider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            theme={{
              fontFamily: 'Inter, sans-serif',
              headings: { fontFamily: 'Inter, sans-serif' },
              primaryColor: 'green'
              // spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
            }}
          >
            <NotificationsProvider>
              <NextNProgress />
              <Head title={router.pathname} />
              {!loadedFirstTime ?
                <div style={{height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} >
                  <JellyTriangle 
                    size={60}
                    speed={2} 
                    color="black" 
                  />
                  <h1 style={{
                    fontFamily: 'Helvetica, sans-serif',
                    transition: 'opacity 1s',
                    opacity: showWaitText ? 1 : 0
                  }} >
                    Wait ah 😊
                  </h1>
                </div>
                :
                <Page currentPage={router.pathname} >
                  <LazyMotion features={domAnimation}>
                    <AnimatePresence exitBeforeEnter>
                      <m.div
                        key={router.route.concat(animation.name)}
                        style={{
                          height: '100%'
                        }}
                        // style={{
                        //   display: "flex",
                        //   position: "relative",
                        //   justifyContent: 'center',
                        //   alignItems: 'center',
                        //   height: "100%",
                        //   width: "96vw"
                        // }}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={animation.variants}
                        transition={animation.transition}
                      >
                          <Component {...pageProps} />
                      </m.div>
                    </AnimatePresence>
                  </LazyMotion>
                </Page>
              }

            </NotificationsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </AuthUserProvider>
  )
}

export default MyApp
