import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

// Formik
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'

// material-ui
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from "@mui/material/styles"

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { toyService } from "../services/toy/index-toy.js"
import { getUiTheme } from "../services/util.service.js";

// cmps
import { LabelPicker } from "../cmps/LabelPicker.jsx"
import { LabelPickerUi } from "../cmps/LabelPickerUi.jsx";
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

    async function loadToy(toyId) {
        try {
            const toy = await toyService.getById(toyId)
            setToyToEdit(toy)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load toy ' + toyId)
        }
    }

    async function loadLabels() {
        try {
            await toyActions.loadLabels()
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load labels')
        }
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

    async function onSubmit(toyToSave) {
        setIsLoading(true)

        if (!toyToSave.imgUrl) {
            toyToSave.imgUrl = '/public/images/toys/no-toy-image.jpg'
        }

        try {
            const savedToyId = await toyActions.save(toyToSave)
            navigate(`/toy/${savedToyId}`)
            showSuccessMsg('Toy saved!')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot save toy')
        } finally {
            setIsLoading(false)
        }

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
            .min(1, 'At least one product type is required')
            .required('Required'),
        companies: Yup.array()
            .min(1, 'At least one company is required')
            .required('Required'),
    })

    const theme = createTheme(getUiTheme())

    if (toyId && !toyToEdit?._id) return <section className='toy-edit'>
        <ToyLoader size={1} />
    </section>

    return (
        <section className="toy-edit">

            <div className="edit-card">

                <h2>{toyId ? "Update" : "Add"} Toy</h2>

                <ThemeProvider theme={theme}>
                    <Formik
                        initialValues={{ ...toyToEdit }}
                        validationSchema={SignupSchema}
                        onSubmit={values => onSubmit(values)}
                    >
                        {({ errors, touched }) => (
                            <Form>

                                <div className="edit-row">

                                    <Field
                                        as={TextField}
                                        name="name"
                                        id="name"
                                        label="Toy Name"
                                        variant="outlined"
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                    />

                                    <Field
                                        as={TextField}
                                        name="price"
                                        id="price"
                                        label="Price"
                                        variant="outlined"
                                        type="number"
                                        error={touched.price && Boolean(errors.price)}
                                        helperText={touched.price && errors.price}
                                    />

                                    <Field name="inStock">
                                        {({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        {...field}
                                                        checked={field.value}
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: 'var(--mainSiteClrTheme)',
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="In Stock"
                                            />
                                        )}
                                    </Field>

                                </div>


                                <Field
                                    as={TextField}
                                    name="imgUrl"
                                    id="imgUrl"
                                    label="Toy Image Url"
                                    variant="outlined"
                                    error={touched.imgUrl && Boolean(errors.imgUrl)}
                                    helperText={touched.imgUrl && errors.imgUrl}
                                />


                                <div className="edit-row">

                                    <Field name="brands" >
                                        {({ field, form }) => (

                                            <div className="labels-picker-wrapper">

                                                {toysLabels?.brands?.length > 0 && <LabelPickerUi
                                                    labels={toysLabels.brands}
                                                    filterLabels={field.value}
                                                    onSaveLabels={(newLabels) => { form.setFieldValue("brands", newLabels) }}
                                                    labelType={'Brands'}
                                                    error={touched.brands && Boolean(errors.brands)}
                                                    helperText={touched.brands && errors.brands}
                                                />}

                                            </div>
                                        )}
                                    </Field>


                                    <Field name="productTypes" >
                                        {({ field, form }) => (

                                            <div className="labels-picker-wrapper">

                                                {toysLabels?.productTypes?.length > 0 && <LabelPickerUi
                                                    labels={toysLabels.productTypes}
                                                    filterLabels={field.value}
                                                    onSaveLabels={(newLabels) => { form.setFieldValue("productTypes", newLabels) }}
                                                    labelType={'Product Types'}
                                                    error={touched.productTypes && Boolean(errors.productTypes)}
                                                    helperText={touched.productTypes && errors.productTypes}
                                                />}

                                            </div>
                                        )}
                                    </Field>


                                    <Field name="companies" >
                                        {({ field, form }) => (

                                            <div className="labels-picker-wrapper">

                                                {toysLabels?.companies?.length > 0 && <LabelPickerUi
                                                    labels={toysLabels.companies}
                                                    filterLabels={field.value}
                                                    onSaveLabels={(newLabels) => { form.setFieldValue("companies", newLabels) }}
                                                    labelType={'Companies'}
                                                    error={touched.companies && Boolean(errors.companies)}
                                                    helperText={touched.companies && errors.companies}
                                                />}

                                            </div>
                                        )}
                                    </Field>

                                </div>


                                <Field
                                    as={TextField}
                                    name="description"
                                    id="description"
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                />


                                <button className="t-a" type="submit">
                                    {isLoading ? <div className="mini-loader"></div> : "Save"}
                                </button>

                            </Form>
                        )}
                    </Formik>
                </ThemeProvider>
            </div>
        </section>
    )
}