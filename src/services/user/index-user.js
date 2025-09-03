
import { userService as local } from "./user.service.local.js"

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: '',
    }
}


const service = local
export const userService = { getEmptyCredentials, ...service }