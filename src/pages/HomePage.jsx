import { useEffect } from "react"
import { useSelector } from "react-redux"

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { showErrorMsg } from "../services/event-bus.service.js"

// cmps
import { ToyListHome } from "../cmps/toy/ToyListHome.jsx"
import { ToyHomeLoader } from "../cmps/toy/ToyHomeLoader.jsx"
import { BrandsScroller } from "../cmps/BrandsScroller.jsx"


export function HomePage(props) {

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)
    const toysLabels = useSelector(storeState => storeState.toyModule.labels)


    useEffect(() => {
        const filterBy = { sortType: 'createdAt', dir: -1, inStock: true, pageIdx: undefined }
        loadToys(filterBy)
        loadLabels()
    }, [])

    async function loadToys(filterBy) {
        try {
            await toyActions.load(filterBy)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load toys')
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

    return (
        <section className="home-page">

            {toysLabels?.brands?.length > 0 &&
                <BrandsScroller brands={toysLabels.brands} />}

            <h2>NEW ARRIVALS</h2>

            {!isLoading
                ? <ToyListHome toys={toys} />
                : <ToyHomeLoader />
            }

        </section>
    )
}