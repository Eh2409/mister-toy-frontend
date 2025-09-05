import { ImageLoader } from "../ImageLoader.jsx";

export function ToyPreview({ toy }) {

    return (
        <>
            <ImageLoader img={toy?.imgUrl} alt={toy?.name} />
            <div className="toy-prev-info">
                <h2 className="toy-name">{toy.name}</h2>
                <div>By: {toy.companies.join(', ')}</div>
                <div className={`toy-price ${!toy.inStock ? 'out' : ''}`}>Price: ${toy.price}</div>
            </div>
        </>
    )

}