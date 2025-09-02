import { Fragment } from 'react'

export function BrancheList({ branches, isBrancheOpen, toggleIsBrancheOpen }) {
    return (
        <ul className="branches-list">
            {branches?.length > 0 && branches.map(b => {
                return <Fragment key={b._id}>
                    <li className="branche-header" onClick={() => toggleIsBrancheOpen(b)} >
                        <span className='toggle-symbol'>{isBrancheOpen.isOpen && isBrancheOpen.branche?._id === b._id ? "-" : "+"}</span>
                        {b.name}
                    </li>
                    <li key={b._id + b.name}
                        className={`branche-info ${isBrancheOpen.isOpen && isBrancheOpen.branche?._id === b._id ? "open" : ""}`}>
                        <div>
                            <div><span>City:</span> {b.city}</div>
                            <div><span>Address:</span> {b.address}</div>
                            <div><span>Phone:</span> {b.phone}</div>
                        </div>
                    </li>
                </Fragment>
            })}
        </ul>
    )
}