import { useEffect, useState } from "react"

// services
import { uploadService } from "../../services/upload.service.js"

// images
import noImg from '/images/toys/no-toy-image.jpg'

export function ToyImagesUploader({ onSaveImages, currImages = [] }) {
    const [ImagesPreview, setImagesPreview] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // console.log('currImages:', currImages)

    useEffect(() => {
        if (currImages) {
            setImagesPreview([...currImages])
        }
    }, [])

    useEffect(() => {
        onSaveImages(ImagesPreview)
    }, [ImagesPreview])


    async function onUploadImage(ev) {
        ev.preventDefault()

        setIsLoading(true)

        const uploadedImagesData = await uploadService.uploadImgs(ev)

        const newImages = uploadedImagesData.reduce((acc, data) => {
            const { secure_url } = data
            acc.push(secure_url)
            return acc
        }, [])

        setImagesPreview(prev => ([...prev, ...newImages]))

        setIsLoading(false)
    }

    function onRemoveImg(imgToRemove) {
        setImagesPreview(prev => prev.filter(img => img !== imgToRemove))
    }

    return (
        <section
            className="toy-images-uploader"
            onDragOver={(event) => { event.preventDefault(), event.stopPropagation() }}
            onDrop={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onUploadImage(event)
            }}>

            {isLoading && <div className="loader"><div className="mini-loader"></div></div>}

            <label htmlFor="imgUpload">


                <div className="btn t-a upload-btn">Upload Toy Images</div>

                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    type="file"
                    name="imgUpload"
                    id="imgUpload"
                    onChange={onUploadImage}
                    multiple
                />

            </label>

            <div className="uploaded-images flex" onClick={(event) => event.stopPropagation()}>
                {ImagesPreview?.length > 0 && ImagesPreview.map((img, idx) => {
                    return <div className="image-wrapper" key={idx}>
                        <button className="remove-btn" onClick={() => onRemoveImg(img)} type="button">x</button>
                        <img src={img ? img : noImg} alt="ImagePreview" />
                    </div>
                })}
            </div>
        </section>
    )
}