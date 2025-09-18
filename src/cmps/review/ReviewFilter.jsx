
import { useState, useRef } from 'react'

// material-ui
import TextField from '@mui/material/TextField'
import { createTheme, ThemeProvider } from "@mui/material/styles"

//services
import { debounce, getUiTheme } from '../../services/util.service.js'

// hooks
import { useEffectOnUpdate } from '../../hooks/useEffectOnUpdate.js'

//images
import xMark from '/images/x.svg'


export function ReviewFilter({ filterBy, onSetFilterBy, closeMobileFilter, isMobileFilterOpen }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const resetFilterRef = useRef({ toyName: '', minRating: 0, reviewTxt: '' })

    const debounceRef = useRef(debounce(onSetFilterBy, 600))

    useEffectOnUpdate(() => {
        debounceRef.current(filterByToEdit)
    }, [filterByToEdit])


    function handleChange({ target }) {
        var { value, name, type } = target

        if (type === "number") value = +value

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
    }

    function onReset() {
        setFilterByToEdit(resetFilterRef.current)
    }

    function onRemoveAppliedFilters(key) {
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [key]: '' }))
    }

    function isAppliedFilterVisible(filterByToEdit) {
        const { toyName, minRating, reviewTxt } = filterByToEdit
        if (!toyName && !minRating && !reviewTxt) return false
        else return true
    }

    const { toyName, minRating, reviewTxt } = filterByToEdit


    const theme = createTheme(getUiTheme())

    return (
        <section className={`review-filter ${isMobileFilterOpen ? "mobile-filter-open" : ""}`}>

            <button className='close-btn' onClick={closeMobileFilter}>
                <img src={xMark} alt="x Mark" />
            </button>

            <div>

                {isAppliedFilterVisible(filterByToEdit) && <section>
                    <h3>Applied Filters</h3>
                    <div className='applied-filter flex'>

                        {Object.entries(filterByToEdit).map(([key, val]) => {
                            if (val) return <div key={val + key} className='filter-val'
                                onClick={() => onRemoveAppliedFilters(key, val)}><span>x</span> {val}</div>
                        })}

                    </div>
                </section>}

                <h2>Filter Reviews</h2>
                <form >
                    <ThemeProvider theme={theme}>
                        <div className='filter-options'>

                            <TextField
                                id="toyName"
                                label="By Toy Name"
                                variant="outlined"
                                name="toyName"
                                value={toyName}
                                onChange={handleChange}
                            />


                            <TextField
                                id="rating"
                                label="By Rating"
                                variant="outlined"
                                name="minRating"
                                type="number"
                                value={minRating || ""}
                                onChange={handleChange}
                            />

                            <TextField
                                id="reviewTxt"
                                label="By Review Text"
                                variant="outlined"
                                name="reviewTxt"
                                value={reviewTxt}
                                onChange={handleChange}
                            />

                            <button type="button" className="t-a" onClick={onReset}>Reset</button>
                        </div>
                    </ThemeProvider>

                </form>
            </div>
        </section >
    )
}