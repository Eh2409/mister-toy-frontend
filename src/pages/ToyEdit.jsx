import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"

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

    function handleChange({ target }) {
        var { value, name, type, checked } = target

        if (type === "number") value = +value
        if (type === "checkbox") value = checked

        setToyToEdit(prev => ({ ...prev, [name]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()

        setIsLoading(true)

        if (!toyToEdit.imgUrl) {
            toyToEdit.imgUrl = '/public/images/toys/no-toy-image.jpg'
        }

        toyActions.save(toyToEdit)
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


    function onSaveLabels(labelsToSave, labelType) {

        const labelsToSaveStr = JSON.stringify(labelsToSave.sort())
        const toyLabelsStr = JSON.stringify(toyToEdit[labelType].sort())

        if (labelsToSaveStr === toyLabelsStr) return

        setToyToEdit(prev => ({ ...prev, [labelType]: labelsToSave }))
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

    if (toyId && !toyToEdit?._id) return <section className='toy-edit'>
        <ToyLoader size={1} />
    </section>

    const { name, price, imgUrl, inStock, description, brands, productTypes, companies } = toyToEdit

    return (
        <section className="toy-edit">

            <div className="edit-card">

                <h2>{toyId ? "Update" : "Add"} Toy</h2>

                <form onSubmit={onSubmit}>

                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" value={name} onChange={handleChange} required />

                    <label htmlFor="price">Price:</label>
                    <input type="number" name="price" id="price" min={1} value={price || ''} onChange={handleChange} required />

                    <label htmlFor="imgUrl">Toy Image Url:</label>
                    <input type="text" name="imgUrl" id="imgUrl" value={imgUrl} onChange={handleChange} />

                    <label htmlFor="inStock">In Stock:</label>
                    <input type="checkbox" name="inStock" id="inStock" checked={inStock} onChange={handleChange} />

                    <label>Brands:</label>
                    <div className="labels-picker-wrapper" ref={brandsPickerWrapper}>
                        <div className="prev-labels" onClick={() => toggleLabelsPicker('brands')}>
                            {brands?.length > 0 ? brands.join(', ') : 'Choose toy Brands'}
                        </div>
                        {isLabelsPickerOpen.isOpen &&
                            isLabelsPickerOpen.type === 'brands' &&
                            toysLabels?.brands?.length > 0 && < LabelPicker
                                labels={toysLabels.brands}
                                filterLabels={brands}
                                onSaveLabels={onSaveLabels}
                                labelType={'brands'}
                            />}
                    </div>

                    <label>Product Types:</label>
                    <div className="labels-picker-wrapper" ref={productTypesPickerWrapper}>
                        <div className="prev-labels" onClick={() => toggleLabelsPicker('productTypes')}>
                            {productTypes?.length > 0 ? productTypes.join(', ') : 'Choose toy Product Types'}
                        </div>
                        {isLabelsPickerOpen.isOpen &&
                            isLabelsPickerOpen.type === 'productTypes' &&
                            toysLabels?.productTypes?.length > 0 && < LabelPicker
                                labels={toysLabels.productTypes}
                                filterLabels={productTypes}
                                onSaveLabels={onSaveLabels}
                                labelType={'productTypes'}
                            />}
                    </div>

                    <label>Companies:</label>
                    <div className="labels-picker-wrapper" ref={companiesPickerWrapper}>
                        <div className="prev-labels" onClick={() => toggleLabelsPicker('companies')}>
                            {companies?.length > 0 ? companies.join(', ') : 'Choose toy Companies'}
                        </div>
                        {isLabelsPickerOpen.isOpen &&
                            isLabelsPickerOpen.type === 'companies' &&
                            toysLabels?.companies?.length > 0 && < LabelPicker
                                labels={toysLabels.companies}
                                filterLabels={companies}
                                onSaveLabels={onSaveLabels}
                                labelType={'companies'}
                            />}
                    </div>

                    <label htmlFor="description">Description:</label>
                    <textarea type="text" name="description" id="description" value={description} onChange={handleChange} required ></textarea>

                    <button className="t-a">
                        {isLoading ? <div className="mini-loader"></div> : "Save"}
                    </button>
                </form>
            </div>
        </section>
    )
}