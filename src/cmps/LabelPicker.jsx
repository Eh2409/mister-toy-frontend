
import { useState, useEffect } from 'react'

export function LabelPicker({ labels, filterLabels, onSaveLabels, labelType }) {

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
        var { name } = target

        if (!labelsToEdit.includes(name)) {
            setLabelsToEdit(prev => ([...prev, name]))
        } else {
            setLabelsToEdit(prev => prev.filter(l => l !== name))
        }
    }

    return (
        <section className="labels-picker flex flex-column" onClick={(evnet) => event.stopPropagation()}>

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