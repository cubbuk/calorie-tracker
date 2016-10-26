import _ from "lodash";
import moment from "moment";
import Loader from "react-loader";
import React, {PropTypes} from "react";
import {Button, Col, Modal, Row, Table} from "react-bootstrap";
import {CTAlert, CTConfirmModal, CTError} from "../../../utility/components/_ct_components";
import UserForm from "../_components/user_form/user_form";
import usersService from "../_services/users_service";

class SearchUsers extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {users: []};
    }

    componentWillMount() {
        usersService.retrieveUsers().then((results = {records: [], count: 0}) => this.setState({
            users: results.records,
            totalCount: results.count,
            loaded: true
        })).catch(error => this.setState({error, loaded: true}));
    }

    selectUserToBeUpdated(user) {
        let userToBeUpdated = _.clone(user);
        delete userToBeUpdated.password;
        this.setState({userToBeUpdated, updateError: undefined});
    }

    updateUser(user) {
        this.setState({isUpdating: true});
        usersService.updateUser(user).then(() => usersService.retrieveUsers())
            .then(results => {
                this.setState({
                    users: results.records,
                    totalCount: results.count,
                    updateError: undefined,
                    isUpdating: false,
                    userToBeUpdated: undefined
                });
            }).catch(updateError => this.setState({updateError, isUpdating: false}));
    }

    renderUser(user = {}) {
        let {_id, username, fullName, caloriesPerDay = 0, createdAt} = user;
        return <tr key={_id}>
            <td>{username}</td>
            <td>{fullName}</td>
            <td>{caloriesPerDay}</td>
            <td>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</td>
            <td><Button bsStyle="info"
                        onClick={this.selectUserToBeUpdated.bind(this, user)}>Update</Button></td>
            <td><Button bsStyle="primary"
                        onClick={() => this.setState({userToBeDeleted: user, deleteError: undefined})}>Delete</Button>
            </td>
        </tr>
    }

    onCancelUpdate() {
        this.setState({userToBeUpdated: undefined});
    }

    renderUserUpdateModal(userToBeUpdated, isUpdating, updateError) {
        let view = null;
        if (userToBeUpdated) {
            let onCancelUpdate = this.onCancelUpdate.bind(this);
            view = <Modal show onHide={onCancelUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <Loader loaded={!isUpdating}/>
                            <CTError error={updateError}/>
                            <UserForm user={userToBeUpdated}
                                      isUpdate
                                      disabled={isUpdating}
                                      onCancel={onCancelUpdate}
                                      onSave={this.updateUser.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    onCancelNewUser() {
        this.setState({showNewUserModal: false});
    }

    addNewUser(newUser) {
        this.setState({isAdding: true});
        usersService.addNewUser(newUser)
            .then(() => usersService.retrieveUsers())
            .then((results) => {
                this.setState({
                    users: results.records,
                    totalCount: results.count,
                    addError: undefined,
                    isAdding: false,
                    showNewUserModal: false
                });
            }).catch(addError => this.setState({addError, isAdding: false}));
    }

    renderNewUserModal(showNewUserModal, isAdding, addError) {
        let view = null;
        if (showNewUserModal) {
            let onCancelNewUser = this.onCancelNewUser.bind(this);
            view = <Modal show onHide={onCancelNewUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <Loader loaded={!isAdding}/>
                            <CTError error={addError}/>
                            <UserForm disabled={isAdding}
                                      onCancel={onCancelNewUser}
                                      onSave={this.addNewUser.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    cancelDeletionOfUserRecord() {
        this.setState({userToBeDeleted: undefined});
    }

    deleteRecord(userToBeDeleted) {
        this.setState({isDeleting: true});
        usersService.deleteUser(userToBeDeleted._id).then(() => usersService.retrieveUsers()).then((results) => {
            this.setState({
                users: results.records,
                totalCount: results.count,
                deleteError: undefined,
                isDeleting: false,
                userToBeDeleted: undefined
            });
        }).catch(deleteError => this.setState({deleteError, isDeleting: false}));
    }

    render() {
        let {users = [], userToBeUpdated, userToBeDeleted, loaded, showNewUserModal, isUpdating, isAdding, isDeleting} = this.state;
        let {error, deleteError, addError, updateError} = this.state;
        let cancelDeletionOfUserRecord = this.cancelDeletionOfUserRecord.bind(this);
        return <div>
            <CTError error={error}/>
            <Row className="margin-bottom-20 margin-top-20">
                <Col xs={12}>
                    <Button bsStyle="primary"
                            onClick={() => this.setState({addError: undefined, showNewUserModal: true})}>Add new
                        user</Button>
                </Col>
            </Row>
            <CTConfirmModal disabled={isDeleting}
                            show={!!userToBeDeleted}
                            onCancel={cancelDeletionOfUserRecord}
                            onConfirm={this.deleteRecord.bind(this, userToBeDeleted)}
                            onHide={cancelDeletionOfUserRecord}>
                <Loader loaded={!isDeleting}/>
                <CTError error={deleteError}/>
                Do you confirm deleting this user?
            </CTConfirmModal>
            <Loader loaded={loaded}>
                {this.renderNewUserModal(showNewUserModal, isAdding, addError)}
                {this.renderUserUpdateModal(userToBeUpdated, isUpdating, updateError)}
                <CTAlert show={!error && users.length === 0}>
                    There isn't any user.
                </CTAlert>
                {users.length > 0 && <Table bordered responsive>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Full name</th>
                        <th>Calories Per Day</th>
                        <th>Created At</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(this.renderUser.bind(this))}
                    </tbody>
                </Table>}
            </Loader>
        </div>;
    }
}

SearchUsers.contextTypes = {
    router: PropTypes.object
};

export default SearchUsers;
