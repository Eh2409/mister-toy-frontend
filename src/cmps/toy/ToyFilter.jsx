
import { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux"

//services
import { toyActions } from '../../../store/actions/toy.actions.js'

//cmps
import { LabelPicker } from '../LabelPicker'


export function ToyFilter({ filterBy, onSetFilterBy, toysLabels }) {
    toyActions
    const searchWord = useSelector(storeState => storeState.toyModule.searchWord)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const resetFilterRef = useRef({ name: '', price: 0, labels: [], inStock: 'all' })

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    useEffect(() => {
        if (searchWord) {
            setSearchWordInFilter(searchWord)
        }
    }, [searchWord])

    function handleChange({ target }) {
        var { value, name, type } = target

        if (type === "number") value = +value

        if (name === 'inStock' && value !== "all") {
            value = value === "true" ? true : false
        }


        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
    }

    function onSaveLabels(labelsToSave) {

        const labelsToSaveStr = JSON.stringify(labelsToSave.sort())
        const filterLabelsStr = JSON.stringify(filterByToEdit.labels.sort())

        if (labelsToSaveStr === filterLabelsStr) return

        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: labelsToSave }))
    }


    function onReset() {
        setFilterByToEdit(resetFilterRef.current)
    }

    function onRemoveAppliedFilters(key, val) {
        if (key === 'labels') {
            setFilterByToEdit(prevFilter => ({
                ...prevFilter,
                labels: prevFilter.labels.filter(l => l !== val)
            }))
        } else if (key === 'inStock') {
            setFilterByToEdit(prevFilter => ({ ...prevFilter, inStock: 'all' }))
        } else {
            setFilterByToEdit(prevFilter => ({ ...prevFilter, [key]: '' }))
        }
    }

    function setSearchWordInFilter(searchWord) {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, name: searchWord }))
        toyActions.setSearchWord('')
    }

    function isAppliedFilterVisible(filterByToEdit) {
        const { name, price, labels, inStock } = filterByToEdit
        if (!name && !price && labels.length <= 0 && inStock === 'all') return false
        else return true
    }

    const { name, price, labels, inStock } = filterByToEdit
    return (
        <section className='toy-filter'>
            <div>

                {isAppliedFilterVisible(filterByToEdit) && <section>
                    <h3>Applied Filters</h3>
                    <div className='applied-filter flex'>

                        {Object.entries(filterByToEdit).map(([key, val]) => {
                            if (key === 'inStock' && val === 'all') return

                            if (key === 'inStock') return <div key={val + key} className='filter-val'
                                onClick={() => onRemoveAppliedFilters(key, val)}>
                                <span>x</span> {val ? "In Stock" : "Out of Stock"}</div>

                            if (key === 'labels' && val.length <= 0) return

                            if (key === 'labels' && val.length > 0) return val.map(l => {
                                return <div key={l} className='filter-val'
                                    onClick={() => onRemoveAppliedFilters(key, l)} >
                                    <span>x</span> {l}</div>
                            })

                            if (val) return <div key={val + key} className='filter-val'
                                onClick={() => onRemoveAppliedFilters(key, val)}><span>x</span> {val}</div>
                        })}

                    </div>
                </section>}

                <h2>Filter Toys</h2>
                <form >
                    <div className='filter-options'>

                        <input value={name} onChange={handleChange}
                            type="search" placeholder="By Name" id="name" name="name"
                        />

                        <div className='flex'>
                            <input value={price || ''} onChange={handleChange}
                                type="number" placeholder="By Price" id="price" name="price"
                            />

                            <select name="inStock" id="inStock" value={inStock} onChange={handleChange}>
                                <option value="all">All</option>
                                <option value="true">In stock</option>
                                <option value="false">Out of stock</option>
                            </select>
                        </div>

                        <button type="button" className="t-a" onClick={onReset}>Reset</button>
                    </div>


                    <h3>Toy Labels</h3>
                    <LabelPicker labels={toysLabels} filterLabels={labels} onSaveLabels={onSaveLabels} />
                </form>
            </div>
        </section >
    )
}