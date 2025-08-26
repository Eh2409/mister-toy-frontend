
import { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux"

//services
import { toyActions } from '../../../store/actions/toy.actions.js'

//cmps
import { LabelPicker } from '../LabelPicker'


export function ToyFilter({ filterBy, onSetFilterBy, toysLabels }) {

    const searchWord = useSelector(storeState => storeState.toyModule.searchWord)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const resetFilterRef = useRef({ name: '', price: 0, brands: [], productTypes: [], companies: [], inStock: 'all' })

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

    function onSaveLabels(labelsToSave, labelType) {

        const labelsToSaveStr = JSON.stringify(labelsToSave.sort())
        const filterLabelsStr = JSON.stringify(filterByToEdit[labelType].sort())

        if (labelsToSaveStr === filterLabelsStr) return

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [labelType]: labelsToSave }))
    }


    function onReset() {
        setFilterByToEdit(resetFilterRef.current)
    }

    function onRemoveAppliedFilters(key, val) {
        if (key === 'brands' || key === 'productTypes' || key === 'companies') {
            setFilterByToEdit(prevFilter => ({
                ...prevFilter,
                [key]: prevFilter[key].filter(l => l !== val)
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
        const { name, price, brands, productTypes, companies, inStock } = filterByToEdit
        if (!name && !price && brands?.length <= 0 && productTypes?.length <= 0 && companies?.length <= 0 && inStock === 'all') return false
        else return true
    }

    const { name, price, brands, productTypes, companies, inStock } = filterByToEdit
    
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

                            if (key === 'brands' && val.length <= 0 ||
                                key === 'productTypes' && val.length <= 0 ||
                                key === 'companies' && val.length <= 0) return

                            if (key === 'brands' && val.length > 0 ||
                                key === 'productTypes' && val.length > 0 ||
                                key === 'companies' && val.length > 0) return val.map(l => {
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


                    <h3>Brands</h3>
                    {toysLabels?.brands?.length > 0 && < LabelPicker
                        labels={toysLabels.brands}
                        filterLabels={brands}
                        onSaveLabels={onSaveLabels}
                        labelType={'brands'} />
                    }

                    <h3>Product Types</h3>
                    {toysLabels?.productTypes?.length > 0 && <LabelPicker
                        labels={toysLabels.productTypes}
                        filterLabels={productTypes}
                        onSaveLabels={onSaveLabels}
                        labelType={'productTypes'} />
                    }

                    <h3>Companies</h3>
                    {toysLabels?.companies?.length > 0 && <LabelPicker
                        labels={toysLabels.companies}
                        filterLabels={companies}
                        onSaveLabels={onSaveLabels}
                        labelType={'companies'} />
                    }

                </form>
            </div>
        </section >
    )
}