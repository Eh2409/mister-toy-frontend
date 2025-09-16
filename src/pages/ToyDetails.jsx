import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'

// services
import { toyService } from '../services/toy/index-toy.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { reviewActions } from '../../store/actions/review.actions.js'
import { userActions } from '../../store/actions/user.actions.js'

// cmps
import { Popup } from '../cmps/Popup.jsx'
import { Chat } from '../cmps/Chat.jsx'
import { ToyLoader } from '../cmps/toy/ToyLoader.jsx'
import { ToyMsgChat } from '../cmps/toy/ToyMsgChat.jsx'
// import { ImageLoader } from '../cmps/ImageLoader.jsx'
import { ReviewEdit } from '../cmps/review/ReviewEdit.jsx'
import { ReviewList } from '../cmps/review/ReviewList.jsx'
import { ReviewRatingStats } from '../cmps/review/ReviewRatingStats.jsx'
import { ToyDataTable } from '../cmps/toy/ToyDataTable.jsx'
import { ToyImagesGallery } from '../cmps/toy/ToyImagesGallery.jsx'
import { SOCKET_EMIT_DELETE_MSG, SOCKET_EMIT_SEND_MSG, SOCKET_EVENT_ADD_MSG, SOCKET_EVENT_REMOVE_MSG, socketService } from '../services/socket.service.js'

//images
import chatIcon from '/images/chat.svg'

export function ToyDetails(props) {

    const params = useParams()
    const { toyId } = params

    const [toy, setToy] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isMiniLoading, setIsMiniLoading] = useState({ isLoading: false, reviewId: null })
    const [isReviewEditOpen, setIsReviewEditOpen] = useState({ isOpen: false, reviewId: null })

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const ratingStats = useSelector(storeState => storeState.reviewModule.ratingStats)

    useEffect(() => {
        if (toyId) {
            loadToy(toyId)
            loadReview(toyId)
        }
    }, [])

    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, socketAddMsg)
        socketService.on(SOCKET_EVENT_REMOVE_MSG, socketRemoveMsg)
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, socketAddMsg)
            socketService.off(SOCKET_EVENT_REMOVE_MSG, socketRemoveMsg)
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


    async function loadToy(toyId) {
        try {
            const toy = await toyService.getById(toyId)
            setToy(toy)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load toy ' + toyId)
        }
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

    // msgs

    async function onSaveMsg(msgToSave) {
        try {
            const savedMsg = await toyService.saveMsg(msgToSave, toy._id)
            socketService.emit(SOCKET_EMIT_SEND_MSG, savedMsg)
            setToy(prev => ({ ...prev, msgs: [...prev.msgs, savedMsg] }))
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot save msg')
        }
    }

    async function onRemoveMsg(msgId) {
        try {
            await toyService.removeMsg(msgId, toy._id)
            socketService.emit(SOCKET_EMIT_DELETE_MSG, msgId)
            setToy(prev => ({ ...prev, msgs: prev.msgs.filter(m => m.id !== msgId) }))
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot save msg')
        }
    }

    function socketAddMsg(msg) {
        setToy(prev => ({ ...prev, msgs: [...prev.msgs, msg] }))
    }

    function socketRemoveMsg(msgId) {
        setToy(prev => ({ ...prev, msgs: prev.msgs.filter(m => m.id !== msgId) }))
    }

    // review

    async function loadReview(toyId) {
        try {
            await reviewActions.load({ byToyId: toyId })
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load toy ' + toyId)
        }
    }

    async function onSaveReview(reviewToSave) {
        setIsMiniLoading(prev => ({ ...prev, isLoading: true }))

        if (!reviewToSave?._id) reviewToSave.toy = { _id: toy._id, name: toy.name }

        try {
            await reviewActions.save(reviewToSave)
            showSuccessMsg('Review saved successfully')
            onCloseReviewEdit()
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot save review')
        } finally {
            setIsMiniLoading(prev => ({ ...prev, isLoading: false }))
        }
    }

    async function onRemoveReview(reviewId) {
        setIsMiniLoading({ isLoading: true, reviewId: reviewId })
        try {
            await reviewActions.remove(reviewId)
            showSuccessMsg('Review removed successfully')
            loadReview(toyId)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot remove review')
        } finally {
            setIsMiniLoading({ isLoading: false, reviewId: null })
        }
    }


    function onOpenReviewEdit(reviewId = null) {
        setIsReviewEditOpen(prev => ({ isOpen: true, reviewId }))
    }
    function onCloseReviewEdit() {
        setIsReviewEditOpen(prev => ({ isOpen: false, reviewId: null }))
    }

    function onOpenLoginPopup() {
        userActions.setIsLoginSignupPopupOpen(true)
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
                <ToyImagesGallery toy={toy} />

                <div className='toy-info'>
                    <div className={`toy-price ${!toy.inStock ? 'out' : ''}`}>Price: ${toy.price}</div>
                    <div className='toy-description'>

                        <h3 >Toy Details</h3>
                        <ToyDataTable toy={toy} />

                        {ratingStats?.reviewsLength > 0 &&
                            <ReviewRatingStats ratingStats={ratingStats} />}
                    </div>
                </div>

            </section>



            <div className='btn chat-btn' onClick={toggleIsPopupOpen}>
                <img src={chatIcon} alt="chat" className='icon' />
            </div>

            <div className='review-edit-wrapper'>
                {isReviewEditOpen?.isOpen && !isReviewEditOpen?.reviewId ?
                    <ReviewEdit
                        onSaveReview={onSaveReview}
                        isMiniLoading={isMiniLoading}
                        onCloseReviewEdit={onCloseReviewEdit}
                    />
                    : <button
                        className='t-a add-review-btn'
                        onClick={() => loggedinUser ? onOpenReviewEdit() : onOpenLoginPopup()}
                    >
                        {loggedinUser ? "Add Review" : "Login / Signup to add Review"}
                    </button>

                }
            </div>


            {reviews?.length > 0 ?
                <ReviewList
                    reviews={reviews}
                    isReviewEditOpen={isReviewEditOpen}
                    onOpenReviewEdit={onOpenReviewEdit}
                    onCloseReviewEdit={onCloseReviewEdit}
                    onSaveReview={onSaveReview}
                    isMiniLoading={isMiniLoading}
                    loggedinUser={loggedinUser}
                    onRemoveReview={onRemoveReview}
                    isToyNameShown={false}
                />
                : <div className='no-reviews'>
                    There are no reviews yet. Be the first to share your thoughts!
                </div>}


            <Popup
                isPopupOpen={isPopupOpen}
                onClosePopup={onClosePopup}
                header={<h2>Toy Chat</h2>}
            >
                {/* <Chat /> */}

                <ToyMsgChat
                    toyMsgs={toy?.msgs || []}
                    loggedinUser={loggedinUser}
                    onSaveMsg={onSaveMsg}
                    onRemoveMsg={onRemoveMsg}
                    toyId={toyId}
                />

            </Popup>

        </section >
    )
}