import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"

import { userService } from "../services/user/index-user.js"
import { userActions } from "../../store/actions/user.actions.js"


export function Users(props) {

    const users = useSelector(storeState => storeState.userModule.users)
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    console.log('users:', users)
    console.log('loggedinUser:', loggedinUser)

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        await userActions.loadUsers()
    }


    async function getUser() {
        try {
            var userId = prompt('userId')
            const user = await userService.getById(userId)
            console.log('user:', user)
        } catch (err) {
            console.log('err:', err)
        }
    }

    async function remove() {
        try {
            var userId = prompt('userId')
            await userActions.remove(userId)
        } catch (err) {
            console.log('err:', err)
        }
    }


    async function updateUser() {
        try {
            var userId = prompt('userId')
            var username = prompt('username')
            const userToAdd = { _id: userId, username }
            await userActions.update(userToAdd)
        } catch (err) {
            console.log('err:', err)
        }
    }

    async function signup() {
        try {
            var username = prompt('username')
            var password = prompt('password')
            var fullname = prompt('fullname')
            const credentials = { username, password, fullname }
            await userActions.signup(credentials)

        } catch (err) {
            console.log('err:', err)
        }
    }
    async function login() {
        try {
            var username = prompt('username')
            var password = prompt('password')
            const credentials = { username, password }
            await userActions.login(credentials)

        } catch (err) {
            console.log('err:', err)
        }
    }

    async function logout() {
        try {
            await userActions.logout()

        } catch (err) {
            console.log('err:', err)
        }
    }




    return (
        <section>

            <button onClick={getUser}>get user</button>
            <button onClick={remove}>remove user</button>
            <button onClick={updateUser}>update user</button>
            <button onClick={signup}>signup</button>
            <button onClick={login}>login</button>
            <button onClick={logout}>logout</button>

        </section>
    )
}