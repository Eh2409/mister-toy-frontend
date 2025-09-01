import { NavLink } from 'react-router-dom'

export function BrandsScroller({ brands }) {

    return (
        <section className="brand-scroller">

            <div className="brand-list">
                {brands.map(b => {
                    return <NavLink to={`/toy?brands=${b}`} key={b + '1'} className='brand'>
                        <img src={`./images/brands/${b}.png`} alt={b} />
                    </NavLink>
                })}
            </div>

            <div className="brand-list" aria-hidden="true">
                {brands.map(b => {
                    return <NavLink to={`/toy?brands=${b}`} key={b + '1'} className='brand'>
                        <img src={`./images/brands/${b}.png`} alt={b} />
                    </NavLink>
                })}
            </div>

        </section>
    )

}