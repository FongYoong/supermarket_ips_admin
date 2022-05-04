import '../styles/globals.css';
import { useRouter } from 'next/router'
import { MantineProvider} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { AuthUserProvider } from '../lib/firebaseAuth';
import Head from '../components/Head'
import Page from '../components/Page'
import NextNProgress from 'nextjs-progressbar'
import { LazyMotion, AnimatePresence, domAnimation, m } from "framer-motion";

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

  return (
      <AuthUserProvider>
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
            <Page currentPage={router.pathname} >
              <LazyMotion features={domAnimation}>
                <AnimatePresence exitBeforeEnter>
                  <m.div
                    key={router.route.concat(animation.name)}
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
          </NotificationsProvider>
        </MantineProvider>
      </AuthUserProvider>
  )
}

export default MyApp
