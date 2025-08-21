import { Link } from 'react-router-dom'

import { ToyPreview } from "./ToyPreview"

export function ToyList({ toys, onRemove }) {
    return (
        <ul>
            {toys.map(toy => {
                return <li key={toy._id}>
                    <ToyPreview toy={toy} />
                    <div>
                        <Link to={`/toy/${toy._id}`}>Details</Link>
                        <button onClick={() => { onRemove(toy._id) }}>Remove</button>
                        <Link to={`/toy/edit/${toy._id}`}>Edit</Link>
                    </div>
                </li>
            })}
        </ul>

    )
}