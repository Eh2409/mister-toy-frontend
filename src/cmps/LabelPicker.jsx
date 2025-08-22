
import { useState, useEffect, useRef } from 'react'

export function LabelPicker({ labels, filterLabels, onSaveLabels }) {

    const [labelsToEdit, setLabelsToEdit] = useState(filterLabels)


    useEffect(() => {
        const filterLabelsStr = JSON.stringify(filterLabels.sort())
        const labelsToEditStr = JSON.stringify(labelsToEdit.sort())

        if (labelsToEditStr !== filterLabelsStr) {
            setLabelsToEdit(filterLabels)
        }

    }, [filterLabels])


    useEffect(() => {
        onSaveLabels(labelsToEdit)
    }, [labelsToEdit])


    function handleChange({ target }) {
        var { name } = target

        if (!labelsToEdit.includes(name)) {
            setLabelsToEdit(prev => ([...prev, name]))
        } else {
            setLabelsToEdit(prev => prev.filter(l => l !== name))
        }
    }

    return (
        <section className="labels-picker flex flex-column">

            {labels.map(label => {
                return <label htmlFor={label} key={label} className={labelsToEdit.includes(label) ? "active" : ""}>
                    <input type="checkbox"
                        name={label}
                        id={label}
                        checked={labelsToEdit.includes(label)}
                        onChange={handleChange} />
                    <span>{label}</span>
                </label>
            })}

        </section>
    )
}