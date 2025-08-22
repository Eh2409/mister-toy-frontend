
import { useState, useEffect, useRef } from 'react'
import { LabelPicker } from '../LabelPicker'

import { toyService } from '../../services/Toy/index-toy.js'


export function ToyFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const resetFilterRef = useRef({ name: '', price: 0, labels: [], inStock: 'all' })

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

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

    const { name, price, labels, inStock } = filterByToEdit
    return (
        <section className='toy-filter'>
            <div>
                <h2>Filter Toys</h2>
                <form >
                    <input value={name} onChange={handleChange}
                        type="search" placeholder="By Name" id="name" name="name"
                    />

                    <input value={price || ''} onChange={handleChange}
                        type="number" placeholder="By Price" id="price" name="price"
                    />

                    <label htmlFor="inStock">In Stock</label>

                    <select name="inStock" id="inStock" value={inStock} onChange={handleChange}>
                        <option value="all">All</option>
                        <option value="true">In stock</option>
                        <option value="false">Out of stock</option>
                    </select>

                    <LabelPicker labels={toyService.getLabels()} filterLabels={labels} onSaveLabels={onSaveLabels} />

                    <button type="button" className="reset-btn" onClick={onReset}>Reset</button>
                </form>
            </div>
        </section>
    )
}