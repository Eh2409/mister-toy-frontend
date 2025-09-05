
import { useState } from "react"

import noImg from "../../public/images/toys/no-toy-image.jpg"

export function ImageLoader({ img, alt }) {

    const [isLoading, setIsLoading] = useState(true)

    function handleImageLoad() {
        setIsLoading(false)
    }

    return (
        <>
            {isLoading && <div className="img-loader"></div>}
            <img
                src={img}
                alt={alt}
                onLoad={handleImageLoad}
                onError={ev => ev.currentTarget.src = noImg}
                style={{ display: isLoading ? 'none' : 'block' }}
            />
        </>
    )
}