import { useState, useEffect, useRef } from 'react'

export function ToyHomeLoader({ size = 10 }) {

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

        return () => {
            if (observer) {
                observer.disconnect()
            }
        }

    }, [])


    return (
        <ul className="toy-home-loader">
            {Array.from({ length: size }).map((_, idx) => {
                return < li className="toy-item" key={idx}>
                    <div className="toy-image-wrapper">
                    </div>
                    <div className="toy-name">
                    </div>
                </li>
            })}
        </ul >
    )
}