import { storageService } from "../async-storage.service"
import { loadFromStorage, makeId, saveToStorage } from "../util.service"

export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    add,
    update,
    // auth
    login,
    signup,
    logout,
}

const USER_KEY = 'USER_KEY'

_createUsersArray()


/// user 

async function query(filterBy = {}) {
    return storageService.query(USER_KEY)
}

async function getById(userId) {
    return storageService.get(USER_KEY, userId)
}

async function getByUsername(username) {
    const users = await storageService.query(USER_KEY)
    const user = users.find(user => user.username === username)
    return user
}

async function remove(userId) {
    return storageService.remove(USER_KEY, userId)
}

async function add(credentials) {
    try {
        const { username, password, fullname } = credentials

        if (!username || !password || !fullname) {
            throw new Error("missing required credentials")
        }

        const isUserNameTaken = await getByUsername(username)

        if (isUserNameTaken) {
            throw new Error("user name is taken");
        }

        credentials.isAdmin = false
        credentials.createdAt = Date.now()
        const user = await storageService.post(USER_KEY, credentials)
        delete user.password

        return user
    } catch (err) {
        throw err;
    }

}

async function update(userToUpdate) {
    try {
        const { _id, username, imgUrl } = userToUpdate

        if (!_id) {
            throw new Error("missing required credentials");
        }

        const user = await getById(_id)

        if (!user) {
            throw new Error("user dont found");
        }


        if (username) {
            const isUserNameTaken = await getByUsername(username)

            if (isUserNameTaken) {
                throw new Error("user name is taken");
            }

            user.username = username
        }

        if (imgUrl) user.imgUrl = imgUrl


        const savedUser = await storageService.put(USER_KEY, user)
        delete savedUser.password

        setLoggedinUser(savedUser)

        return savedUser

    } catch (err) {
        throw err;
    }

}


/// auth

async function login({ username, password }) {

    if (!username || !password) {
        throw new Error("missing required credentials");
    }

    const user = await getByUsername(username)

    if (!user || user?.password !== password) {
        throw new Error("username or password invalid");
    }

    delete user.password

    return setLoggedinUser(user)
}


async function signup({ username, password, fullname, imgUrl }) {

    if (!username || !password || !fullname) {
        throw new Error("missing required credentials");
    }

    const account = await add({ username, password, fullname, imgUrl })

    const user = await login({ username, password })

    return user
}

function setLoggedinUser(user) {
    user = {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
        imgUrl: user.imgUrl,
    }

    sessionStorage.setItem('loggedinUser', JSON.stringify(user))

    return user
}

function logout() {
    sessionStorage.removeItem('loggedinUser')
}


// private func

function _createUsersArray() {

    var users = loadFromStorage(USER_KEY)
    if (!users || !users.length) {
        var users = []

        for (let i = 0; i < 20; i++) {
            users.push(_createUser(i))
        }

        const admin = _createAdmin()
        users.push(admin)

        saveToStorage(USER_KEY, users)
    }
}


function _createUser(i) {
    return {
        _id: makeId(),
        username: 'toy' + i,
        password: '1010',
        fullname: 'toy' + i,
        isAdmin: false,
        createdAt: Date.now(),
        imgUrl: ''
    }
}

function _createAdmin() {
    return {
        _id: makeId(),
        username: 'e33',
        password: '1010',
        fullname: 'eliad',
        isAdmin: true,
        createdAt: Date.now(),
        imgUrl: ''
    }
}