import React from 'react';

import './Input.css';

const Input = ({ message, setMessage, sendMessage }) => (
    <form className="form">
        <input
            className="input" type="text"
            value={message}
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
            onChange={event => setMessage(event.target.value)} />
        <button className="sendButton" type="button" onClick={event => sendMessage(event)}>Send</button>
    </form>
)

export default Input;