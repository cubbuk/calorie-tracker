import React, {PropTypes} from "react";
import {Col, PageHeader, Row} from "react-bootstrap";
import {CTError, CTFormInput} from "utility/components/_ct_components";

class WelcomeContainer extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        let {location = {}} = props;
        let {query = {}} = location;
        let {username} = query;
        this.state = {signupInfo: {username}};
    }

    render() {
        let {children} = this.props;
        return <div>
            <Row>
                <Col xs={12}>
                    <PageHeader>Welcome to Calories Tracker</PageHeader>
                </Col>
                {children}
            </Row>
        </div>
    }
}

export default WelcomeContainer;