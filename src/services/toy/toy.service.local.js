import { storageService } from "../async-storage.service"
import { getRandomIntInclusive, loadFromStorage, makeId, makeLorem, saveToStorage } from "../util.service"

export const toyService = {
    query,
    getById,
    remove,
    save,
    getLabels
}

const TOY_KEY = 'TOY_KEY'

_createToysArray()

function query(filterBy = {}) {
    return storageService.query(TOY_KEY).then(toys => {

        if (filterBy.name) {
            const regExp = new RegExp(filterBy.name, 'i')
            toys = toys.filter(toy => regExp.test(toy.name))
        }

        if (filterBy.price) {
            toys = toys.filter(toy => toy.price >= filterBy.price)
        }

        if (filterBy.inStock !== 'all') {
            toys = toys.filter(toy => toy.inStock === filterBy.inStock)
        }

        if (filterBy.labels?.length > 0) {
            toys = toys.filter(toy => {
                return filterBy.labels.some(label => toy.labels.includes(label))
            })
        }

        toys = toys.sort((t1, t2) => (t1.createdAt - t2.createdAt) * -1)

        return toys
    })
}

function getById(toyId) {
    return storageService.get(TOY_KEY, toyId)
}

function remove(toyId) {
    return storageService.remove(TOY_KEY, toyId)
}

function save(toy) {

    if (toy?._id) {
        return storageService.put(TOY_KEY, toy)
    } else {
        toy.createdAt = Date.now()
        return storageService.post(TOY_KEY, toy)
    }
}

function getLabels() {
    return ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
        'Outdoor', 'Battery Powered']
}


// private func

function _createToysArray() {

    var toys = loadFromStorage(TOY_KEY)
    if (!toys || !toys.length) {
        var toys = []
        const labels = getLabels()
        for (let i = 0; i < 20; i++) {
            const toyLabel = labels[getRandomIntInclusive(0, labels.length - 1)]
            toys.push(_createToy(toyLabel))
        }
        saveToStorage(TOY_KEY, toys)
    }
}


function _createToy(label) {
    return {
        _id: makeId(),
        name: makeLorem(1),
        imgUrl: `/public/images/toys/${getRandomIntInclusive(1, 5)}.png`,
        price: getRandomIntInclusive(10, 100),
        labels: [label],
        createdAt: Date.now(),
        inStock: Math.random() > 0.5 ? true : false,
        description: makeLorem(20),
    }
}