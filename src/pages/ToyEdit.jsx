import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { toyService } from "../services/toy/index-toy.js"

// cmps
import { LabelPicker } from "../cmps/LabelPicker.jsx"
import { ToyLoader } from "../cmps/toy/ToyLoader.jsx"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function ToyEdit(props) {

    const navigate = useNavigate()

    const params = useParams()
    const { toyId } = params

    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const [isLabelsPickerOpen, setIsLabelsPickerOpen] = useState({ isOpen: false, type: '' })
    const [isLoading, setIsLoading] = useState(false)
    const toysLabels = useSelector(storeState => storeState.toyModule.labels)

    const brandsPickerWrapper = useRef()
    const productTypesPickerWrapper = useRef()
    const companiesPickerWrapper = useRef()


    useEffect(() => {
        if (toyId) {
            loadToy(toyId)
        }
        if (toysLabels?.length < 0) {
            loadLabels()
        }
    }, [])

    useEffect(() => {
        if (isLabelsPickerOpen.isOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })

    }, [isLabelsPickerOpen])

    function handleClickOutside({ target }) {
        var elLabelsWrapper = ''
        if (isLabelsPickerOpen.type === 'brands') elLabelsWrapper = brandsPickerWrapper.current
        else if (isLabelsPickerOpen.type === 'productTypes') elLabelsWrapper = productTypesPickerWrapper.current
        else if (isLabelsPickerOpen.type === 'companies') elLabelsWrapper = companiesPickerWrapper.current

        if (target !== elLabelsWrapper && !elLabelsWrapper.contains(target)) {
            toggleLabelsPicker()
        }
    }

    function loadToy(toyId) {
        toyService.getById(toyId)
            .then(toy => setToyToEdit(toy))
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load toy ' + toyId)
            })
    }

    function loadLabels() {
        return toyActions.loadLabels()
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load labels ' + toyId)
            })
    }


    function toggleLabelsPicker(type = undefined) {
        setIsLabelsPickerOpen(prev => {
            if (!type || type === prev.type) {
                prev = { isOpen: false, type: '' }
            } else {
                prev = { isOpen: true, type: type }
            }
            return prev
        })
    }

    function onSubmit(toyToSave) {
        setIsLoading(true)

        if (!toyToSave.imgUrl) {
            toyToSave.imgUrl = '/public/images/toys/no-toy-image.jpg'
        }

        toyActions.save(toyToSave)
            .then(savedToyId => {
                navigate(`/toy/${savedToyId}`)
                showSuccessMsg('Toy saved!')
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot save toy')
            })
            .finally(() => { setIsLoading(false) })

    }

    const SignupSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
        price: Yup.number()
            .min(0, 'Too Short!')
            .required('Required'),
        imgUrl: Yup.string()
            .matches(/\.(jpg|jpeg|png|gif)$/i, "Must be a valid image format"),
        brands: Yup.array()
            .min(1, 'At least one brand is required')
            .required('Required'),
        productTypes: Yup.array()
            .min(1, 'At least one brand is required')
            .required('Required'),
        companies: Yup.array()
            .min(1, 'At least one brand is required')
            .required('Required'),
    })

    if (toyId && !toyToEdit?._id) return <section className='toy-edit'>
        <ToyLoader size={1} />
    </section>

    return (
        <section className="toy-edit">

            <div className="edit-card">

                <h2>{toyId ? "Update" : "Add"} Toy</h2>


                <Formik
                    initialValues={{ ...toyToEdit }}
                    validationSchema={SignupSchema}
                    onSubmit={values => onSubmit(values)}
                >
                    {({ errors, touched }) => (
                        <Form>

                            <label htmlFor="name">Name:</label>
                            <Field name="name" id="name" />
                            {errors.name && touched.name ? (
                                <div className="err-msg">{errors.name}</div>
                            ) : null}

                            <label htmlFor="price">Price:</label>
                            <Field name="price" id="price" type="number" />

                            {errors.price && touched.price ? (
                                <div className="err-msg">{errors.price}</div>
                            ) : null}


                            <label htmlFor="imgUrl">Toy Image Url:</label>
                            <Field name="imgUrl" id="imgUrl" />
                            {errors.imgUrl && touched.imgUrl ? (
                                <div className="err-msg">{errors.imgUrl}</div>
                            ) : null}

                            <label htmlFor="inStock">In Stock:</label>
                            <Field name="inStock" id="inStock" type="checkbox" />
                            {errors.inStock && touched.inStock ? (
                                <div className="err-msg">{errors.inStock}</div>
                            ) : null}


                            <label htmlFor="brands">Brands:</label>
                            <Field name="brands" className="labels-picker-wrapper" ref={brandsPickerWrapper} >
                                {({ field, form }) => (

                                    <div className="labels-picker-wrapper" ref={brandsPickerWrapper}>

                                        <input type="text" id="brands" {...field} hidden />

                                        <div className="prev-labels" onClick={() => toggleLabelsPicker('brands')}>
                                            {field?.value?.length > 0 ? field.value.join(', ') : 'Choose toy Brands'}
                                        </div>

                                        {isLabelsPickerOpen.isOpen &&
                                            isLabelsPickerOpen.type === 'brands' &&
                                            toysLabels?.brands?.length > 0 && < LabelPicker
                                                labels={toysLabels.brands}
                                                filterLabels={field.value}
                                                onSaveLabels={(newLabels) => { form.setFieldValue("brands", newLabels) }}
                                                labelType={'brands'}
                                            />}
                                    </div>
                                )}
                            </Field>
                            {errors.brands && touched.brands ? (
                                <div className="err-msg">{errors.brands}</div>
                            ) : null}


                            <label htmlFor="productTypes">Product Types:</label>
                            <Field name="productTypes" className="labels-picker-wrapper" ref={productTypesPickerWrapper} >
                                {({ field, form }) => (

                                    <div className="labels-picker-wrapper" ref={productTypesPickerWrapper}>

                                        <input type="text" id="productTypes" {...field} hidden />

                                        <div className="prev-labels" onClick={() => toggleLabelsPicker('productTypes')}>
                                            {field?.value?.length > 0 ? field.value.join(', ') : 'Choose toy Product Types'}
                                        </div>

                                        {isLabelsPickerOpen.isOpen &&
                                            isLabelsPickerOpen.type === 'productTypes' &&
                                            toysLabels?.productTypes?.length > 0 && < LabelPicker
                                                labels={toysLabels.productTypes}
                                                filterLabels={field.value}
                                                onSaveLabels={(newLabels) => { form.setFieldValue("productTypes", newLabels) }}
                                                labelType={'productTypes'}
                                            />}
                                    </div>
                                )}
                            </Field>
                            {errors.productTypes && touched.productTypes ? (
                                <div className="err-msg">{errors.productTypes}</div>
                            ) : null}


                            <label htmlFor="companies">Companies:</label>
                            <Field name="companies" className="labels-picker-wrapper" ref={companiesPickerWrapper} >
                                {({ field, form }) => (

                                    <div className="labels-picker-wrapper" ref={companiesPickerWrapper}>

                                        <input type="text" id="companies" {...field} hidden />

                                        <div className="prev-labels" onClick={() => toggleLabelsPicker('companies')}>
                                            {field?.value?.length > 0 ? field.value.join(', ') : 'Choose toy Companies'}
                                        </div>

                                        {isLabelsPickerOpen.isOpen &&
                                            isLabelsPickerOpen.type === 'companies' &&
                                            toysLabels?.companies?.length > 0 && < LabelPicker
                                                labels={toysLabels.companies}
                                                filterLabels={field.value}
                                                onSaveLabels={(newLabels) => { form.setFieldValue("companies", newLabels) }}
                                                labelType={'companies'}
                                            />}
                                    </div>
                                )}
                            </Field>
                            {errors.companies && touched.companies ? (
                                <div className="err-msg">{errors.companies}</div>
                            ) : null}


                            <label htmlFor="description">Description:</label>
                            <Field name="description" id="description" as="textarea" rows="4" cols="40" />
                            {errors.description && touched.description ? (
                                <div className="err-msg">{errors.description}</div>
                            ) : null}


                            <button className="t-a" type="submit">
                                {isLoading ? <div className="mini-loader"></div> : "Save"}
                            </button>

                        </Form>
                    )}
                </Formik>

            </div>
        </section>
    )
}