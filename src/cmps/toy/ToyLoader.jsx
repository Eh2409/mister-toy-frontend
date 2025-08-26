export function ToyLoader({ size = 8 }) {
    return (
        <ul className="toy-loader">
            {Array.from({ length: size }).map((_, idx) => {
                return <li className="toy-item" key={idx}>
                    <div className="img-prev"></div>
                    <div></div>
                </li>
            })}
        </ul>
    )
}