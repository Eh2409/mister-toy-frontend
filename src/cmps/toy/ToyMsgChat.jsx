import { useState, useEffect, useRef } from "react"
import { userActions } from "../../../store/actions/user.actions.js"
import { SOCKET_EMIT_SET_TOPIC, socketService } from "../../services/socket.service.js"

export function ToyMsgChat({ toyMsgs, loggedinUser, onSaveMsg, onRemoveMsg, toyId }) {

    const [msgToEdit, setMsgToEdit] = useState({ txt: '' })

    const chatMessagesRef = useRef()

    function handleChange({ target }) {
        var { value, name } = target

        setMsgToEdit(prev => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        chatMessagesRef.current.scrollTo({
            top: chatMessagesRef.current.scrollHeight,
            behavior: 'smooth'
        })
    }, [toyMsgs])

    useEffect(() => {
        if (toyId) {
            socketService.emit(SOCKET_EMIT_SET_TOPIC, toyId)
        }
    }, [toyId])

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
                {toyMsgs.length > 0 && toyMsgs.map((m, idx) => {
                    return <li key={m.at + idx} className={`msg ${loggedinUser?._id === m.by._id ? 'you' : ''}`}>
                        <div className="msg-header flex justify-between align-center ">
                            <span>by: {m.by.username}</span>
                            <span>{new Date(m.at).toLocaleTimeString('en-US', options)}</span>
                            {loggedinUser?.isAdmin &&
                                <button className="remove-btn" onClick={() => onRemoveMsg(m?.id)}>X</button>}
                        </div>
                        <div>{m.txt}</div>
                    </li>
                })}
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