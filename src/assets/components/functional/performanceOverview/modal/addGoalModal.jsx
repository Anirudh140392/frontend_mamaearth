import React from "react";
import { Modal } from "react-bootstrap";
import ErrorBoundary from "../../../common/erroBoundryComponent";
import AddGoalCreator from "../overview/addGoalCreator";

const AddGoalModal = (props) => {
    const {showGoalModal,
        setShowGoalModal} = props;
    return(
        <React.Fragment>
            <Modal show={showGoalModal} onHide={() => setShowGoalModal(false)} size="lg">
                <Modal.Header className="border-bottom" closeButton>
                    <Modal.Title className="text-dark">
                        Add Goal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="create-rule-con">
                    <ErrorBoundary>
                        <AddGoalCreator setShowGoalModal={setShowGoalModal} />                        
                    </ErrorBoundary>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default AddGoalModal;