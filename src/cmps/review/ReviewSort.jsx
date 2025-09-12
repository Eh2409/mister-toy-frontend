
import { useState, useEffect } from 'react'

// material-ui

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider } from "@mui/material/styles"

// services
import { getUiTheme } from '../../services/util.service';
// hook
import { useEffectOnUpdate } from '../../hooks/useEffectOnUpdate.js'

export function ReviewSort({ sortBy, onSetFilterBy }) {

    const [sortByToEdit, setSortByToEdit] = useState(sortBy)
    const [selectValue, setSelectValue] = useState('')

    useEffect(() => {
        onSetSelectValue(sortBy)
    }, [])

    useEffectOnUpdate(() => {
        onSetFilterBy(sortByToEdit)
    }, [sortByToEdit])


    function handleChange({ target }) {
        var sortOptions = {}

        switch (target.value) {
            case "low":
                sortOptions = { sortType: 'rating', dir: 1 }
                break
            case "high":
                sortOptions = { sortType: 'rating', dir: -1 }
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
        else if (sortType === 'rating' && dir === 1) value = 'low'
        else if (sortType === 'rating' && dir === -1) value = 'high'

        setSelectValue(value)
    }

    const theme = createTheme(getUiTheme())


    return (
        <section className="toy-sort">
            <ThemeProvider theme={theme}>
                <FormControl fullWidth>
                    <InputLabel id="sortBy">Sort By</InputLabel>
                    <Select
                        labelId="sortBy"
                        id="sortBy"
                        value={selectValue}
                        label="Sort By"
                        onChange={handleChange}
                    >
                        <MenuItem value="new">Date: New to Old</MenuItem>
                        <MenuItem value="old">Date: Old to New</MenuItem>
                        <MenuItem value="low">Rating: Low to High</MenuItem>
                        <MenuItem value="high">Rating: High to Low</MenuItem>
                    </Select>
                </FormControl>
            </ThemeProvider>
        </section >
    )
}
