
const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from "./user.service.local.js"
import { userService as remote } from "./user.service.remote.js"

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: '',
        imgUrl: ''
    }
}

export function getLoggedinUser() {
    const json = sessionStorage.getItem('loggedinUser')
    const user = JSON.parse(json)
    return user
}


const service = (VITE_LOCAL === 'true') ? local : remote
export const userService = { getEmptyCredentials, getLoggedinUser, ...service }