import { useNavigate } from "react-router-dom"


export function ToyListHome({ toys }) {
    const navigate = useNavigate()

    return (
        <ul className="home-toys">
            {toys.slice(0, 10).map((t, idx) => {
                if (idx > 9) return
                return <li key={t._id} className="toy-item" onClick={() => navigate(`/toy/${t._id}`)}>
                    <div className="toy-image-wrapper">
                        <img
                            src={t.imgUrl}
                            alt={t.name}
                            className="toy-image"
                            onError={ev => ev.currentTarget.src = "./images/toys/no-toy-image.jpg"}
                        />
                    </div>
                    <div className="toy-name">
                        <span>{t.name}</span>
                    </div>
                </li>
            })}
        </ul>
    )
}