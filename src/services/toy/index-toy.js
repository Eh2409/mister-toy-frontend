
const { DEV, VITE_LOCAL } = import.meta.env

console.log('VITE_LOCAL:', VITE_LOCAL)

import { toyService as local } from "./toy.service.local.js"


function getEmptyToy() {
    return {
        name: '',
        imgUrl: '',
        price: 0,
        labels: [],
        inStock: true,
        description: ''
    }
}

const service = local
export const toyService = { getEmptyToy, ...service }