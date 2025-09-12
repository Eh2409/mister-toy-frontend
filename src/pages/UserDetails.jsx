import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

// services
import { ReviewList } from "../cmps/review/ReviewList"

// cmps
import { reviewActions } from "../../store/actions/review.actions"
import { ReviewLoader } from "../cmps/review/ReviewLoader"
import { Pagination } from "../cmps/Pagination"



export function UserDetails(props) {
    const navigate = useNavigate()
    const params = useParams()
    const { userId } = params

    const [isReviewsLoading, setIsReviewsLoading] = useState(false)
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    const reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const maxPageCount = useSelector(storeState => storeState.reviewModule.reviewMaxPageCount)
    const [pageIdx, setPageIdx] = useState(0)

    useEffect(() => {
        if (!loggedinUser || loggedinUser._id !== userId) {
            navigate('/')
        } else {
            loadReviews(pageIdx)
        }
    }, [loggedinUser, userId, pageIdx])


    async function loadReviews(pageIdx) {
        setIsReviewsLoading(true)
        try {
            await reviewActions.load({ byUserId: userId, pageIdx })
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load reviews')
        } finally {
            setIsReviewsLoading(false)
        }
    }

    function onSetPageIdx(pageNum) {
        setPageIdx(pageNum)
    }


    if (!loggedinUser) return
    return (
        <section className="user-details">

            <h2>Hello {loggedinUser.fullname}</h2>

            <section className="user-reviews">

                <h3>My Reviews</h3>

                <div>
                    {isReviewsLoading ? <ReviewLoader />
                        : reviews?.length > 0 ?
                            <ReviewList reviews={reviews} />
                            : <div className='no-review-found-msg'>
                                No items match your search criteria.
                            </div>}

                    {reviews?.length > 0 && <Pagination
                        maxPageCount={maxPageCount}
                        pageIdx={pageIdx}
                        setPageIdx={onSetPageIdx}
                    />}
                </div>
            </section>

        </section >
    )
}