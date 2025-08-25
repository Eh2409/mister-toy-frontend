import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from "react-router-dom"

import { useSelector } from "react-redux"

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { toyService } from '../services/Toy/index-toy.js'
import { cleanSearchParams } from '../services/util.service.js'

// cmps
import { ToyList } from '../cmps/toy/ToyList.jsx'
import { ToyFilter } from '../cmps/toy/ToyFilter.jsx'
import { ToySort } from '../cmps/toy/ToySort.jsx'
import { Pagination } from '../cmps/Pagination.jsx'

export function ToyIndex(props) {

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const maxPageCount = useSelector(storeState => storeState.toyModule.maxPageCount)
    const toysLabels = useSelector(storeState => storeState.toyModule.labels)

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(toyService.getFilterFromSearchParams(searchParams))

    useEffect(() => {
        setSearchParams(cleanSearchParams(filterBy))
        loadToys(filterBy)
    }, [filterBy])

    useEffect(() => {
        if (toysLabels?.length < 0) {
            loadLabels()
        }
    }, [])

    function loadToys(filterBy) {
        return toyActions.load(filterBy)
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

    function loadLabels() {
        return toyActions.loadLabels()
            .catch(err => {
                console.log('err:', err)
            })
    }


    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function setPageIdx(pageNum) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageNum }))
    }

    const { name, price, labels, inStock, sortType, dir, pageIdx } = filterBy

    return (
        <section className="toy-index">

            <div className='toy-content-header flex justify-between align-center'>
                <Link to='/toy/edit' className='btn t-a'>Add Toy</Link>
                <ToySort sortBy={{ sortType, dir }} onSetFilterBy={onSetFilterBy} />
            </div>

            <aside className='toy-filter-wrapper'>
                <ToyFilter
                    filterBy={{ name, price, labels, inStock }}
                    onSetFilterBy={onSetFilterBy}
                    toysLabels={toysLabels}
                />
            </aside>

            <main className='toy-index-content'>
                {toys.length > 0 && <ToyList toys={toys} onRemove={onRemove} />}

                <Pagination
                    maxPageCount={maxPageCount}
                    pageIdx={pageIdx}
                    setPageIdx={setPageIdx}
                />
            </main>
        </section>
    )
}