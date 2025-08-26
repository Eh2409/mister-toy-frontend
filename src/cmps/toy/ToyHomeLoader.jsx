export function ToyHomeLoader({ size = 10 }) {
    return (
        <ul className="toy-home-loader">
            {Array.from({ length: size }).map((_, idx) => {
                return < li className="toy-item">
                    <div className="toy-image-wrapper">
                    </div>
                    <div className="toy-name">
                    </div>
                </li>
            })}
        </ul >
    )
}