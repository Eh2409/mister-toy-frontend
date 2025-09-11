
export const SET_REVIEWS = 'SET_REVIEWS'
export const REMOVE_REVIEW = 'REMOVE_REVIEW'
export const ADD_REVIEW = 'ADD_REVIEW'
export const UPDATE_REVIEW = 'UPDATE_REVIEW'

export const SET_RATING_STATS = 'SET_REVIEW_PERCENTAGES'

const initialState = {
    reviews: [],
    reviewPercentages: {},
}

export function reviewReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_REVIEWS:
            return { ...state, reviews: cmd.reviews }
        case REMOVE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.filter(r => r._id !== cmd.reviewId)
            }
        case ADD_REVIEW:
            return {
                ...state,
                reviews: [cmd.review, ...state.reviews]
            }
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(r => r._id === cmd.review._id ? cmd.review : r)
            }
        case SET_RATING_STATS:
            return { ...state, ratingStats: cmd.ratingStats }

        default: return state
    }
}