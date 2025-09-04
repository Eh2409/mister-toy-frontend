import { useState, useEffect, useRef } from "react"
import { userActions } from "../../../store/actions/user.actions.js"

export function ToyMsgChat({ toyMsgs, loggedinUser, onSaveMsg }) {

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


    function onSendMsg(ev) {
        ev.preventDefault()

        if (!msgToEdit.txt || !loggedinUser) return
        msgToEdit.by = { _id: loggedinUser._id, username: loggedinUser.username }

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