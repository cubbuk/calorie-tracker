import React, {PropTypes} from "react";
import {Button, Modal} from "react-bootstrap";


class CTConfirmModal extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    render() {
        let {children, cancelTitle, confirmTitle, onCancel, onConfirm, show, title, ...otherProps} = this.props;
        let view = null;
        if (show) {
            view = <Modal show {...otherProps}>
                {title && <Modal.Title>{title}</Modal.Title>}
                <Modal.Body>{children}</Modal.Body>
                <Modal.Footer>
                    <Button className="pull-left" onClick={onCancel}>{cancelTitle}</Button>
                    <Button bsStyle="primary" onClick={onConfirm}>{confirmTitle}</Button>
                </Modal.Footer>
            </Modal>;
        }
        return view;
    }
}

CTConfirmModal.propTypes = {
    show: PropTypes.bool,
    cancelTitle: PropTypes.string,
    confirmTitle: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string
};

CTConfirmModal.defaultProps = {
    cancelTitle: "Cancel",
    confirmTitle: "Yes"
};

export default CTConfirmModal;
