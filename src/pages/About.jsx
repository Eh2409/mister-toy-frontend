import { useState, useEffect, useRef, Fragment } from 'react'
import { getBranchesData } from '../services/store.service.js'

export function About(props) {

    const [branches, setBranches] = useState(getBranchesData())
    const [isBrancheOpen, setIsBrancheOpen] = useState({ isOpen: false, brancheId: null })

    function toggleIsBrancheOpen(brancheId) {
        setIsBrancheOpen(prev => {
            if (brancheId === prev.brancheId) {
                prev = { isOpen: false, brancheId: null }
            } else {
                prev = { isOpen: true, brancheId: brancheId }
            }
            return prev
        })
    }

    return (
        <section className="about">

            <h2>About Us</h2>

            <p>
                Welcome to <strong>Mister Toy</strong> — your go-to store for anime toys, action figures, plushies,
                and collectibles from your favorite series. Whether you’re a casual fan or a dedicated collector,
                we’ve got the perfect toy waiting for you!
            </p>

            <h3>Our Branches</h3>

            <ul className="branches-list">
                {branches?.length > 0 && branches.map(b => {
                    return <Fragment key={b._id}>
                        <li className="branche-header" onClick={() => toggleIsBrancheOpen(b._id)} >
                            <span className='toggle-symbol'>{isBrancheOpen.isOpen && isBrancheOpen.brancheId === b._id ? "-" : "+"}</span>
                            {b.name}
                        </li>
                        <li key={b._id + b.name}
                            className={`branche-info ${isBrancheOpen.isOpen && isBrancheOpen.brancheId === b._id ? "open" : ""}`}>
                            <div>
                                <div><span>City:</span> {b.city}</div>
                                <div><span>Address:</span> {b.address}</div>
                                <div><span>Phone:</span> {b.phone}</div>
                            </div>
                        </li>
                    </Fragment>
                })}
            </ul>

        </section>
    )
}