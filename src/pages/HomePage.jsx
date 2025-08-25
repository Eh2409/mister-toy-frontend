import { useState, useEffect, useRef } from "react"
import { toyActions } from "../../store/actions/toy.actions.js"
import { useSelector } from "react-redux"
import { ToyListHome } from "../cmps/toy/ToyListHome.jsx"



export function HomePage(props) {

    const toys = useSelector(storeState => storeState.toyModule.toys)

    const [isToysloaded, setIsToysloaded] = useState(false)

    useEffect(() => {
        const filterBy = { sortType: 'createdAt', dir: -1, inStock: true }
        loadToys(filterBy)
    }, [])

    function loadToys(filterBy) {
        return toyActions.load(filterBy)
            .then(() => {
                setIsToysloaded(true)
            })
            .catch(err => {
                console.log('err:', err)
            })
    }

    return (
        <section className="home-page">

            <h2>NEW ARRIVALS</h2>
            {isToysloaded && toys?.length > 0 &&
                <ToyListHome toys={toys} />
            }
        </section>
    )
}