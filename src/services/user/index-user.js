
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


const service = isRemote ? remote : local
export const userService = { getEmptyCredentials, ...service }