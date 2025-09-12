export function ReviewLoader({ size = 9 }) {
    return (
        <section className="review-loader">
            {Array.from({ length: size }).map((_, idx) => {
                return <li className="review-item" key={idx}></li>
            })}
        </section>
    )
}