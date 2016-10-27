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
    }

    componentWillUnmount() {
        publisher.removeGivenListener(this.authenticationListener);
        publisher.removeGivenListener(this.authorizationListener);
        publisher.removeGivenListener(this.userUpdatedListener);
        clearTimeout(this.closeProfileUpdateTimeout);
    }

    onAuthenticationError() {
        let {router} = this.context;
        router.push("/login");
    }

    onUserUpdated(user) {
        clearTimeout(this.closeProfileUpdateTimeout);
        appState.setUser(user).then(() => {
            this.setState({showProfileUpdatedModal: true})
            this.closeProfileUpdateTimeout = setTimeout(() => this.setState({showProfileUpdatedModal: false}), 1000);
        });
    }

    onAuthorizationError() {
        this.setState({showAuthorizationErrorModal: true});
    }

    closeAuthorizationModalDialog() {
        this.setState({showAuthorizationErrorModal: false});
        let {router} = this.context;
        router.push("/");
    }

    closeProfileUpdateModal() {
        clearTimeout(this.closeProfileUpdateTimeout);
        this.setState({showProfileUpdatedModal: false});
    }

    render() {
        let {children} = this.props;
        let {showAuthorizationErrorModal, showProfileUpdatedModal} = this.state;
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
                <Modal show={showProfileUpdatedModal} onHide={this.closeProfileUpdateModal.bind(this)}>
                    <Modal.Body>Your profile is updated</Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.closeProfileUpdateModal.bind(this)}>Ok</Button>
                    </Modal.Footer>;
                </Modal>
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
