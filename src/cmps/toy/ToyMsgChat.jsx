import { useState, useEffect, useRef } from "react"

export function ToyMsgChat({ toyMsgs, loggedinUser, onSaveMsg }) {

    const [chatMessages, setChatMessages] = useState(toyMsgs)
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
    }, [chatMessages])

    useEffect(() => {
        setChatMessages(toyMsgs)
    }, [toyMsgs])


    function onSendMsg(ev) {
        ev.preventDefault()

        if (!msgToEdit.txt || !loggedinUser) return
        msgToEdit.by = { _id: loggedinUser._id, username: loggedinUser.username }

        onSaveMsg(msgToEdit)
        setMsgToEdit(prev => ({ txt: '' }))
    }


    const options = { hour: "2-digit", minute: "2-digit", hour12: false }

    return (
        <section className="chat">

            <ul className="chat-messages" ref={chatMessagesRef}>
                {chatMessages.length > 0 && chatMessages.map((m, idx) => {
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
                : <div> Login / Signup to add msg</div>
            }

        </section>
    )
}