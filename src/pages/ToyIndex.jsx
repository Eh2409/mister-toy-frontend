import { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"

import { useSelector } from "react-redux"


// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { ToyList } from '../cmps/toy/ToyList.jsx'

export function ToyIndex(props) {

    const toys = useSelector(storeState => storeState.toyModule.toys)


    useEffect(() => {
        load()
    }, [])

    function load() {
        return toyActions.load()
            .catch(err => {
                console.log('err:', err)
            })
    }

    function onRemove(toyId) {
        return toyActions.remove(toyId)
            .then(() => {
                console.log('toy removes:')
            })
            .catch(err => {
                console.log('err:', err)
            })
    }


    return (
        <section className="toy-index">

            <Link to='/toy/edit'>Add Toy</Link>

            {toys.length > 0 && <ToyList toys={toys} onRemove={onRemove} />}

        </section>
    )
}