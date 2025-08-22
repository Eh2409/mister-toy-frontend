
export function ToyPreview({ toy }) {

    return (
        <>
            <img
                src={toy.imgUrl}
                alt={toy.name}
                onError={ev => ev.currentTarget.src = "/public/images/toys/no-toy-image.jpg"}
            />
            <div className="toy-prev-info">
                <h2 className="toy-name">{toy.name}</h2>
                <div>Labels: {toy.labels.join(', ')}</div>
                <div className={`toy-price ${!toy.inStock ? 'out' : ''}`}>Price: ${toy.price}</div>
            </div>
        </>
    )

}