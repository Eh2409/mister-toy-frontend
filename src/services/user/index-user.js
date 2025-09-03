
import { userService as local } from "./user.service.local.js"

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
    }
}


const service = local
export const userService = { getEmptyUser, ...service }