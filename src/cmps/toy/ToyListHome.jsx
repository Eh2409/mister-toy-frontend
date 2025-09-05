import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { ImageLoader } from '../ImageLoader'

export function ToyListHome({ toys }) {
    const navigate = useNavigate()

    useEffect(() => {
        const options = {
            threshold: 0.14,
        }

        const observer = new IntersectionObserver(onHeaderObserved, options)


        const elToysItems = document.querySelectorAll('.toy-item')
        elToysItems.forEach((el) => observer.observe(el))

        function onHeaderObserved(entries) {
            entries.forEach(entry => {
                entry.target.classList.toggle('show', entry.isIntersecting)
            })
        }

    }, [toys])

    return (
        <ul className="home-toys" >
            {toys.slice(0, 10).map((t, idx) => {
                if (idx > 9) return
                return <li key={t._id} className="toy-item" onClick={() => navigate(`/toy/${t._id}`)}>
                    <div className="toy-image-wrapper">
                        <ImageLoader img={t?.imgUrl} alt={t?.name} />
                    </div>
                    <div className="toy-name">
                        <span>{t.name}</span>
                    </div>
                </li>
            })}
        </ul>
    )
}