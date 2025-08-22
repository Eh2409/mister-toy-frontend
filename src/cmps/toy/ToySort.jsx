
import { useState, useEffect } from 'react'

export function ToySort({ sortBy, onSetFilterBy }) {

    const [sortByToEdit, setSortByToEdit] = useState(sortBy)
    const [selectValue, setSelectValue] = useState('')

    useEffect(() => {
        onSetSelectValue(sortBy)
    }, [])

    useEffect(() => {
        onSetFilterBy(sortByToEdit)
    }, [sortByToEdit])


    function handleChange({ target }) {
        var sortOptions = {}

        switch (target.value) {
            case "low":
                sortOptions = { sortType: 'price', dir: 1 }
                break
            case "high":
                sortOptions = { sortType: 'price', dir: -1 }
                break
            case "a":
                sortOptions = { sortType: 'name', dir: 1 }
                break
            case "z":
                sortOptions = { sortType: 'name', dir: -1 }
                break
            case "new":
                sortOptions = { sortType: 'createdAt', dir: -1 }
                break
            case "old":
                sortOptions = { sortType: 'createdAt', dir: 1 }
                break
        }

        setSelectValue(target.value)
        setSortByToEdit(sortOptions)
    }

    function onSetSelectValue(sortBy) {
        const { sortType, dir } = sortBy

        var value = 'new'

        if (sortType === 'createdAt' && dir === -1) value = 'new'
        else if (sortType === 'createdAt' && dir === 1) value = 'old'
        else if (sortType === 'name' && dir === -1) value = 'z'
        else if (sortType === 'name' && dir === 1) value = 'a'
        else if (sortType === 'price' && dir === 1) value = 'low'
        else if (sortType === 'price' && dir === -1) value = 'high'

        setSelectValue(value)
    }

    return (
        <section className="toy-sort">
            <select className="btn" name="sort" id="sort" onChange={handleChange} value={selectValue}>
                <option value="new">Date: New to Old</option>
                <option value="old">Date: Old to New</option>
                <option value="a">Name: A to Z</option>
                <option value="z">Name: Z to A</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
            </select>
        </section>
    )
}
