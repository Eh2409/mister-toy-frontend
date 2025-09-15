const { DEV, VITE_LOCAL } = import.meta.env

import { toyService as local } from "./toy.service.local.js"
import { toyService as remote } from "./toy.service.remote.js"

function getEmptyToy() {
    return {
        name: '',
        imgUrls: [],
        price: '',
        brands: [],
        productTypes: [],
        companies: [],
        inStock: true,
        description: '',
        msgs: []
    }
}

function getDefaultFilter() {
    return {
        name: '',
        price: 0,
        inStock: 'all',
        brands: [],
        productTypes: [],
        companies: [],
        sortType: 'createdAt',
        dir: -1,
        pageIdx: 0
    }
}


function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const field in defaultFilter) {
        if (field === 'inStock') {
            const inStock = searchParams.get(field) || defaultFilter[field]
            filterBy[field] = inStock !== 'all' ? JSON.parse(inStock) : 'all'
        } else if (field === 'brands' || field === 'productTypes' || field === 'companies') {
            filterBy[field] = searchParams.getAll(field) || defaultFilter[field]
        } else if (field === 'price' || field === 'dir' || field === 'pageIdx') {
            filterBy[field] = +searchParams.get(field) || defaultFilter[field]
        } else {
            filterBy[field] = searchParams.get(field) || defaultFilter[field]
        }
    }

    return filterBy
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const toyService = { getEmptyToy, getDefaultFilter, getFilterFromSearchParams, ...service }