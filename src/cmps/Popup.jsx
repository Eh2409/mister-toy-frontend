export function Popup({ header, footer, onClosePopup, children, isPopupOpen, aside }) {
    return (
        <div className={`popup-black-wrapper ${isPopupOpen ? "open" : ""}`} onClick={onClosePopup}>
            <section className="popup" onClick={(event) => event.stopPropagation()}>

                {aside && <aside>
                    {aside}
                </aside>}

                <div className="popup-main-content">
                    <header className="popup-header">
                        {header}
                        <button
                            className="close-btn" onClick={onClosePopup}
                        >X</button>
                    </header>

                    <main className="popup-main">
                        {children}
                    </main>

                    <footer className="popup-footer">
                        {footer}
                    </footer>
                </div>
            </section>
        </div>
    )
}