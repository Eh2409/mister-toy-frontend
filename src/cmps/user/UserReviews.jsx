import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

//services
import { reviewActions } from "../../../store/actions/review.actions.js"

// cmps
import { ReviewList } from "../review/ReviewList"
import { Pagination } from "../Pagination"
import { ReviewLoader } from "../review/ReviewLoader"

export function UserReviews(props) {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    const [isReviewsLoading, setIsReviewsLoading] = useState(false)
    const reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const maxPageCount = useSelector(storeState => storeState.reviewModule.reviewMaxPageCount)
    const [pageIdx, setPageIdx] = useState(0)

    useEffect(() => {
        if (loggedinUser) {
            loadReviews(pageIdx)
        }
    }, [pageIdx])

    async function loadReviews(pageIdx) {
        setIsReviewsLoading(true)
        try {
            await reviewActions.load({ byUserId: loggedinUser._id, pageIdx })
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

    return (
        <section className="user-reviews">

            <h2>My Reviews</h2>

            <div>
                {isReviewsLoading ? <ReviewLoader />
                    : reviews?.length > 0 ?
                        <ReviewList reviews={reviews} />
                        : <div className='no-items-found-msg'>
                            No reviews found. Share your thoughts on a toy!
                        </div>}

                {reviews?.length > 0 && <Pagination
                    maxPageCount={maxPageCount}
                    pageIdx={pageIdx}
                    setPageIdx={onSetPageIdx}
                />}
            </div>
        </section>
    )
}