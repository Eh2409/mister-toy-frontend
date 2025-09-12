import { reviewService } from "../../src/services/review/index-review.js";
import { ADD_REVIEW, REMOVE_REVIEW, SET_REVIEWS_MAX_PAGE_COUNT, SET_RATING_STATS, SET_REVIEWS, UPDATE_REVIEW } from "../reducers/review.reducer.js";
import { store } from "../store.js";

export const reviewActions = {
    load,
    remove,
    save,
}

async function load(filterBy = {}) {

    try {
        const { reviews, ratingStats, maxPageCount } = await reviewService.query(filterBy)
        store.dispatch({ type: SET_REVIEWS, reviews })
        store.dispatch({ type: SET_RATING_STATS, ratingStats })
        store.dispatch({ type: SET_REVIEWS_MAX_PAGE_COUNT, reviewMaxPageCount: maxPageCount })
    } catch (err) {
        console.log('review action -> Cannot load reviews', err)
        throw err
    }
}

async function remove(reviewId) {
    try {
        await reviewService.remove(reviewId)
        store.dispatch({ type: REMOVE_REVIEW, reviewId })
    } catch (err) {
        console.log('review action -> Cannot remove review', err)
        throw err
    }
}


async function save(reviewToSave) {
    const method = reviewToSave?._id ? 'update' : 'add'

    try {
        const { savedReview, ratingStats } = await reviewService.save(reviewToSave)

        if (method === 'update') {
            store.dispatch({ type: UPDATE_REVIEW, review: savedReview })
        } else {
            store.dispatch({ type: ADD_REVIEW, review: savedReview })
        }

        store.dispatch({ type: SET_RATING_STATS, ratingStats })

        return savedReview?._id

    } catch (err) {
        console.log('review action -> Cannot save review', err)
        throw err
    }
}