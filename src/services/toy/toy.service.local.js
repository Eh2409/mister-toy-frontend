import { storageService } from "../async-storage.service"
import { getLoggedinUser } from "../user/index-user.js"
import { getRandomIntInclusive, loadFromStorage, makeId, makeLorem, saveToStorage } from "../util.service"

export const toyService = {
    query,
    getById,
    remove,
    save,
    getLabels,
    getLabelsChartsData,
    saveMsg,
    removeMsg,
}

const TOY_KEY = 'TOY_KEY'
const PAGE_SIZE = 8

_createToysArray()

async function query(filterBy = {}) {

    try {
        var toys = await storageService.query(TOY_KEY)

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


        if (filterBy.brands?.length > 0) {
            toys = toys.filter(toy => {
                return filterBy.brands.some(brand => toy.brands.includes(brand))
            })
        }

        if (filterBy.productTypes?.length > 0) {
            toys = toys.filter(toy => {
                return filterBy.productTypes.some(productType => toy.productTypes.includes(productType))
            })
        }

        if (filterBy.companies?.length > 0) {
            toys = toys.filter(toy => {
                return filterBy.companies.some(company => toy.companies.includes(company))
            })
        }


        if (filterBy.sortType && filterBy.dir) {
            if (filterBy.sortType === 'price') {
                toys = toys.sort((t1, t2) => (t1.price - t2.price) * filterBy.dir)
            } else if (filterBy.sortType === 'createdAt') {
                toys = toys.sort((t1, t2) => (t1.createdAt - t2.createdAt) * filterBy.dir)
            } else if (filterBy.sortType === 'name') {
                toys = toys.sort((t1, t2) => (t1.name.localeCompare(t2.name)) * filterBy.dir)
            }
        }

        const maxPageCount = Math.ceil(toys.length / PAGE_SIZE)

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            toys = toys.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return { toys, maxPageCount }

    } catch (err) {
        throw err
    }
}


async function getById(toyId) {
    return storageService.get(TOY_KEY, toyId)
}

async function remove(toyId) {
    return storageService.remove(TOY_KEY, toyId).then(() => getMaxPage())
}

async function getMaxPage() {
    try {
        const toys = await storageService.query(TOY_KEY)
        return Math.ceil(toys.length / PAGE_SIZE)
    } catch (error) {
        throw err
    }
}


async function save(toy) {

    if (toy?._id) {
        return storageService.put(TOY_KEY, toy)
    } else {
        toy.createdAt = Date.now()
        return storageService.post(TOY_KEY, toy)
    }
}

async function getLabels() {

    const brands = [
        "Naruto",
        "Dragon Ball",
        "One Piece",
        "My Hero Academia",
        "Demon Slayer"
    ]

    const productTypes = [
        "Action Figure",
        "Nendoroid",
        "Model Kit",
        "Plush Toy",
        "Statue"
    ]

    const companies = [
        "Bandai",
        "Good Smile Company",
        "Banpresto",
        "Kotobukiya",
        "Funko"
    ]

    return { brands, productTypes, companies }
}


async function getLabelsChartsData() {
    try {
        const [brands, productTypes, companies] = await Promise.all(
            [calculateLabelPercentages('brands'),
            calculateLabelPercentages('productTypes'),
            calculateLabelPercentages('companies')])

        return { brands, productTypes, companies }

    } catch (err) {
        throw err
    }
}


async function calculateLabelPercentages(LabelType) {

    const toys = await storageService.query(TOY_KEY)

    const labelCounts = toys.reduce((acc, toy) => {

        if (!toy.inStock) return acc

        toy[LabelType].forEach(label => {
            if (!acc[label]) acc[label] = 1
            else acc[label]++
            if (!acc['totalLength']) acc['totalLength'] = 1
            else acc['totalLength']++

            return
        })
        return acc
    }, {})

    return Object.entries(labelCounts)
        .filter(([key]) => key !== 'totalLength')
        .map(([key, val]) => {
            return {
                name: key,
                percent: (val / (labelCounts['totalLength']) * 100).toFixed(1),
                toysCount: val
            }

        })
}


async function saveMsg(msgToSave, toyId) {
    try {

        const toy = await getById(toyId)

        if (!toy) {
            throw new Error(`Toy with id ${toyId} not found`)
        }

        const loggedinUser = getLoggedinUser()

        if (!loggedinUser) {
            throw new Error('User must be logged in to add msg')
        }

        msgToSave.by = { _id: loggedinUser._id, username: loggedinUser.username }
        msgToSave.id = makeId()
        msgToSave.at = Date.now()
        toy.msgs.push(msgToSave)

        await save(toy)
        return msgToSave

    } catch (err) {
        throw err
    }
}

async function removeMsg(msgid, toyId) {
    try {

        const toy = await getById(toyId)

        if (!toy) {
            throw new Error(`Toy with id ${toyId} not found`)
        }

        toy.msgs = toy.msgs.filter(m => m.id !== msgid)

        await save(toy)
        return

    } catch (err) {
        throw err
    }
}



// private func

function _createToysArray() {

    var toys = loadFromStorage(TOY_KEY)
    if (!toys || !toys.length) {
        var toys = []

        return getLabels().then(({ brands, productTypes, companies }) => {
            for (let i = 0; i < 20; i++) {
                const brand = brands[getRandomIntInclusive(0, brands.length - 1)]
                const productType = productTypes[getRandomIntInclusive(0, productTypes.length - 1)]
                const company = companies[getRandomIntInclusive(0, companies.length - 1)]
                const msgs = _createMsgsArray()
                toys.push(_createToy(brand, productType, company, msgs))
            }
            saveToStorage(TOY_KEY, toys)
        })


    }
}


function _createToy(brand, productType, company, msgs) {
    return {
        _id: makeId(),
        name: makeLorem(1),
        imgUrls: [`./images/toys/${getRandomIntInclusive(1, 5)}.png`],
        price: getRandomIntInclusive(10, 100),
        brands: [brand] || [],
        productTypes: [productType] || [],
        companies: [company] || [],
        createdAt: Date.now(),
        inStock: Math.random() > 0.5 ? true : false,
        description: makeLorem(20),
        msgs: msgs
    }
}

function _createMsgsArray() {
    const msgs = []
    for (let i = 0; i < getRandomIntInclusive(1, 4); i++) {
        msgs.push(_createMsg())
    }
    return msgs
}



function _createMsg() {
    return {
        id: makeId(),
        txt: makeLorem(getRandomIntInclusive(1, 10)),
        at: Date.now(),
        by: {
            _id: makeId(),
            username: makeLorem(1)
        }
    }
}