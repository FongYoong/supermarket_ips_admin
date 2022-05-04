import Image from 'next/image'

function CompanyIcon({style}) {

    return (
        <div style={{
            position: 'relative',
            height:'100%',
            //width: '50',
            ...style
        }} >
            <Image
                src="/aeyon_admin_logo.svg" alt="Aeyon Logo" layout='fill'
            />
        </div>
    )
}

export default CompanyIcon;