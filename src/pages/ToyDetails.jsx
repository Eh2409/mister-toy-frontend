import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

// services
import { toyService } from '../services/toy/index-toy.js'
import { showErrorMsg } from '../services/event-bus.service.js'

// cmps
import { Popup } from '../cmps/Popup.jsx'
import { Chat } from '../cmps/Chat.jsx'
import { ToyLoader } from '../cmps/toy/ToyLoader.jsx'

export function ToyDetails(props) {

    const params = useParams()
    const { toyId } = params

    const [toy, setToy] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    useEffect(() => {
        if (toyId) {
            loadToy(toyId)
        }
    }, [])

    useEffect(() => {
        if (isPopupOpen) {
            addEventListener('keydown', onKeydown)
        } else {
            removeEventListener('keydown', onKeydown)
        }

        return (() => {
            removeEventListener('keydown', onKeydown)
        })
    }, [isPopupOpen])


    function loadToy(toyId) {
        toyService.getById(toyId)
            .then(toy => setToy(toy))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load toy ' + toyId)
            })
    }

    function toggleIsPopupOpen() {
        setIsPopupOpen(!isPopupOpen)
    }

    function onClosePopup() {
        setIsPopupOpen(false)
    }

    function onKeydown(ev) {
        if (ev.key === 'Escape') {
            toggleIsPopupOpen()
        }
    }

    if (!toy) return (
        <section className='toy-details'>
            <ToyLoader size={1} />
        </section>
    )

    return (
        <section className='toy-details'>

            <div className='toy-details-header'>
                <h2>{toy.name}</h2>

                <div className='toy-labels flex'>
                    {toy.companies?.length > 0 &&
                        <div>By:
                            {toy.companies.map(c => {
                                return <Link to={`/toy?companies=${c}`} key={c} className='toy-label'>{c}</Link>
                            })}
                        </div>}
                    {toy.brands?.length > 0 &&
                        <div>Brand:
                            {toy.brands.map(b => {
                                return <Link to={`/toy?brands=${b}`} key={b} className='toy-label'>{b}</Link>
                            })}
                        </div>}
                </div>

            </div>

            <hr />

            <section className='toy-details-content'>
                <img
                    src={toy.imgUrl}
                    alt={toy.name}
                    onError={ev => ev.currentTarget.src = "/images/toys/no-toy-image.jpg"}
                    className='toy-img'
                />

                <div className='toy-info'>
                    <div className={`toy-price ${!toy.inStock ? 'out' : ''}`}>Price: ${toy.price}</div>
                    <div className='toy-description'>
                        <h3>Product Description</h3>
                        <p>{toy.description}</p>
                    </div>
                </div>

            </section>


            <div className='btn chat-btn' onClick={toggleIsPopupOpen}>
                <img src="/images/chat.svg" alt="chat" className='icon' />
            </div>

            <Popup
                isPopupOpen={isPopupOpen}
                onClosePopup={onClosePopup}
                header={<h2>Toy Chat</h2>}
            >
                <Chat />
            </Popup>

        </section >
    )
}