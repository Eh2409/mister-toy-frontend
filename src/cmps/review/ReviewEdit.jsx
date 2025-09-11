import { reviewService } from "../../services/review/index-review.js"
import { useState, useEffect, useRef } from 'react'

// Formik
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'

// material-ui
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import FormHelperText from "@mui/material/FormHelperText";
import { ReviewLoader } from "./ReviewLoader.jsx";

export function ReviewEdit({ onSaveReview, isMiniLoading, onCloseReviewEdit, reviewId = null }) {

    const [reviewToEdit, setReviewToEdit] = useState(reviewService.getEmptyReview())

    console.log('reviewToEdit:', reviewToEdit)

    useEffect(() => {
        if (reviewId) {
            loadReview(reviewId)
        }
    }, [reviewId])

    async function loadReview(reviewId) {
        try {
            const review = await reviewService.getById(reviewId)
            setReviewToEdit(review)
        } catch (err) {
            console.log('err:', err)
        }
    }

    const SignupSchema = Yup.object().shape({
        rating: Yup.number()
            .min(1, "Please select at least 1 star")
            .required("Rating is required"),
        txt: Yup.string()
            .min(10, "Review must be at least 10 characters long")
            .max(500, "Review can’t be longer than 500 characters")
            .required("Review text is required"),
    })

    async function onSubmit(reviewToSave) {
        console.log('reviewToSave:', reviewToSave)
        await onSaveReview(reviewToSave)
    }

    if (reviewId && !reviewToEdit?._id) return (<ReviewLoader />)

    return (
        <section className="review-edit">
            <Formik
                enableReinitialize
                initialValues={{ ...reviewToEdit }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { resetForm }) => {
                    try {
                        await onSubmit(values)
                        resetForm()
                    } catch (err) {
                        console.error("Failed to save review:", err)
                    }
                }}
            >
                {({ errors, touched, values, setFieldValue, handleChange }) => (
                    <Form>
                        <div className="review-edit-header">
                            <div className="review-title">{reviewId ? "Edit Review" : "Add Review"}</div>

                            <Box>
                                <Rating
                                    name="rating"
                                    value={values.rating}
                                    onChange={(e, newValue) => {
                                        setFieldValue("rating", newValue)
                                    }}
                                    sx={{ color: 'warning.main' }}
                                />
                                {touched.rating && errors.rating && (
                                    <FormHelperText error>{errors.rating}</FormHelperText>
                                )}
                            </Box>

                            <button className="close-btn" onClick={onCloseReviewEdit}>x</button>

                        </div>

                        <Field
                            as={TextField}
                            name="txt"
                            id="txt"
                            multiline
                            value={values.txt}
                            onChange={handleChange}
                            error={touched.txt && Boolean(errors.txt)}
                            helperText={touched.txt && errors.txt}
                        ></Field>

                        <button type="submit" className="t-a">
                            {isMiniLoading ? <div className="mini-loader"></div> : "Save"}
                        </button>

                    </Form>
                )}
            </Formik>
        </section >
    )

}