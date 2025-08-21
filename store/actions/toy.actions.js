import { toyService } from "../../src/services/Toy/index-toy.js";
import { ADD_TOY, REMOVE_TOY, SET_TOYS, UPDATE_TOY } from "../reducers/toy.reducer.js";
import { store } from "../store.js";

export const toyActions = {
    load,
    remove,
    save,
}

function load(filterBy = {}) {
    return toyService.query(filterBy)
        .then(toys => {
            store.dispatch({ type: SET_TOYS, toys })
        })
        .catch(err => {
            console.log('toy action -> Cannot load toys', err)
            throw err
        })
}

function remove(toyId) {
    return toyService.remove(toyId)
        .then(() => {
            console.log('toyId:', toyId)
            store.dispatch({ type: REMOVE_TOY, toyId })
        })
        .catch(err => {
            console.log('toy action -> Cannot remove toy', err)
            throw err
        })
}

function save(toyToSave) {
    const method = toyToSave?._id ? 'update' : 'add'

    return toyService.save(toyToSave)
        .then(savedToy => {
            if (method === 'update') {
                store.dispatch({ type: UPDATE_TOY, toy: savedToy })
            } else {
                store.dispatch({ type: ADD_TOY, toy: savedToy })
            }
            return savedToy?._id
        })
        .catch(err => {
            console.log('toy action -> Cannot save toys', err)
            throw err
        })
}