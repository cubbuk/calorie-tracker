import Loader from "react-loader";
import React, {PropTypes} from "react";
import {Col, Row} from "react-bootstrap";
import {CTError} from "../../../utility/components/_ct_components";
import UserProfileForm from "./_components/user_profile_form/user_profile_form";
import usersService from "../_services/users_service";
import events from "../../../utility/constants/events";
import publisher from "../../../utility/services/publisher";

class UserProfile extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    componentWillMount() {
        usersService.profileInfo()
            .then(profileInfo => this.setState({profileInfo, loaded: true}))
            .catch(error => this.setState({error, loaded: true}));
    }

    onSave(profileInfo) {
        this.setState({isUpdating: true});
        usersService.updateProfileInfo(profileInfo)
            .then((user) => {
                publisher.emitEvent(events.USER_UPDATED, user);
                this.goToMainPage();
            })
            .catch(error => this.setState({error, isUpdating: false}));
    }

    goToMainPage() {
        let {router} = this.context;
        router.push("/");
    }

    render() {
        let {error, loaded, profileInfo = {}, isUpdating} = this.state;
        return <Row>
            <Col xs={12} sm={6} smOffset={3}>
                <Row>
                    <Col xs={12}>
                        <h4 className="text-center">User Profile</h4>
                    </Col>
                    <Col xs={12}>
                        <CTError error={error}/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Loader loaded={loaded}>
                            <UserProfileForm disabled={isUpdating}
                                             profileInfo={profileInfo}
                                             onSave={this.onSave.bind(this)}
                                             onCancel={this.goToMainPage.bind(this)}/>
                        </Loader>
                    </Col>
                </Row>
            </Col>
        </Row>;
    }
}

UserProfile.contextTypes = {
    router: PropTypes.object
};

export default UserProfile;