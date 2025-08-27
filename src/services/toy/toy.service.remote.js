import { httpService } from "../http.service.js"

export const toyService = {
    query,
    getById,
    remove,
    save,
    getLabels
}

const BASE_URL = 'toy/'

function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
}
function getById(toyId) {
    return httpService.get(BASE_URL + toyId)
}

function remove(toyId) {
    return httpService.delete(BASE_URL + toyId)
}

function save(toyToSave) {
    const method = toyToSave._id ? 'put' : 'post'
    const toyId = toyToSave._id ? toyToSave._id : ''
    return httpService[method](BASE_URL + toyId, toyToSave)
}

function getLabels() {
    return httpService.get(BASE_URL + 'labels')
}