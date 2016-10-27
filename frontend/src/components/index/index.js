import React, {PropTypes} from "react";
import {Button, Modal} from "react-bootstrap";
import IndexNavbar from "./_components/index_navbar/index_navbar";
import IndexFooter from "./_components/index_footer/index_footer";
import publisher from "../../utility/services/publisher";
import events from "../../utility/constants/events";
import appState from "../../utility/app_state";

class Index extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    componentWillMount() {
        this.authenticationListener = publisher.subscribeToEvent(events.AUTHENTICATION_ERROR, this.onAuthenticationError.bind(this))
        this.authorizationListener = publisher.subscribeToEvent(events.AUTHORIZATION_ERROR, this.onAuthorizationError.bind(this))
        this.userUpdatedListener = publisher.subscribeToEvent(events.USER_UPDATED, this.onUserUpdated.bind(this))
        this.displayMessageListener = publisher.subscribeToEvent(events.DISPLAY_MESSAGE, this.onDisplayMessage.bind(this))
    }

    componentWillUnmount() {
        publisher.removeGivenListener(this.authenticationListener);
        publisher.removeGivenListener(this.authorizationListener);
        publisher.removeGivenListener(this.userUpdatedListener);
        publisher.removeGivenListener(this.displayMessageListener);
        clearTimeout(this.closeDisplayMessageTimeout);
    }

    onAuthenticationError() {
        let {router} = this.context;
        router.push("/login");
    }

    onUserUpdated(user) {
        appState.setUser(user).then(() => {
            this.onDisplayMessage({header: "Profile updated"});
        });
    }

    onDisplayMessage(displayMessageObject) {
        clearTimeout(this.closeDisplayMessageTimeout);
        this.setState({displayMessageObject});
        this.closeDisplayMessageTimeout = setTimeout(() => this.setState({displayMessageObject: undefined}), 1000);
    }

    onAuthorizationError() {
        this.setState({showAuthorizationErrorModal: true});
    }

    closeAuthorizationModalDialog() {
        this.setState({showAuthorizationErrorModal: false});
        let {router} = this.context;
        router.push("/");
    }

    closeDisplayMessage() {
        clearTimeout(this.closeDisplayMessageTimeout);
        this.setState({displayMessageObject: undefined});
    }

    renderDisplayMessageModal(displayMessageObject = {}) {
        let {header, body} = displayMessageObject;
        let view = null;
        if (header || body) {
            view = <Modal show onHide={this.closeDisplayMessage.bind(this)}>
                {header && <Modal.Header closeButton>{header}</Modal.Header>}
                {body && <Modal.Body>{body}</Modal.Body>}
            </Modal>
        }
        return view;
    }

    render() {
        let {children} = this.props;
        let {showAuthorizationErrorModal, displayMessageObject} = this.state;
        return <div>
            <IndexNavbar/>
            <div className="container" style={{marginTop: "71px"}}>
                <Modal show={showAuthorizationErrorModal} onHide={this.closeAuthorizationModalDialog.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>You shouldn't be here</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You don't have the right to access this page</Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.closeAuthorizationModalDialog.bind(this)}>Return to safe
                            zone</Button>
                    </Modal.Footer>;
                </Modal>
                {this.renderDisplayMessageModal(displayMessageObject)}
                {!showAuthorizationErrorModal && children}
            </div>
            <div className="beforeFooter"></div>
            <IndexFooter/>
        </div>;
    }
}

Index.contextTypes = {
    router: PropTypes.object
};

export default Index;
