import { useEffect, useState, useRef } from 'react'
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

//services
import { toyActions } from '../../store/actions/toy.actions.js'
import { userActions } from '../../store/actions/user.actions.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'

// cmps
import { UserMsg } from './UserMsg.jsx'
import { Popup } from './Popup.jsx'
import { LoginSignup } from './user/LoginSignup.jsx'
//images
import xMark from '/images/x.svg'
import bars from '/images/bars.svg'
import userIcon from '/images/user.svg'
import { UserMenu } from './user/UserMenu.jsx'


export function AppHeader(props) {

    const navigate = useNavigate()
    const location = useLocation()

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const isLoginSignupOpen = useSelector(storeState => storeState.userModule.isLoginSignupOpen)

    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isSignup, setIsSignUp] = useState(false)
    const [isMiniLoading, setIsMiniLoading] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const headerRef = useRef()
    const navRef = useRef()

    const userMenuRef = useRef()
    const userBtnRef = useRef()

    useEffect(() => {
        if (isLoginSignupOpen) {
            setIsPopupOpen(true)
            userActions.setIsLoginSignupPopupOpen(false)
        }
    }, [isLoginSignupOpen])

    useEffect(() => {
        const options = {
            threshold: 0.3,
        }

        const headerObserver = new IntersectionObserver(onHeaderObserved, options)

        headerObserver.observe(headerRef.current)

        function onHeaderObserved(entries) {
            entries.forEach(entry => {
                navRef.current.classList.toggle('nav-fixed', !entry.isIntersecting)

                if (isUserMenuOpen && !entry.isIntersecting) toggleIsUserMenuOpen()
            })
        }

    }, [isUserMenuOpen])


    useEffect(() => {
        if (isUserMenuOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })
    }, [isUserMenuOpen])


    function handleClickOutside({ target }) {
        const elUserMenu = userMenuRef.current
        const elUserBtn = userBtnRef.current
        if (target !== elUserMenu && !elUserMenu.contains(target)) {
            if (target === elUserBtn || elUserBtn.contains(target)) return
            toggleIsUserMenuOpen()
        }
    }



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


    /// user actions

    async function signup(credentials) {
        setIsMiniLoading(true)
        try {
            await userActions.signup(credentials)
            showSuccessMsg('Signup successfully')
            onClosePopup()
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot signup')
        } finally {
            setIsMiniLoading(false)
        }
    }

    async function login(credentials) {
        setIsMiniLoading(true)
        try {
            await userActions.login(credentials)
            showSuccessMsg('Signup successfully')
            onClosePopup()
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot login')
        } finally {
            setIsMiniLoading(false)
        }
    }

    async function onLogout() {
        try {
            await userActions.logout()
            showSuccessMsg('logout successfully')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot logout')
        }
    }


    function toggleIsSignup() {
        setIsSignUp(!isSignup)
    }

    function toggleIsPopupOpen() {
        setIsPopupOpen(!isPopupOpen)
    }
    function onClosePopup() {
        setIsPopupOpen(false)
    }

    function toggleIsUserMenuOpen() {
        setIsUserMenuOpen(!isUserMenuOpen)
    }


    return (
        <header className="app-header full" ref={headerRef}>


            <div className='header-content' >

                <button className='mobile-nav-btn' onClick={toggleIsMobileNavOpen}>
                    {isMobileNavOpen
                        ? <img src={xMark} alt="x" className='icon' />
                        : <img src={bars} alt="bars" className='icon' />
                    }
                </button>

                <Link to="/" className='main-app-logo'><span>MISTER</span> TOY</Link>

                <form className='main-search flex' onSubmit={onSearch}>
                    <input type="text" name="search" className='m-s' placeholder='Ready, set, toy search!' />

                    <button className='s-b'>
                        <div className='glass-icon'></div>
                    </button>
                </form>

                <button
                    className={`user-btn ${loggedinUser ? "loggedin" : ""}`}
                    onClick={() => { loggedinUser ? toggleIsUserMenuOpen() : toggleIsPopupOpen() }}
                    ref={userBtnRef}
                >
                    {loggedinUser
                        ? <div className=''>{loggedinUser?.username.substring(0, 1)}</div>
                        : <img src={userIcon} alt="user" className='icon' />
                    }

                    {loggedinUser && <UserMenu
                        loggedinUser={loggedinUser}
                        onLogout={onLogout}
                        userMenuRef={userMenuRef}
                        isUserMenuOpen={isUserMenuOpen}
                        toggleIsUserMenuOpen={toggleIsUserMenuOpen}
                    />}

                </button>

            </div>

            <div className={`nav-black-wrapper ${isMobileNavOpen ? "nav-open" : ""}`} onClick={onCloseMobileNav}></div>

            <nav className={`main-app-nav flex  align-center ${isMobileNavOpen ? "nav-open" : ""}`} ref={navRef}>
                <div className='nav-header flex justify-between align-center'>
                    <div className='main-app-logo'><span>MISTER</span> TOY</div>
                    <button className='close-btn' onClick={onCloseMobileNav}>x</button>
                </div>
                <NavLink to="/" onClick={onCloseMobileNav}>Home</NavLink>
                <NavLink to="/about" onClick={onCloseMobileNav}>About Us</NavLink>
                <NavLink to="/toy" onClick={onCloseMobileNav}>Toys</NavLink>
                <NavLink to="/dashboard" onClick={onCloseMobileNav}>Dashboard</NavLink>
                <NavLink to="/review" onClick={onCloseMobileNav}>Reviews</NavLink>
            </nav>
            <UserMsg />

            <Popup
                header={<h2 className='login-signup-logo'>{isSignup ? "Signup" : "Login"}</h2>}
                aside={<img src="./images/aside-image.jpg" alt="popup-img" />}
                onClosePopup={onClosePopup}
                isPopupOpen={isPopupOpen}>

                <LoginSignup
                    isPopupOpen={isPopupOpen}
                    signup={signup}
                    login={login}
                    toggleIsSignup={toggleIsSignup}
                    isSignup={isSignup}
                    isMiniLoading={isMiniLoading}
                />

            </Popup>

        </header>
    )
}