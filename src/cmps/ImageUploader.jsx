import { useEffect, useState } from "react"
import { uploadService } from "../services/upload.service.js"

// images
import userImg from '/images/user-img.jpg'
import loading from '/images/loadingGif.gif'

export function ImageUploader({ onSaveImage, currImage = null }) {
    const [ImagePreview, setImagePreview] = useState({ imgUrl: null })
    const [isLoading, setIsLoading] = useState(false)
    const [isImgUploaded, setIsImgUploaded] = useState(false)

    useEffect(() => {
        if (currImage) {
            setImagePreview({ imgUrl: currImage })
        }
    }, [])

    async function onUploadImage(ev) {
        ev.preventDefault()

        setIsLoading(true)

        const { secure_url } = await uploadService.uploadImg(ev)

        setImagePreview({ imgUrl: secure_url })

        setIsLoading(false)

        if (!isImgUploaded) setIsImgUploaded(true)

        onSaveImage(secure_url)
    }

    return (
        <section className="image-uploader">

            <label htmlFor="imgUpload">

                <div className="btn t-a">{isImgUploaded ? "Change Image" : "Upload Image"}</div>

                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    type="file"
                    name="imgUpload"
                    id="imgUpload"
                    onChange={onUploadImage}
                />
            </label>

            <img src={isLoading ? loading : ImagePreview?.imgUrl ? ImagePreview.imgUrl : userImg}
                alt="Image Preview"
                className="img-preview"
            />

        </section>
    )
}