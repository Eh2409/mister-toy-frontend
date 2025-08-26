import { useState } from 'react'
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom'

//services
import { toyActions } from '../../store/actions/toy.actions.js'

export function AppHeader(props) {

    const navigate = useNavigate()
    const location = useLocation()

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    function onSearch(ev) {
        ev.preventDefault()

        const searchVal = ev.target.elements.search.value

        if (!searchVal) return

        if (location.pathname === '/toy') {
            toyActions.setSearchWord(searchVal)
        } else {
            navigate(`/toy?name=${searchVal}`)
        }
        ev.target.elements.search.value = ''

    }

    function toggleIsMobileNavOpen() {
        setIsMobileNavOpen(!isMobileNavOpen)
    }

    function onCloseMobileNav() {
        setIsMobileNavOpen(false)
    }

    return (
        <header className="app-header full">


            <div className='header-content'>

                <button className='mobile-nav-btn' onClick={toggleIsMobileNavOpen}>
                    {isMobileNavOpen
                        ? <img src="/images/x.svg" alt="x" className='icon' />
                        : <img src="/images/bars.svg" alt="bars" className='icon' />
                    }
                </button>

                <Link to="/" className='main-app-logo'>Mister Toy</Link>

                <form className='main-search flex' onSubmit={onSearch}>
                    <input type="text" name="search" className='m-s' placeholder='Ready, set, toy search!' />

                    <button className='s-b'>
                        <div className='glass-icon'></div>
                    </button>
                </form>

                <button className='user-btn'>
                    <img src="/images/user.svg" alt="user" className='icon' />
                </button>
            </div>

            <div className={`nav-black-wrapper ${isMobileNavOpen ? "nav-open" : ""}`} onClick={onCloseMobileNav}></div>

            <nav className={`main-app-nav flex  align-center ${isMobileNavOpen ? "nav-open" : ""}`}>
                <div className='nav-header flex justify-between align-center'>
                    <span>Mister Toy</span>
                    <button className='close-btn' onClick={onCloseMobileNav}>x</button>
                </div>
                <NavLink to="/" onClick={onCloseMobileNav}>Home</NavLink>
                <NavLink to="/about" onClick={onCloseMobileNav}>About Us</NavLink>
                <NavLink to="/toy" onClick={onCloseMobileNav}>Toys</NavLink>
            </nav>

        </header>
    )
}