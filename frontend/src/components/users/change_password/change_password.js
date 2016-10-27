import React, {PropTypes} from "react";
import {Col, PageHeader, Row} from "react-bootstrap";
import {CTError} from "../../../utility/components/_ct_components";
import ChangePasswordForm from "./_components/change_password_form/change_password_form";
import usersService from "../_services/users_service";
import events from "../../../utility/constants/events";
import publisher from "../../../utility/services/publisher";

class ChangePassword extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    onSubmit(passwordInfo = {}){
        let {currentPassword, newPassword} = passwordInfo;
        this.setState({isUpdating: true});
        usersService.changePassword(currentPassword, newPassword)
            .then(() => {
                publisher.emitEvent(events.DISPLAY_MESSAGE, {body: "Your password has changed"});
                this.goToMainPage();
            })
            .catch(error => this.setState({error, isUpdating: false}));

    }

    goToMainPage() {
        let {router} = this.context;
        router.push("/");
    }

    render() {
        let {error, isUpdating} = this.state;
        return <Row>
            <Col xs={12} sm={6} smOffset={3}>
                <Row>
                    <Col xs={12}>
                        <PageHeader>Change Password</PageHeader>
                    </Col>
                    <Col xs={12}>
                        <CTError error={error}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ChangePasswordForm onSubmit={this.onSubmit.bind(this)} onCancel={this.goToMainPage.bind(this)} disabled={isUpdating}/>
                    </Col>
                </Row>
            </Col>
        </Row>;
    }
}

ChangePassword.contextTypes = {
    router: PropTypes.object
};

export default ChangePassword;