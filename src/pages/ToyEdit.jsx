import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { toyActions } from "../../store/actions/toy.actions.js"
import { toyService } from "../services/Toy/index-toy.js"


export function ToyEdit(props) {

    const navigate = useNavigate()

    const params = useParams()
    const { toyId } = params

    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())

    useEffect(() => {
        if (toyId) {
            loadToy(toyId)
        }
    }, [])

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

    if (toyId && !toyToEdit?._id) return "loading..."

    const { name, price, imgUrl, inStock, description } = toyToEdit

    return (
        <section className="toy-edit">
            <h2>{toyId ? "Update" : "Add"} toy</h2>
            <form onSubmit={onSubmit}>

                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" value={name} onChange={handleChange} required />

                <label htmlFor="price">Price</label>
                <input type="number" name="price" id="price" min={1} value={price || ''} onChange={handleChange} required />

                <label htmlFor="imgUrl">Toy Image Url</label>
                <input type="text" name="imgUrl" id="imgUrl" value={imgUrl} onChange={handleChange} />

                <label htmlFor="inStock">In Stock</label>
                <input type="checkbox" name="inStock" id="inStock" checked={inStock} onChange={handleChange} />

                <label htmlFor="description">Description</label>
                <textarea type="text" name="description" id="description" value={description} onChange={handleChange} required ></textarea>

                <button>Save</button>
            </form>
        </section>
    )
}