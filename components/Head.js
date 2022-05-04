import Head from 'next/head';

function PageHead ({title}) {
    return (
        <Head >
            <title>{title}</title>
            <meta name="description" content={`${title} page`} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}


export default PageHead;