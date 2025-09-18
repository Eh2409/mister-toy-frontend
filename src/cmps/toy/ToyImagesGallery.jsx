import { useEffect, useState } from "react";
import { ImageLoader } from "../ImageLoader.jsx";

// imgages
import noImg from "/images/toys/no-toy-image.jpg"

export function ToyImagesGallery({ toy }) {

    const [selectedImg, setSelectedImg] = useState(noImg)

    useEffect(() => {
        if (toy?.imgUrls?.length > 0) {
            setSelectedImg(toy?.imgUrls[0])
        }
    }, [])

    function onSetSelectedImg(img) {
        setSelectedImg(img)
    }

    return (
        <section className="toy-images-gallery">
            <div className="images-slider-wrapper">
                <ul className="images-slider">
                    {toy?.imgUrls?.length > 0 && toy.imgUrls.map((img, idx) => {
                        return <li
                            className={`img-item ${selectedImg === img ? "active" : ""}`}
                            onClick={() => onSetSelectedImg(img)}
                            key={idx}>
                            <ImageLoader img={img} alt={toy?.name} />
                        </li>
                    })}
                </ul>
            </div>

            <div className='toy-img-wrapper'>
                <ImageLoader img={selectedImg} alt={toy?.name} />
            </div>


        </section>
    )
}

