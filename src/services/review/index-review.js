
import { reviewService as remote } from "./review.service.local.js"

const isRemote = false

function getEmptyReview() {
    return {
        txt: '',
        rating: 0
    }
}

const service = remote

export const reviewService = { getEmptyReview, ...service }