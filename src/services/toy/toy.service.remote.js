import { httpService } from "../http.service.js"

export const toyService = {
    query,
    getById,
    remove,
    save,
    getLabels,
    getLabelsChartsData,
    saveMsg
}

const BASE_URL = 'toy/'

async function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
}
async function getById(toyId) {
    return httpService.get(BASE_URL + toyId)
}

async function remove(toyId) {
    return httpService.delete(BASE_URL + toyId)
}

async function save(toyToSave) {
    const method = toyToSave._id ? 'put' : 'post'
    const toyId = toyToSave._id ? toyToSave._id : ''
    return httpService[method](BASE_URL + toyId, toyToSave)
}

async function saveMsg(msgToSave, toyId) {
    return httpService.post(BASE_URL + toyId + '/msg', msgToSave)
}

async function getLabels() {
    return httpService.get(BASE_URL + 'labels')
}

async function getLabelsChartsData() {
    return httpService.get(BASE_URL + 'charts')
}