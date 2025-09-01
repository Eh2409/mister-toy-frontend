import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from "react-router-dom"

import { useSelector } from "react-redux"

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { toyService } from '../services/toy/index-toy.js'
import { cleanSearchParams } from '../services/util.service.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

// cmps
import { ToyList } from '../cmps/toy/ToyList.jsx'
import { ToyFilter } from '../cmps/toy/ToyFilter.jsx'
import { ToySort } from '../cmps/toy/ToySort.jsx'
import { Pagination } from '../cmps/Pagination.jsx'
import { ToyLoader } from '../cmps/toy/ToyLoader.jsx'

export function ToyIndex(props) {

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const maxPageCount = useSelector(storeState => storeState.toyModule.maxPageCount)
    const toysLabels = useSelector(storeState => storeState.toyModule.labels)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(toyService.getFilterFromSearchParams(searchParams))
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
    const [activeFilterOptionsCount, setActiveFilterOptionsCount] = useState(0)
    const [isMiniLoading, setIsMiniLoading] = useState({ isLoading: false, toyId: '' })

    useEffect(() => {
        setSearchParams(cleanSearchParams(filterBy))
        onCountActiveFilterOptions(filterBy)
        loadToys(filterBy)
    }, [filterBy])

    useEffect(() => {
        if (toysLabels?.length < 0) {
            loadLabels()
        }
    }, [])

    function loadToys(filterBy, isLoaderActive = true) {
        return toyActions.load(filterBy, isLoaderActive)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load toys')
            })
    }

    function onRemove(toyId) {
        setIsMiniLoading({ isLoading: true, toyId: toyId })
        return toyActions.remove(toyId)
            .then(() => {
                const isLoaderActive = false
                loadToys(filterBy, isLoaderActive)
                showSuccessMsg(`toy removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove toy ' + toyId)
            })
            .finally(() => {
                setIsMiniLoading({ isLoading: false, toyId: '' })
            })
    }

    function loadLabels() {
        return toyActions.loadLabels()
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load labels')
            })
    }


    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function setPageIdx(pageNum) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageNum }))
    }

    function toggleIsMobileFilterOpen() {
        setIsMobileFilterOpen(!isMobileFilterOpen)
    }
    function closeMobileFilter() {
        setIsMobileFilterOpen(false)
    }

    function onCountActiveFilterOptions(filter) {

        const count = Object.entries(filter).filter(([key, val]) => {
            if (key === 'sortType' || key === 'dir' || key === 'pageIdx') return
            if (key === 'inStock') return val !== 'all' ? true : false
            if (key === 'brands' || key === 'productTypes' || key === 'companies') return val?.length > 0 ? true : false
            else return val
        }).length

        setActiveFilterOptionsCount(count)
    }

    const { name, price, brands, productTypes, companies, inStock, sortType, dir, pageIdx } = filterBy

    return (
        <section className="toy-index">

            <div className="toy-content-header flex justify-between align-center">

                <button className='mobile-filter-btn' onClick={toggleIsMobileFilterOpen}>
                    Filter {activeFilterOptionsCount ? `(${activeFilterOptionsCount})` : ""}
                </button>
                <Link to='/toy/edit' className='btn t-a'>Add Toy</Link>
                <ToySort sortBy={{ sortType, dir }} onSetFilterBy={onSetFilterBy} />

            </div>

            <aside className={`toy-filter-wrapper ${isMobileFilterOpen ? "mobile-filter-open" : ""}`}>
                <ToyFilter
                    filterBy={{ name, price, brands, productTypes, companies, inStock }}
                    onSetFilterBy={onSetFilterBy}
                    toysLabels={toysLabels}
                    closeMobileFilter={closeMobileFilter}
                />
            </aside>

            <main className="toy-index-content">

                {filterBy?.brands?.length === 1 && <div className='brand-logo'>
                    <img src={`./images/brands/${brands[0]}.png`} alt={brands[0]} />
                </div>}

                {isLoading
                    ? <ToyLoader />
                    : (toys?.length > 0
                        ? <ToyList toys={toys} onRemove={onRemove} isMiniLoading={isMiniLoading} />
                        : <div className='no-toys-found-msg'>No items match your search criteria.</div>
                    )
                }

                {toys?.length > 0 && <Pagination
                    maxPageCount={maxPageCount}
                    pageIdx={pageIdx}
                    setPageIdx={setPageIdx}
                />}

            </main>
        </section>
    )
}