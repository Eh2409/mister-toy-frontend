import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

export function LabelPickerUi({ labels, filterLabels, onSaveLabels, labelType, error, helperText }) {

    const [labelsToEdit, setLabelsToEdit] = useState(filterLabels)

    useEffect(() => {
        const filterLabelsStr = JSON.stringify(filterLabels.sort())
        const labelsToEditStr = JSON.stringify(labelsToEdit.sort())

        if (labelsToEditStr !== filterLabelsStr) {
            setLabelsToEdit(filterLabels)
        }

    }, [filterLabels])


    useEffect(() => {
        onSaveLabels(labelsToEdit, labelType)
    }, [labelsToEdit])


    function handleChange({ target }) {
        var { value } = target

        setLabelsToEdit(value)
    }

    return (
        <div>
            <FormControl sx={{ m: 0, width: 100 + "%" }} error={error}>
                <InputLabel id={labelType}>{labelType}</InputLabel>
                <Select
                    labelId={labelType}
                    id={labelType}
                    multiple
                    value={labelsToEdit}
                    onChange={handleChange}
                    input={<OutlinedInput id={labelType} label={labelType} />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value, idx) => (
                                <Chip key={value + idx} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {labels.map(label => (
                        <MenuItem
                            key={label}
                            value={label}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Select>
                {helperText && (
                    <p style={{ color: "#d32f2f", fontSize: "0.8rem", margin: "4px" }}>
                        {helperText}
                    </p>
                )}
            </FormControl>
        </div>
    )
}
