import { socketService } from "../../src/services/socket.service.js"
import { userService } from "../../src/services/user/index-user.js"
import { REMOVE_USER, SET_IS_LOGIN_OPEN, SET_LOGGEDIN_USER, SET_USERS, UPDATE_USER } from "../reducers/user.reducer"
import { store } from "../store.js"


export const userActions = {
    loadUsers,
    remove,
    update,
    setIsLoginSignupPopupOpen,
    // auth
    signup,
    login,
    logout,
}

async function loadUsers(filterBy = {}) {
    try {
        const users = await userService.query(filterBy)
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        throw err
    }
}

async function remove(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        throw err
    }
}

async function update(userToUpdate) {
    try {
        const loggedinUser = await userService.update(userToUpdate)
        store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser })
    } catch (err) {
        throw err
    }
}

// aute

async function signup(credentials) {
    try {
        const loggedinUser = await userService.signup(credentials)
        store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser })
        socketService.login(loggedinUser._id)
    } catch (err) {
        throw err
    }
}

async function login(credentials) {
    try {
        const loggedinUser = await userService.login(credentials)
        store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser })
        socketService.login(loggedinUser._id)
    } catch (err) {
        throw err
    }
}

async function logout() {
    try {
        await userService.logout()
        store.dispatch({ type: SET_LOGGEDIN_USER, loggedinUser: null })
        socketService.logout()
    } catch (err) {
        throw err
    }
}


function setIsLoginSignupPopupOpen(isOpen) {
    store.dispatch({ type: SET_IS_LOGIN_OPEN, isLoginSignupOpen: isOpen })
}