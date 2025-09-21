import { useState, useEffect, useRef } from "react"
import { userActions } from "../../../store/actions/user.actions.js"
import { SOCKET_EMIT_SET_TOPIC, SOCKET_EMIT_USER_TYPING, SOCKET_EVENT_ADD_MSG, SOCKET_EVENT_USER_TYPING, socketService } from "../../services/socket.service.js"
import { debounce } from "../../services/util.service.js"

export function ToyMsgChat({ toyMsgs, loggedinUser, onSaveMsg, onRemoveMsg, toyId }) {

    const [msgToEdit, setMsgToEdit] = useState({ txt: '' })
    const [typingUsers, setTypingUsers] = useState([])

    const chatMessagesRef = useRef()
    const debounceRef = useRef(debounce(removeTypingUser, 600))

    useEffect(() => {
        chatMessagesRef.current.scrollTo({
            top: chatMessagesRef.current.scrollHeight,
            behavior: 'smooth'
        })
    }, [toyMsgs, typingUsers])

    useEffect(() => {
        if (toyId) {
            socketService.emit(SOCKET_EMIT_SET_TOPIC, toyId)
        }
    }, [toyId])


    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, (msg) => {
            setTypingUsers(prev =>
                prev.filter(username => username !== msg?.by?.username)
            )
        })

        return () => socketService.off(SOCKET_EVENT_ADD_MSG)
    }, [])

    useEffect(() => {
        socketService.on(SOCKET_EVENT_USER_TYPING, (username) => {
            setTypingUsers(prev => {
                if (prev.includes(username)) return prev
                return [...prev, username]
            })

            debounceRef.current(username)
        })

        return () => socketService.off(SOCKET_EVENT_USER_TYPING)
    }, [])

    function removeTypingUser(username) {
        setTypingUsers(prev =>
            prev.filter(u => u !== username)
        )
    }

    function handleChange({ target }) {
        var { value, name } = target

        setMsgToEdit(prev => ({ ...prev, [name]: value }))
        if (loggedinUser?.username) socketService.emit(SOCKET_EMIT_USER_TYPING, loggedinUser.username)
    }


    function onSendMsg(ev) {
        ev.preventDefault()

        if (!msgToEdit.txt) return

        onSaveMsg(msgToEdit)
        setMsgToEdit(prev => ({ txt: '' }))
    }

    function onOpenLoginPopup() {
        userActions.setIsLoginSignupPopupOpen(true)
    }

    const options = { hour: "2-digit", minute: "2-digit", hour12: false }

    return (
        <section className="chat">

            <ul className="chat-messages" ref={chatMessagesRef}>
                {toyMsgs.length > 0 ? (
                    toyMsgs.map((m, idx) => (
                        <li key={m.at + idx} className={`msg ${loggedinUser?._id === m.by._id ? 'you' : ''}`}>
                            <div className="msg-header flex justify-between align-center">
                                <span>by: {m.by.username}</span>
                                <span>{new Date(m.at).toLocaleTimeString('en-US', options)}</span>
                                {loggedinUser?.isAdmin &&
                                    <button className="remove-btn" onClick={() => onRemoveMsg(m?.id)}>X</button>}
                            </div>
                            <pre>{m.txt}</pre>
                        </li>
                    ))
                ) : (
                    <li className="no-items-found-msg ">No messages yet — start the conversation!</li>
                )}

                {typingUsers?.length > 0 && (
                    <li className="user-typing-msg" >
                        {typingUsers.join(", ")} {typingUsers.length === 1 ? "is typing..." : "are typing..."}
                    </li>
                )}
            </ul>

            {loggedinUser ?
                <form onSubmit={onSendMsg} className="flex">
                    <input
                        type="text"
                        name="txt"
                        id="txt"
                        autoComplete="off"
                        value={msgToEdit.txt}
                        onChange={handleChange} />
                    <button className="t-a">Send</button>
                </form>
                : <div className="authentication-msg">
                    <span onClick={onOpenLoginPopup}> Login / Signup</span> to add massage
                </div>
            }

        </section>
    )
}