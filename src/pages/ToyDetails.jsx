import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'

// services
import { toyService } from '../services/Toy/index-toy.js'

export function ToyDetails(props) {

    const params = useParams()
    const { toyId } = params

    const [toy, setToy] = useState(null)

    useEffect(() => {
        if (toyId) {
            loadToy(toyId)
        }
    }, [])

    function loadToy(toyId) {
        toyService.getById(toyId)
            .then(toy => setToy(toy))
            .catch(err => {
                console.log('err:', err)
            })
    }

    if (!toy) return 'loading...'
    return (
        <section className='toy-details'>

            <img
                src={toy.imgUrl}
                alt={toy.name}
                onError={ev => ev.currentTarget.src = "/public/images/toys/no-toy-image.jpg"}
            />

            <div>Name: {toy.name}</div>
            <div>Price: {toy.price}</div>
            <div>In Stock: {`${toy.inStock}`}</div>
            <div>Description: {toy.description}</div>
        </section>
    )
}