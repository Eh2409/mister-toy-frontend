
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

function getDefaultFilter() {
    return {
        name: '',
        price: 0,
        inStock: 'all',
        labels: [],
        sortType: 'createdAt',
        dir: -1,
        // pageIdx: 0
    }
}


function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const field in defaultFilter) {
        if (field === 'inStock') {
            const inStock = searchParams.get(field) || defaultFilter[field]
            filterBy[field] = inStock !== 'all' ? JSON.parse(inStock) : 'all'
        } else if (field === 'labels') {
            filterBy[field] = searchParams.getAll(`labels`) || defaultFilter[field]
        } else if (field === 'price' || field === 'dir') {
            filterBy[field] = +searchParams.get(field) || defaultFilter[field]
        } else {
            filterBy[field] = searchParams.get(field) || defaultFilter[field]
        }
    }

    return filterBy
}


const service = local
export const toyService = { getEmptyToy, getDefaultFilter, getFilterFromSearchParams, ...service }