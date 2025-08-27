import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { showErrorMsg } from "../services/event-bus.service.js"
// cmps
import { ToyListHome } from "../cmps/toy/ToyListHome.jsx"
import { ToyHomeLoader } from "../cmps/toy/ToyHomeLoader.jsx"



export function HomePage(props) {

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)

    useEffect(() => {
        const filterBy = { sortType: 'createdAt', dir: -1, inStock: true }
        loadToys(filterBy)
    }, [])

    function loadToys(filterBy) {
        return toyActions.load(filterBy)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load toys')
            })
    }

    return (
        <section className="home-page">

            <h2>NEW ARRIVALS</h2>
            {!isLoading
                ? <ToyListHome toys={toys} />
                : <ToyHomeLoader />
            }

        </section>
    )
}