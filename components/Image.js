import NextImage from 'next/image'

export const Image = (props) => {
    return (
        <NextImage
            placeholder="blur" blurDataURL="/images/placeholder.svg"
            {...props}
        />
    )
}