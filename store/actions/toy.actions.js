import { toyService } from "../../src/services/toy/index-toy.js";
import { ADD_TOY, REMOVE_TOY, SET_CHARTS_DATA, SET_IS_LOADING, SET_LABELS, SET_MAX_PAGE_COUNT, SET_SEARCH_WORD, SET_TOYS, UPDATE_TOY } from "../reducers/toy.reducer.js";
import { store } from "../store.js";

export const toyActions = {
    load,
    remove,
    save,
    loadLabels,
    loadChartsData,
    setSearchWord
}

async function load(filterBy = {}, isLoaderActive = true) {
    if (isLoaderActive) {
        store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    }

    console.log('filterBy:', filterBy)

    try {
        const { toys, maxPageCount } = await toyService.query(filterBy)
        console.log('maxPageCount:', maxPageCount)
        store.dispatch({ type: SET_TOYS, toys })
        store.dispatch({ type: SET_MAX_PAGE_COUNT, maxPageCount })
    } catch (err) {
        console.log('toy action -> Cannot load toys', err)
        throw err
    } finally {
        if (isLoaderActive) {
            setTimeout(() => {
                store.dispatch({ type: SET_IS_LOADING, isLoading: false })
            }, 300)
        }
    }
}

async function remove(toyId) {
    try {
        const maxPageCount = await toyService.remove(toyId)
        store.dispatch({ type: REMOVE_TOY, toyId })
        store.dispatch({ type: SET_MAX_PAGE_COUNT, maxPageCount })
    } catch (err) {
        console.log('toy action -> Cannot remove toy', err)
        throw err
    }
}


async function save(toyToSave) {
    const method = toyToSave?._id ? 'update' : 'add'

    try {
        const savedToy = await toyService.save(toyToSave)
        if (method === 'update') {
            store.dispatch({ type: UPDATE_TOY, toy: savedToy })
        } else {
            store.dispatch({ type: ADD_TOY, toy: savedToy })
        }
        return savedToy?._id
    } catch (err) {
        console.log('toy action -> Cannot save toys', err)
        throw err
    }
}

async function loadLabels() {
    try {
        const labels = await toyService.getLabels()
        store.dispatch({ type: SET_LABELS, labels })
    } catch (err) {
        console.log('toy action -> Cannot load toys labels', err)
        throw err
    }
}

async function loadChartsData() {
    try {
        const chartsData = await toyService.getLabelsChartsData()
        store.dispatch({ type: SET_CHARTS_DATA, chartsData })
    } catch (err) {
        console.log('toy action -> Cannot load Charts data', err)
        throw err
    }
}

function setSearchWord(searchWord) {
    store.dispatch({ type: SET_SEARCH_WORD, searchWord })
}
