import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { toyService } from "../services/Toy/index-toy.js"

// cmps
import { LabelPicker } from "../cmps/LabelPicker.jsx"


export function ToyEdit(props) {

    const navigate = useNavigate()

    const params = useParams()
    const { toyId } = params

    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const [isLabelsPickerOpen, setIsLabelsPickerOpen] = useState(false)
    const toysLabels = useSelector(storeState => storeState.toyModule.labels)

    const labelsPickerWrapper = useRef()

    useEffect(() => {
        if (toyId) {
            loadToy(toyId)
        }
        if (toysLabels?.length < 0) {
            loadLabels()
        }
    }, [])

    useEffect(() => {
        if (isLabelsPickerOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })

    }, [isLabelsPickerOpen])

    function handleClickOutside({ target }) {
        const elLabelsWrapper = labelsPickerWrapper.current
        if (target !== elLabelsWrapper && !elLabelsWrapper.contains(target)) {
            toggleLabelsPicker()
        }
    }

    function loadLabels() {
        return toyActions.loadLabels()
            .catch(err => {
                console.log('err:', err)
            })
    }

    function handleChange({ target }) {
        var { value, name, type, checked } = target

        if (type === "number") value = +value
        if (type === "checkbox") value = checked

        setToyToEdit(prev => ({ ...prev, [name]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()

        if (!toyToEdit.imgUrl) {
            toyToEdit.imgUrl = '/public/images/toys/no-toy-image.jpg'
        }

        toyActions.save(toyToEdit)
            .then(savedToyId => {
                navigate(`/toy/${savedToyId}`)
            })
            .catch(err => {
                console.log('err:', err)
            })

    }

    function loadToy(toyId) {
        toyService.getById(toyId)
            .then(toy => setToyToEdit(toy))
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onSaveLabels(labelsToSave) {

        const labelsToSaveStr = JSON.stringify(labelsToSave.sort())
        const toyLabelsStr = JSON.stringify(toyToEdit.labels.sort())

        if (labelsToSaveStr === toyLabelsStr) return

        setToyToEdit(prev => ({ ...prev, labels: labelsToSave }))
    }

    function toggleLabelsPicker() {
        setIsLabelsPickerOpen(!isLabelsPickerOpen)
    }

    if (toyId && !toyToEdit?._id) return "loading..."

    const { name, price, imgUrl, inStock, description, labels } = toyToEdit

    return (
        <section className="toy-edit">

            <h2>{toyId ? "Update" : "Add"} Toy</h2>

            <form onSubmit={onSubmit}>

                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name" value={name} onChange={handleChange} required />

                <label htmlFor="price">Price:</label>
                <input type="number" name="price" id="price" min={1} value={price || ''} onChange={handleChange} required />

                <label htmlFor="imgUrl">Toy Image Url:</label>
                <input type="text" name="imgUrl" id="imgUrl" value={imgUrl} onChange={handleChange} />

                <label htmlFor="inStock">In Stock:</label>
                <input type="checkbox" name="inStock" id="inStock" checked={inStock} onChange={handleChange} />

                <label>Labels:</label>
                <div className="labels-picker-wrapper" ref={labelsPickerWrapper}>
                    <div className="prev-labels" onClick={toggleLabelsPicker}>
                        {labels?.length > 0 ? labels.join(', ') : 'Choose toy labels'}
                    </div>
                    {isLabelsPickerOpen && <LabelPicker labels={toysLabels} filterLabels={labels} onSaveLabels={onSaveLabels} />}
                </div>

                <label htmlFor="description">Description:</label>
                <textarea type="text" name="description" id="description" value={description} onChange={handleChange} required ></textarea>

                <button className="t-a">Save</button>
            </form>
        </section>
    )
}