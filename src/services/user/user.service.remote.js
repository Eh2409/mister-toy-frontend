import { httpService } from "../http.service.js"

export const userService = {
    query,
    getById,
    remove,
    update,
    // auth
    login,
    signup,
    logout,
    getLoggedinUser,
}

const BASE_URL_USER = 'user/'
const BASE_URL_AUTH = 'auth/'


/// user 

async function query(filterBy = {}) {
    return httpService.get(BASE_URL_USER, filterBy)
}

async function getById(userId) {
    return httpService.get(BASE_URL_USER + userId)
}

async function remove(userId) {
    return httpService.delete(BASE_URL_USER + userId)
}

async function update(userToUpdate) {
    try {
        const savedUser = await httpService.put(BASE_URL_USER + userToUpdate._id, userToUpdate)
        if (!savedUser) return
        return setLoggedinUser(savedUser)
    } catch (err) {
        throw err;
    }
}


/// auth

async function login(credentials) {
    const user = await httpService.post(BASE_URL_AUTH + 'login', credentials)
    return setLoggedinUser(user)
}


async function signup(credentials) {
    const user = await httpService.post(BASE_URL_AUTH + 'signup', credentials)
    return setLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem('loggedinUser')
    return httpService.post(BASE_URL_AUTH + 'logout')
}

function setLoggedinUser(user) {
    user = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    }

    sessionStorage.setItem('loggedinUser', JSON.stringify(user))

    return user
}

function getLoggedinUser() {
    const json = sessionStorage.getItem('loggedinUser')
    const user = JSON.parse(json)
    return user
}

