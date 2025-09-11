import { storageService } from "../async-storage.service"
import { getLoggedinUser } from "../user/index-user.js"


export const reviewService = {
    query,
    getById,
    remove,
    save,
}

const REVIEW_KEY = 'REVIEW_KEY'


async function query(filterBy = {}) {
    try {
        var reviews = await storageService.query(REVIEW_KEY)

        if (filterBy.byToyId) {
            reviews = reviews.filter(r => r.toyId === filterBy.byToyId)
        }

        reviews = reviews.sort((r1, r2) => (r1.createdAt - r2.createdAt) * -1)

        return reviews

    } catch (err) {
        throw err
    }
}

async function getById(reviewId) {
    return storageService.get(REVIEW_KEY, reviewId)
}

async function remove(reviewId) {
    return storageService.remove(REVIEW_KEY, reviewId)
}

async function save(review) {

    if (review?._id) {
        return storageService.put(REVIEW_KEY, review)
    } else {
        const loggedinUser = getLoggedinUser()
        review.createdAt = Date.now()
        review.user = { _id: loggedinUser?._id, username: loggedinUser?.username }
        return storageService.post(REVIEW_KEY, review)
    }
}