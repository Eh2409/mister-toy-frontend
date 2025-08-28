
import { useState, useEffect, useRef } from 'react'
import { useSelector } from "react-redux"

// material-ui
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider } from "@mui/material/styles"
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

//services
import { toyActions } from '../../../store/actions/toy.actions.js'
import { debounce } from '../../services/util.service.js'

// hooks
import { useEffectOnUpdate } from '../../hooks/useEffectOnUpdate.js'

//cmps
import { LabelPicker } from '../LabelPicker'


export function ToyFilter({ filterBy, onSetFilterBy, toysLabels, closeMobileFilter }) {

    const searchWord = useSelector(storeState => storeState.toyModule.searchWord)
    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const resetFilterRef = useRef({ name: '', price: 0, brands: [], productTypes: [], companies: [], inStock: 'all' })

    const debounceRef = useRef(debounce(onSetFilterBy, 600))

    useEffectOnUpdate(() => {
        if (filterBy.name !== filterByToEdit.name || filterBy.price !== filterByToEdit.price) {
            debounceRef.current(filterByToEdit)
        } else {
            onSetFilterBy(filterByToEdit)
        }
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


    const theme = createTheme({
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
    });

    return (
        <section className='toy-filter'>

            <button className='close-btn' onClick={closeMobileFilter}>x</button>

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
                    <ThemeProvider theme={theme}>
                        <div className='filter-options'>


                            <TextField
                                id="name"
                                label="By Name"
                                variant="outlined"
                                name="name"
                                value={name}
                                onChange={handleChange}
                            />


                            <div className='flex'>

                                <TextField
                                    id="price"
                                    label="By Price"
                                    variant="outlined"
                                    name="price"
                                    type="number"
                                    value={price || ''}
                                    onChange={handleChange}
                                />

                                <FormControl fullWidth>
                                    <InputLabel id="inStock">Availability</InputLabel>
                                    <Select
                                        labelId="inStock"
                                        id="inStock"
                                        value={inStock}
                                        label="Availability"
                                        name="inStock"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="true">In stock</MenuItem>
                                        <MenuItem value="false">Out of stock</MenuItem>
                                    </Select>
                                </FormControl>



                            </div>

                            <button type="button" className="t-a" onClick={onReset}>Reset</button>
                        </div>
                    </ThemeProvider>

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