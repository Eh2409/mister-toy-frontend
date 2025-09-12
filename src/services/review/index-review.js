
import { reviewService as remote } from "./review.service.local.js"

const isRemote = false

function getEmptyReview() {
    return {
        txt: '',
        rating: 0
    }
}

function getDefaultFilter() {
    return {
        toyName: '',
        minRating: 0,
        reviewTxt: '',
        sortType: 'createdAt',
        dir: -1,
        pageIdx: 0
    }
}


function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}

    for (const field in defaultFilter) {
        if (field === 'minRating' || field === 'dir' || field === 'pageIdx') {
            filterBy[field] = +searchParams.get(field) || defaultFilter[field]
        } else {
            filterBy[field] = searchParams.get(field) || defaultFilter[field]
        }
    }

    return filterBy
}

const service = remote

export const reviewService = { getEmptyReview, getDefaultFilter, getFilterFromSearchParams, ...service }