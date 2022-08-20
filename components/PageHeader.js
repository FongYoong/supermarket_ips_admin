import { Header, MediaQuery, Burger, Group, Title, Divider, useMantineTheme } from '@mantine/core';
import { LazyMotion, AnimatePresence, domAnimation, m } from "framer-motion";
import CompanyIcon from '../components/CompanyIcon';

export const animation = {
    name: "Fade",
    variants: {
      initial: {
        marginTop: 50,
        opacity: 0,
      },
      animate: {
        marginTop: 0,
        opacity: 1,
      },
      exit: {
        marginTop: -50,
        opacity: 0,
      },
    },
    transition: {
      duration: 0.2,
    },
};

function PageHeader({title, navbarOpened, setNavbarOpened, showNavbar=true}) {
    
    const theme = useMantineTheme();

    return (
        <Header height={70} pb='lg'>
            <Group py='xs' style={{height: 70}} noWrap align='center' >
                {showNavbar && 
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                        <Burger
                            opened={navbarOpened}
                            onClick={() => setNavbarOpened((current) => !current)}
                            size="sm"
                            color={theme.colors.gray[6]}
                            mr="xl"
                            ml='sm'
                        />
                    </MediaQuery>
                }
                <CompanyIcon style={{width: '20vw'}} />
                <Divider orientation='vertical' />
                <MediaQuery smallerThan="xs" styles={{ fontSize: 18 }}>
                    <Title order={1}>
                    <LazyMotion features={domAnimation}>
                        <AnimatePresence exitBeforeEnter>
                            <m.div
                                key={title}
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
                                {title}
                            </m.div>
                        </AnimatePresence>
                    </LazyMotion>
                    </Title>
                </MediaQuery>
            </Group>
        </Header>
    )
}

export default PageHeader;