import _ from "lodash";
import moment from "moment";
import React, {PropTypes} from "react";
import {Button, Col, Modal, Row, Table} from "react-bootstrap";
import {CTConfirmModal} from "../../../utility/components/_ct_components";
import CalorieRecordFrom from "../_components/calorie_record_form/calorie_record_form";
import calorieRecordsService from "../_services/calorie_records_service";

class SearchCalories extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {calorieRecords: []};
    }

    componentWillMount() {
        this.retrieveCalorieRecords().then((results = {records: [], count: 0}) => this.setState({
            calorieRecords: results.records,
            totalCount: results.count,
            loaded: true
        })).catch(error => this.setState({error, loaded: true}));
    }

    retrieveCalorieRecords() {
        return calorieRecordsService.retrieveCalorieRecords();
    }

    selectCalorieRecordToBeUpdated(calorieRecord) {
        this.setState({calorieRecordToBeUpdated: _.clone(calorieRecord)});
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
        let {_id, description, calorieAmount, createdAt} = calorieRecord;
        return <tr key={_id}>
            <td>{description}</td>
            <td>{calorieAmount}</td>
            <td>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</td>
            <td><Button bsStyle="info"
                        onClick={this.selectCalorieRecordToBeUpdated.bind(this, calorieRecord)}>Update</Button></td>
            <td><Button bsStyle="primary"
                        onClick={() => this.setState({calorieRecordToBeDeleted: calorieRecord})}>Delete</Button></td>
        </tr>
    }

    onCancelUpdate() {
        this.setState({calorieRecordToBeUpdated: undefined});
    }


    renderCalorieUpdateModal(calorieRecordToBeUpdated) {
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
                            <CalorieRecordFrom calorieRecord={calorieRecordToBeUpdated}
                                               onCancel={onCancelUpdate}
                                               onSave={this.updateCalorieRecord.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    renderCalorieUpdateModal(calorieRecordToBeUpdated) {
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
                            <CalorieRecordFrom calorieRecord={calorieRecordToBeUpdated}
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

    renderNewCalorieRecordModal(showNewCalorieRecordModal) {
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
                            <CalorieRecordFrom onCancel={onCancelNewRecord}
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
        let {calorieRecords = [], calorieRecordToBeUpdated, calorieRecordToBeDeleted, loaded, showNewCalorieRecordModal} = this.state;
        let cancelDeletionOfCaleryRecord = this.cancelDeletionOfCaleryRecord.bind(this);
        return <div>
            {loaded && calorieRecords.length === 0 && <div>no items</div>}
            <Row className="margin-bottom-20 margin-top-20">
                <Col xs={12}>
                    <Button bsStyle="primary" onClick={() => this.setState({showNewCalorieRecordModal: true})}>Add new
                        record</Button>
                </Col>
            </Row>
            <CTConfirmModal show={!!calorieRecordToBeDeleted}
                            onCancel={cancelDeletionOfCaleryRecord}
                            onConfirm={this.deleteRecord.bind(this, calorieRecordToBeDeleted)}
                            onHide={cancelDeletionOfCaleryRecord}>
                Do you confirm deleting this record?
            </CTConfirmModal>
            {this.renderNewCalorieRecordModal(showNewCalorieRecordModal)}
            {this.renderCalorieUpdateModal(calorieRecordToBeUpdated)}
            {loaded && calorieRecords.length > 0 && <Table>
                <thead>
                <tr>
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
        </div>;
    }
}

SearchCalories.contextTypes = {
    router: PropTypes.object
};

export default SearchCalories;
