
export function ToyPreview({ toy }) {

    return (
        <>
            <img
                src={toy.imgUrl}
                alt={toy.name}
                onError={ev => ev.currentTarget.src = "/public/images/toys/no-toy-image.jpg"}
            />
            <div>Name: {toy.name}</div>
            <div>Price: {toy.price}</div>
            <div>In Stock: {`${toy.inStock}`}</div>
            <div>labels: {toy.labels.join(', ')}</div>
        </>
    )

}