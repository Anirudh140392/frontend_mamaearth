import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
/* 
	@param message: String
	messageType: String error or success
	clearMessage: Function for clear message
*/
function Notification(props) {
	const { message, messageType, clearMessage } = props;
	const [internalState, setInternalState] = useState(false);
	useEffect(() => {
		if (message != '' && messageType !== 'error') {
			setInternalState(true);
			setTimeout(() => {
				setInternalState(false);
				clearMessage('');
			}, 4000);
		}
	}, [message])

	return (
		messageType === 'error' ? (
			<Modal show={message?.length} onHide={() => clearMessage()} >
				<Modal.Header className="p-3 border-bottom">
					<Modal.Title style={{ color: 'red' }}>{messageType?.toUpperCase()}</Modal.Title>
					<button type="button" onClick={() => clearMessage()} className="modal-close-button" data-dismiss="modal" aria-label="Close">
                        &times;
                    </button>
				</Modal.Header>
				<Modal.Body>{message}</Modal.Body>
				<Modal.Footer>
					<button className="btn btn-primary shadow-none" onClick={() => clearMessage()}>
						Ok
					</button>
				</Modal.Footer>
			</Modal>
		) : internalState && message ? (
			<div className='alert alert-success alert-message-modal' role="alert">
				{message}
			</div>
		) : null
	);
}

export default Notification;