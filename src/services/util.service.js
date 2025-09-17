export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

export function throttle(func, limit) {
    let lastCall = 0
    return function (...args) {
        const now = Date.now()
        if (now - lastCall >= limit) {
            lastCall = now
            func(...args)
        }
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function cleanSearchParams(searchParams) {

    const cleanedParams = {}

    for (const field in searchParams) {
        if (field === 'pageIdx' || field === 'inStock') {
            cleanedParams[field] = searchParams[field]
        } else if (searchParams[field]) {
            cleanedParams[field] = searchParams[field]
        }
    }

    return cleanedParams
}


export function getUiTheme() {
    return {
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "var(--mainSiteClrTheme)",
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        "&.Mui-focused": {
                            color: "var(--mainSiteClrTheme)",
                        },
                    },
                },
            },
        },
    }
}


export function formatTimeAgo(timestampe) {
    const currDate = Date.now()
    const Hour = 1000 * 60 * 60
    const day = Hour * 24

    if (currDate - timestampe < Hour) {
        const timePass = currDate - timestampe
        const Minutes = Math.floor(timePass / (1000 * 60))
        if (Minutes === 0) {
            return 'A moment ago'
        } else {
            return Minutes + ` ${Minutes > 1 ? "Minutes" : "Minute"} ago`
        }
    } else if (currDate - timestampe < day) {
        const timePass = currDate - timestampe
        const Hours = Math.floor(timePass / (Hour))
        return Hours + ` ${Hours > 1 ? "Hours" : "Hour"} ago`
    } else {
        const options = { day: "2-digit", month: "long", year: "numeric" }
        const date = new Date(timestampe)
        const formattedDate = date.toLocaleString("en-US", options)
        return formattedDate
    }
}