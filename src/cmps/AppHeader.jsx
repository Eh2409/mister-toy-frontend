import { NavLink, useNavigate, useLocation } from 'react-router-dom'

//services
import { toyActions } from '../../store/actions/toy.actions.js'

export function AppHeader(props) {

    const navigate = useNavigate()
    const location = useLocation()

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

    return (
        <header className="app-header full">

            <div className='header-content flex justify-between align-center'>
                <h1>Mister Toy</h1>

                <form className='main-search flex' onSubmit={onSearch}>
                    <input type="text" name="search" className='m-s' placeholder='Ready, set, toy search!' />

                    <button className='s-b'>
                        <div className='glass-icon'></div>
                    </button>
                </form>

                <button>user</button>
            </div>


            <nav className="header-nav flex  align-center">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About Us</NavLink>
                <NavLink to="/toy">Toys</NavLink>
            </nav>

        </header>
    )
}