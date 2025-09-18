import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams, NavLink, Outlet } from "react-router-dom"


export function UserDetails(props) {
    const navigate = useNavigate()
    const params = useParams()
    const { userId } = params


    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    useEffect(() => {
        if (!loggedinUser || loggedinUser._id !== userId) {
            navigate('/')
        }
    }, [loggedinUser, userId])



    if (!loggedinUser) return
    return (
        <section className="user-details">

            <h2>Hello {loggedinUser?.username}</h2>

            <nav className="user-details-nav flex">
                <NavLink to={`/user/${loggedinUser._id}/settings`} >My Settings</NavLink>
                <NavLink to={`/user/${loggedinUser._id}/reviews`} >My Reviews</NavLink>
            </nav>

            <Outlet />

        </section >
    )
}