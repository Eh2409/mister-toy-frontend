import { useState, useEffect, useRef } from "react"
import { debounce, getRandomIntInclusive } from "../services/util.service.js"

export function Chat(props) {

    const [chatMessages, setChatMessages] = useState([{ by: 'chat-bot', at: Date.now(), txt: 'Hello! How can I assist you today?' }])
    const [msgToEdit, setMsgToEdit] = useState({ by: 'you', at: 0, txt: '' })

    const chatMessagesRef = useRef()
    const debounceRef = useRef(debounce(AddBotMsg, 1000))

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

    function onSendMsg(ev) {
        ev.preventDefault()

        if (!msgToEdit.txt) return
        msgToEdit.at = Date.now()

        setChatMessages(prev => ([...prev, msgToEdit]))
        setMsgToEdit(prev => ({ ...prev, txt: '', at: 0 }))

        debounceRef.current()
    }

    function AddBotMsg() {
        const messages = [`I'm sorry, I didn't understand that. Could you please rephrase?`,
            'Your request has been submitted successfully',
            'Please hold on while I check that information for you.',
            'Thank you for contacting us. Have a great day!',
            `I'm here to help 24/7, so feel free to ask me anything!`]
        const botMsg = { by: 'chat-bot', at: Date.now(), txt: messages[getRandomIntInclusive(0, messages.length - 1)] }
        setChatMessages(prev => ([...prev, botMsg]))
    }

    const options = { hour: "2-digit", minute: "2-digit", hour12: false }

    return (
        <section className="chat">

            <ul className="chat-messages" ref={chatMessagesRef}>
                {chatMessages.length > 0 && chatMessages.map(m => {
                    return <li key={m.at} className={`msg ${m.by}`}>
                        <div className="msg-header flex justify-between align-center ">
                            <span>by: {m.by}</span>
                            <span>{new Date(m.at).toLocaleTimeString('en-US', options)}</span>
                        </div>
                        <div>{m.txt}</div>
                    </li>
                })}
            </ul>

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

        </section>
    )
}