import { getLoggedinUser } from "../../src/services/user/index-user.js"



export const SET_USERS = 'SET_USERS'
export const REMOVE_USER = 'REMOVE_USER'
export const ADD_USER = 'ADD_USER'
export const UPDATE_USER = 'UPDATE_USER'

export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER'

export const SET_IS_LOGIN_OPEN = 'SET_IS_LOGIN_OPEN'

const initialState = {
    users: [],
    loggedinUser: getLoggedinUser(),
    isLoginSignupOpen: false
}

export function userReducer(state = initialState, cmd = {}) {
    switch (cmd.type) {
        case SET_USERS:
            return { ...state, users: cmd.users }
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(u => u._id !== cmd.userId)
            }
        case ADD_USER:
            return {
                ...state,
                users: [cmd.user, ...state.users]
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(u => u._id === cmd.user._id ? cmd.user : u)
            }
        case SET_LOGGEDIN_USER:
            return { ...state, loggedinUser: cmd.loggedinUser }

        case SET_IS_LOGIN_OPEN:
            return { ...state, isLoginSignupOpen: cmd.isLoginSignupOpen }

        default: return state
    }
}