import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"

// services
import { reviewActions } from "../../store/actions/review.actions.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { reviewService } from "../services/review/index-review.js"
import { cleanSearchParams } from "../services/util.service.js"

//cmps
import { ReviewList } from "../cmps/review/ReviewList.jsx"
import { ReviewLoader } from "../cmps/review/ReviewLoader.jsx"
import { Pagination } from "../cmps/Pagination.jsx"
import { ReviewFilter } from "../cmps/review/ReviewFilter.jsx"
import { ReviewSort } from "../cmps/review/ReviewSort.jsx"

export function ReviewExplore(props) {

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const maxPageCount = useSelector(storeState => storeState.reviewModule.reviewMaxPageCount)

    const [isReviewsLoading, setIsReviewsLoading] = useState(false)
    const [isMiniLoading, setIsMiniLoading] = useState({ isLoading: false, reviewId: null })
    const [isReviewEditOpen, setIsReviewEditOpen] = useState({ isOpen: false, reviewId: null })

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(reviewService.getFilterFromSearchParams(searchParams))

    const [activeFilterOptionsCount, setActiveFilterOptionsCount] = useState(0)
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    useEffect(() => {
        setSearchParams(cleanSearchParams(filterBy))
        onCountActiveFilterOptions(filterBy)
        loadReviews(filterBy)
    }, [filterBy])

    async function loadReviews(filterBy) {
        setIsReviewsLoading(true)
        try {
            await reviewActions.load(filterBy)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load reviews')
        } finally {
            setTimeout(() => {
                setIsReviewsLoading(false)
            }, 200);
        }
    }

    async function onSaveReview(reviewToSave) {
        setIsMiniLoading(prev => ({ ...prev, isLoading: true }))
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
            loadReview()
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

    function setPageIdx(pageNum) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageNum }))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy, pageIdx: 0 }))
    }

    function toggleIsMobileFilterOpen() {
        setIsMobileFilterOpen(!isMobileFilterOpen)
    }
    function closeMobileFilter() {
        setIsMobileFilterOpen(false)
    }


    function onCountActiveFilterOptions(filter) {

        const count = Object.entries(filter).filter(([key, val]) => {
            if (key === 'sortType' || key === 'dir' || key === 'pageIdx') return
            if (key === 'inStock') return val !== 'all' ? true : false
            if (key === 'brands' || key === 'productTypes' || key === 'companies') return val?.length > 0 ? true : false
            else return val
        }).length

        setActiveFilterOptionsCount(count)
    }



    const { toyName, minRating, reviewTxt, sortType, dir, pageIdx } = filterBy

    return (
        <section className="review-explore">

            <div className="review-explore-header">
                <h2>Reviews Explore</h2>
                <button className='mobile-filter-btn' onClick={toggleIsMobileFilterOpen}>
                    Filter {activeFilterOptionsCount ? `(${activeFilterOptionsCount})` : ""}
                </button>
                <ReviewSort sortBy={{ sortType, dir }} onSetFilterBy={onSetFilterBy} />
            </div>

            <ReviewFilter
                filterBy={{ toyName, minRating, reviewTxt }}
                onSetFilterBy={onSetFilterBy}
                closeMobileFilter={closeMobileFilter}
                isMobileFilterOpen={isMobileFilterOpen}
            />

            <div>
                {isReviewsLoading ? <ReviewLoader />
                    : reviews?.length > 0 ?
                        <ReviewList
                            reviews={reviews}
                            isReviewEditOpen={isReviewEditOpen}
                            onOpenReviewEdit={onOpenReviewEdit}
                            onCloseReviewEdit={onCloseReviewEdit}
                            onSaveReview={onSaveReview}
                            isMiniLoading={isMiniLoading}
                            loggedinUser={loggedinUser}
                            onRemoveReview={onRemoveReview}
                        />
                        : <div className='no-review-found-msg'>
                            No items match your search criteria.
                        </div>}

                {reviews?.length > 0 && <Pagination
                    maxPageCount={maxPageCount}
                    pageIdx={pageIdx}
                    setPageIdx={setPageIdx}
                />}
            </div>

        </section>
    )
}