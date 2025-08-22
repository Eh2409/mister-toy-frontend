
export const SET_TOYS = 'SET_TOYS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const UPDATE_TOY = 'UPDATE_TOY'

export const SET_MAX_PAGE_COUNT = 'SET_MAX_PAGE_COUNT'

export const SET_LABELS = 'SET_LABELS'

const initialState = {
    toys: [],
    maxPageCount: 0,
    labels: []
}

export function toyReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_TOYS:
            return { ...state, toys: cmd.toys }
        case REMOVE_TOY:
            return {
                ...state,
                toys: state.toys.filter(t => t._id !== cmd.toyId)
            }
        case ADD_TOY:
            return {
                ...state,
                toys: [cmd.toy, ...state.toys]
            }
        case UPDATE_TOY:
            return {
                ...state,
                toys: state.toys.map(t => t._id === cmd.toy._id ? cmd.toy : t)
            }
        case SET_MAX_PAGE_COUNT:
            return { ...state, maxPageCount: cmd.maxPageCount }
        case SET_LABELS:
            return { ...state, labels: cmd.labels }

        default: return state
    }
}