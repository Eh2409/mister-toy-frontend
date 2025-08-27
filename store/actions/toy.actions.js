import { toyService } from "../../src/services/toy/index-toy.js";
import { ADD_TOY, REMOVE_TOY, SET_IS_LOADING, SET_LABELS, SET_MAX_PAGE_COUNT, SET_SEARCH_WORD, SET_TOYS, UPDATE_TOY } from "../reducers/toy.reducer.js";
import { store } from "../store.js";

export const toyActions = {
    load,
    remove,
    save,
    loadLabels,
    setSearchWord
}

function load(filterBy = {}, isLoaderActive = true) {
    if (isLoaderActive) {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    }

    return toyService.query(filterBy)
        .then(({ toys, maxPageCount }) => {
            store.dispatch({ type: SET_TOYS, toys })
            store.dispatch({ type: SET_MAX_PAGE_COUNT, maxPageCount })
        })
        .catch(err => {
            console.log('toy action -> Cannot load toys', err)
            throw err
        })
        .finally(() => {
            if (isLoaderActive) {
                setTimeout(() => {
                    store.dispatch({ type: SET_IS_LOADING, isLoading: false })
                }, 300)
            }
        })
}

function remove(toyId) {
    return toyService.remove(toyId)
        .then(maxPageCount => {
            store.dispatch({ type: REMOVE_TOY, toyId })
            store.dispatch({ type: SET_MAX_PAGE_COUNT, maxPageCount })
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


function loadLabels() {
    return toyService.getLabels()
        .then(labels => {
            store.dispatch({ type: SET_LABELS, labels })
        })
        .catch(err => {
            console.log('toy action -> Cannot load toys labels', err)
            throw err
        })
}

function setSearchWord(searchWord) {
    store.dispatch({ type: SET_SEARCH_WORD, searchWord })
}