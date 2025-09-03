import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"

// cmps
import { ToyPreview } from "./ToyPreview"

export function ToyList({ toys, onRemove, isMiniLoading, loggedinUser }) {

    const navigate = useNavigate()

    return (
        <ul className='toy-list'>
            {toys.map(toy => {
                return <li key={toy._id} className='toy-item' onClick={() => navigate(`/toy/${toy._id}`)}>
                    <ToyPreview toy={toy} />
                    <div className='toy-actions flex justify-center align-center' onClick={(event) => event.stopPropagation()}>
                        <Link to={`/toy/${toy._id}`} className='btn t-a'>Details</Link>
                        {loggedinUser?.isAdmin && <>
                            <Link to={`/toy/edit/${toy._id}`} className='btn t-a'>Edit</Link>
                            <button onClick={() => { onRemove(toy._id) }} className='t-a'>
                                {isMiniLoading.isLoading && isMiniLoading.toyId === toy._id
                                    ? <div className="mini-loader"></div> : "Delete"}
                            </button>
                        </>}
                    </div>
                </li>
            })}
        </ul>

    )
}