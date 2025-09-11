import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { ReviewEdit } from './ReviewEdit'
import { formatTimeAgo } from '../../services/util.service'
import { useEffect } from 'react'

export function ReviewList({ reviews, isReviewEditOpen, onOpenReviewEdit,
    onCloseReviewEdit, onSaveReview, isMiniLoading, loggedinUser, onRemoveReview }) {

    useEffect(() => {
        const options = {
            threshold: 0.10,
        }

        const observer = new IntersectionObserver(onHeaderObserved, options)

        const elReviewItems = document.querySelectorAll('.review-item')
        elReviewItems.forEach((el) => observer.observe(el))

        function onHeaderObserved(entries) {
            entries.forEach(entry => {
                entry.target.classList.toggle('show', entry.isIntersecting)
            })
        }

        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, [reviews])


    return (
        <ul className="review-list">
            {reviews.map(r =>
                isReviewEditOpen.isOpen && isReviewEditOpen.reviewId === r._id
                    ? (<ReviewEdit
                        key={r._id}
                        onSaveReview={onSaveReview}
                        isMiniLoading={isMiniLoading}
                        onCloseReviewEdit={onCloseReviewEdit}
                        reviewId={r._id}
                    />)

                    : (< li key={r._id} className="review-item" >
                        <header className="review-header">
                            <div className="flex flex-column">
                                <span>By: {r?.user?.username}</span>
                                <span>{formatTimeAgo(r?.createdAt)}</span>
                            </div>

                            <span>
                                {Array.from({ length: r?.rating }).map((_, i) => (
                                    <StarIcon key={i} color="warning" />
                                ))}
                                {r?.rating < 5 &&
                                    Array.from({ length: 5 - r?.rating }).map((_, i) => (
                                        <StarBorderIcon key={i} color="warning" />
                                    ))
                                }
                            </span>
                            {loggedinUser?.isAdmin && <div className='review-actions flex align-center'>
                                <button className='t-a' onClick={() => { onOpenReviewEdit(r._id) }}>Edit</button>
                                <button className='t-a' onClick={() => onRemoveReview(r._id)} >
                                    {isMiniLoading?.isLoading && isMiniLoading?.reviewId === r._id
                                        ? <div className="mini-loader"></div> : "Delete"}
                                </button>
                            </div>}
                        </header>
                        <pre>{r.txt}</pre>
                    </li>)
            )}
        </ul >
    )
}