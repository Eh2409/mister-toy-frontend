import { httpService } from "../http.service.js"

export const toyService = {
    query,
    getById,
    remove,
    save
}

const BASE_URL = 'review/'

async function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
}
async function getById(reviewId) {
    return httpService.get(BASE_URL + reviewId)
}

async function remove(reviewId) {
    return httpService.delete(BASE_URL + reviewId)
}

async function save(reviewToSave) {
    const method = reviewToSave._id ? 'put' : 'post'
    const reviewId = reviewToSave._id ? reviewToSave._id : ''
    return httpService[method](BASE_URL + reviewId, reviewToSave)
}