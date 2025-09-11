import { useEffect, useState } from "react"

import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export function ReviewRatingStats({ ratingStats }) {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    return (
        <section className="review-rating-state">

            <h3>Customer product reviews</h3>

            {ratingStats?.ratingSum &&
                <div className="stars-rating">
                    <span>
                        {Array.from({ length: Math.floor(ratingStats.ratingSum) }).map((_, i) => (
                            <StarIcon key={i} color="warning" />
                        ))}
                        {Math.floor(ratingStats.ratingSum) < 5 &&
                            Array.from({ length: 5 - Math.floor(ratingStats.ratingSum) }).map((_, i) => (
                                <StarBorderIcon key={i} color="warning" />
                            ))
                        }
                    </span>
                    <span>{ratingStats.ratingSum} From 5</span>
                </div>}

            <div className="revies-length">{ratingStats.reviewsLength} {ratingStats.reviewsLength > 1 ? "Reviews" : "Review"}</div>

            {ratingStats?.reviewPercentages &&
                <ul >
                    {Object.entries(ratingStats.reviewPercentages).map(([rating, percentage]) => {
                        return <li key={rating} className="rating-item">
                            <div>{rating} {rating > 1 ? "Stars" : "Star"}</div>
                            <div className="p-m">
                                <span
                                    className={`p-n ${isMounted ? "animate" : ""}`}
                                    style={{ "--targetWidth": percentage + "%" }}
                                ></span>
                            </div>
                            <div>{percentage}%</div>
                        </li>
                    })}
                </ul >}

        </section>
    )
}