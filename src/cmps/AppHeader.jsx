import { NavLink } from 'react-router-dom'

export function AppHeader(props) {
    return (
        <header className="app-header flex align-center">
            <h1>Mister Toy</h1>

            <nav className="header-nav">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/toy">Toys</NavLink>
            </nav>
        </header>
    )
}