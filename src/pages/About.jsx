import { useState } from 'react'

// services
import { getBranchesData } from '../services/store.service.js'

// cmps
import { BrancheList } from '../cmps/About/BrancheList.jsx'
import { GoogleMap } from '../cmps/GoogleMap.jsx'

export function About(props) {

    const [branches, setBranches] = useState(getBranchesData())
    const [isBrancheOpen, setIsBrancheOpen] = useState({ isOpen: false, branche: null })

    function toggleIsBrancheOpen(branche) {
        setIsBrancheOpen(prev => {
            if (branche?._id === prev.branche?._id) {
                prev = { isOpen: false, branche: null }
            } else {
                prev = { isOpen: true, branche: branche }
            }
            return prev
        })
    }

    return (
        <section className="about" >

            <h2>About Us</h2>

            <p>
                Welcome to <strong>Mister Toy</strong> — your go-to store for anime toys, action figures, plushies,
                and collectibles from your favorite series. Whether you’re a casual fan or a dedicated collector,
                we’ve got the perfect toy waiting for you!
            </p>

            <div className='branches-info'>
                <h3>Our Branches</h3>

                <BrancheList
                    branches={branches}
                    isBrancheOpen={isBrancheOpen}
                    toggleIsBrancheOpen={toggleIsBrancheOpen}
                />

                <GoogleMap
                    branches={branches}
                    selectedBranche={isBrancheOpen?.branche}
                    toggleIsBrancheOpen={toggleIsBrancheOpen}
                />

            </div>

        </section>
    )
}