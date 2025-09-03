import { NavLink } from 'react-router-dom'

export function UserMenu({ loggedinUser, onLogout, userMenuRef, isUserMenuOpen, toggleIsUserMenuOpen }) {

    return (
        <div className={`user-menu-wrapper ${isUserMenuOpen ? "visible" : ""}`}>
            <section className="user-menu" ref={userMenuRef} onClick={event => event.stopPropagation()}>
                <header className="user-menu-header">
                    <div>Welcome {loggedinUser.fullname.length > 10 ? < br /> : ""} {loggedinUser.fullname}</div>
                </header>
                <nav className="user-menu-nav">
                    <NavLink to={`/user/${loggedinUser._id}/settings`} onClick={toggleIsUserMenuOpen}>My account</NavLink>
                    <NavLink to="/" onClick={() => { onLogout(), toggleIsUserMenuOpen() }}>Logout</NavLink>
                </nav>
            </section>
        </div>
    )
}