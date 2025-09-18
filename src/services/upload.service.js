export const uploadService = {
    uploadImg,
    uploadImgs
}

async function uploadImg(ev) {
    const CLOUD_NAME = "ddqd2e5ew"
    const UPLOAD_PRESET = "mister toy"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    try {
        const file = ev.type === 'change' ? ev.target.files[0] : ev.dataTransfer.files[0]
        const formData = new FormData()
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('file', file)

        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const imgData = await res.json()
        return imgData
    } catch (err) {
        console.error('Failed to upload', err)
        throw err
    }
}


async function uploadImgs(ev) {
    const CLOUD_NAME = "ddqd2e5ew"
    const UPLOAD_PRESET = "mister toy"
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

    try {
        const files = ev.type === 'change' ? ev.target.files : ev.dataTransfer.files
        const uploadPromises = []

        for (const file of files) {
            const formData = new FormData()
            formData.append('upload_preset', UPLOAD_PRESET)
            formData.append('file', file)

            const uploadPromise = fetch(UPLOAD_URL, {
                method: 'POST',
                body: formData
            }).then(res => res.json())

            uploadPromises.push(uploadPromise)
        }

        const uploadedImages = await Promise.all(uploadPromises)
        return uploadedImages
    } catch (err) {
        console.error('Failed to upload images', err)
        throw err
    }
}