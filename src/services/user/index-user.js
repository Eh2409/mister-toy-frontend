
import { userService as local } from "./user.service.local.js"
import { userService as remote } from "./user.service.remote.js"

const isRemote = false

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: '',
    }
}

export function getLoggedinUser() {
    const json = sessionStorage.getItem('loggedinUser')
    const user = JSON.parse(json)
    return user
}


const service = isRemote ? remote : local
export const userService = { getEmptyCredentials, getLoggedinUser, ...service }