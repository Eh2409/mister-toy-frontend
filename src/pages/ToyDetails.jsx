import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

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

            <div className='toy-details-header'>
                <h2>{toy.name}</h2>
                {toy.labels.length > 0 &&
                    <div>Labels:
                        {toy.labels.map(l => {
                            return <Link to={`/toy?labels=${l}`} key={l} className='toy-label'>{l}</Link>
                        })}
                    </div>}
            </div>

            <hr />

            <section className='toy-details-content'>
                <img
                    src={toy.imgUrl}
                    alt={toy.name}
                    className='toy-img'
                    onError={ev => ev.currentTarget.src = "/public/images/toys/no-toy-image.jpg"}
                />

                <div className='toy-info'>
                    <div className={`toy-price ${!toy.inStock ? 'out' : ''}`}>Price: ${toy.price}</div>
                    <div className='toy-description'>
                        <h3>Product Description</h3>
                        <p>{toy.description}</p>
                    </div>
                </div>

            </section>



        </section >
    )
}