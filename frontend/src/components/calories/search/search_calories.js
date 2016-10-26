import _ from "lodash";
import moment from "moment";
import Loader from "react-loader";
import React, {PropTypes} from "react";
import {Button, Col, Modal, Row, Table} from "react-bootstrap";
import {CTAlert, CTConfirmModal, CTError} from "../../../utility/components/_ct_components";
import CalorieRecordFrom from "../_components/calorie_record_form/calorie_record_form";
import calorieRecordsService from "../_services/calorie_records_service";
import usersService from "../../users/_services/users_service";
import userRoleService from "../../users/_services/user_role_service";
import appState from "../../../utility/app_state";

class SearchCalories extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {calorieRecords: []};
        this.hasAdminRole = userRoleService.hasAdminRole(appState.getUser());
        this.retrieveCalorieRecords = this.hasAdminRole ? calorieRecordsService.retrieveCalorieRecords : calorieRecordsService.retrieveCalorieRecordsOfCurrentUser;
    }

    componentWillMount() {
        this.retrieveCalorieRecords().then((results = {records: [], count: 0}) => this.setState({
            calorieRecords: results.records,
            totalCount: results.count,
            loaded: true
        })).catch(error => this.setState({error, loaded: true}));
    }

    selectCalorieRecordToBeUpdated(calorieRecord) {
        this.setState({calorieRecordToBeUpdated: _.clone(calorieRecord), updateError: undefined});
    }

    updateCalorieRecord(calorieRecord) {
        this.setState({isUpdating: true});
        calorieRecordsService.updateCalorieRecord(calorieRecord).then(() => this.retrieveCalorieRecords())
            .then(results => {
                this.setState({
                    calorieRecords: results.records,
                    totalCount: results.count,
                    updateError: undefined,
                    isUpdating: false,
                    calorieRecordToBeUpdated: undefined
                });
            }).catch(updateError => this.setState({updateError, isUpdating: false}));
    }

    renderCalorieRecord(calorieRecord = {}) {
        let {_id, description, calorieAmount, createdAt, createdByUser = {}} = calorieRecord;
        return <tr key={_id}>
            {this.hasAdminRole && <td>{usersService.toFullNameWithUsername(createdByUser)}</td>}
            <td>{description}</td>
            <td>{calorieAmount}</td>
            <td>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</td>
            <td><Button bsStyle="info"
                        onClick={this.selectCalorieRecordToBeUpdated.bind(this, calorieRecord)}>Update</Button></td>
            <td><Button bsStyle="primary"
                        onClick={() => this.setState({
                            calorieRecordToBeDeleted: calorieRecord,
                            deleteError: undefined
                        })}>Delete</Button></td>
        </tr>
    }

    onCancelUpdate() {
        this.setState({calorieRecordToBeUpdated: undefined});
    }

    renderCalorieUpdateModal(calorieRecordToBeUpdated, isUpdating, updateError) {
        let view = null;
        if (calorieRecordToBeUpdated) {
            let onCancelUpdate = this.onCancelUpdate.bind(this);
            view = <Modal show onHide={onCancelUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Calorie Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <Loader loaded={!isUpdating}/>
                            <CTError error={updateError}/>
                            <CalorieRecordFrom calorieRecord={calorieRecordToBeUpdated}
                                               disabled={isUpdating}
                                               onCancel={onCancelUpdate}
                                               onSave={this.updateCalorieRecord.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    onCancelNewRecord() {
        this.setState({showNewCalorieRecordModal: false});
    }

    addNewCalorieRecord(newCalorieRecord) {
        this.setState({isAdding: true});
        calorieRecordsService.addNewCalorieRecord(newCalorieRecord)
            .then(() => this.retrieveCalorieRecords())
            .then((results) => {
                this.setState({
                    calorieRecords: results.records,
                    totalCount: results.count,
                    addError: undefined,
                    isAdding: false,
                    showNewCalorieRecordModal: false
                });
            }).catch(addError => this.setState({addError, isAdding: false}));
    }

    renderNewCalorieRecordModal(showNewCalorieRecordModal, isAdding, addError) {
        let view = null;
        if (showNewCalorieRecordModal) {
            let onCancelNewRecord = this.onCancelNewRecord.bind(this);
            view = <Modal show onHide={onCancelNewRecord}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Calorie Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <Loader loaded={!isAdding}/>
                            <CTError error={addError}/>
                            <CalorieRecordFrom disabled={isAdding}
                                               onCancel={onCancelNewRecord}
                                               onSave={this.addNewCalorieRecord.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    cancelDeletionOfCaleryRecord() {
        this.setState({calorieRecordToBeDeleted: undefined});
    }

    deleteRecord(calorieRecordToBeDeleted) {
        this.setState({isDeleting: true});
        calorieRecordsService.deleteCaloryRecord(calorieRecordToBeDeleted._id).then(() => this.retrieveCalorieRecords()).then((results) => {
            this.setState({
                calorieRecords: results.records,
                totalCount: results.count,
                deleteError: undefined,
                isDeleting: false,
                calorieRecordToBeDeleted: undefined
            });
        }).catch(deleteError => this.setState({deleteError, isDeleting: false}));
    }

    render() {
        let {calorieRecords = [], calorieRecordToBeUpdated, calorieRecordToBeDeleted, loaded, showNewCalorieRecordModal, isUpdating, isAdding, isDeleting} = this.state;
        let {error, deleteError, addError, updateError} = this.state;
        let cancelDeletionOfCaleryRecord = this.cancelDeletionOfCaleryRecord.bind(this);
        return <div>
            <CTError error={error}/>
            <Row className="margin-bottom-20 margin-top-20">
                <Col xs={12}>
                    <Button bsStyle="primary"
                            onClick={() => this.setState({addError: undefined, showNewCalorieRecordModal: true})}>Add
                        new
                        record</Button>
                </Col>
            </Row>
            <CTConfirmModal disabled={isDeleting}
                            show={!!calorieRecordToBeDeleted}
                            onCancel={cancelDeletionOfCaleryRecord}
                            onConfirm={this.deleteRecord.bind(this, calorieRecordToBeDeleted)}
                            onHide={cancelDeletionOfCaleryRecord}>
                <Loader loaded={!isDeleting}/>
                <CTError error={deleteError}/>
                Do you confirm deleting this record?
            </CTConfirmModal>
            <Loader loaded={loaded}>
                {this.renderNewCalorieRecordModal(showNewCalorieRecordModal, isAdding, addError)}
                {this.renderCalorieUpdateModal(calorieRecordToBeUpdated, isUpdating, updateError)}
                <CTAlert show={calorieRecords.length === 0}>
                    There isn't any record.
                </CTAlert>
                {calorieRecords.length > 0 && <Table bordered responsive>
                    <thead>
                    <tr>
                        {this.hasAdminRole && <th>User</th>}
                        <th>Description</th>
                        <th>Calories</th>
                        <th>Date</th>
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {calorieRecords.map(this.renderCalorieRecord.bind(this))}
                    </tbody>
                </Table>}
            </Loader>
        </div>;
    }
}

SearchCalories.contextTypes = {
    router: PropTypes.object
};

export default SearchCalories;
