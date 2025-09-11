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

        if (filterBy.byToyId && reviews?.length > 0) var ratingStats = await calculateRatingStats(reviews)

        return { reviews, ratingStats: ratingStats || {} }

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
    try {
        const loggedinUser = getLoggedinUser()
        var savedReview = {}

        if (review?._id) {
            savedReview = await storageService.put(REVIEW_KEY, review)
        } else {
            review.createdAt = Date.now()
            review.user = { _id: loggedinUser?._id, username: loggedinUser?.username }
            savedReview = await storageService.post(REVIEW_KEY, review)
        }

        const ratingStats = await calculateRatingStats(undefined, review?.toyId)

        return { savedReview, ratingStats }

    } catch (err) {
        throw err
    }

}


async function calculateRatingStats(reviews, toyId = undefined) {

    if (!reviews?.length && !toyId) return {
        ratingSum: 0,
        reviewsLength: 0,
        reviewPercentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    }

    if (!reviews?.length) {
        reviews = await storageService.query(REVIEW_KEY)
        reviews = reviews.filter(r => r.toyId === toyId)
    }

    // sum rating 
    var ratingSum = reviews.reduce((acc, r) => {
        acc += r.rating
        return acc
    }, 0)

    ratingSum = parseFloat((ratingSum / reviews.length).toFixed(1))

    // review percentages
    const ratingCounts = reviews.reduce((acc, r) => {
        acc[r.rating]++
        return acc
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

    for (const [rating, count] of Object.entries(ratingCounts)) {

        ratingCounts[rating] = parseFloat(((count / reviews.length) * 100).toFixed(1))
    }


    return {
        ratingSum,
        reviewsLength: reviews.length,
        reviewPercentages: ratingCounts
    }
}