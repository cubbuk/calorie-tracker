import _ from "lodash";
import Promise from "bluebird";
import moment from "moment";
import React, {PropTypes} from "react";
import {Button, Col, Modal, Row, Table} from "react-bootstrap";
import {CTConfirmModal} from "../../../utility/components/_ct_components";
import CaloryRecordFrom from "../_components/calory_record_form/calory_record_form";

class SearchCalories extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {caloryRecords: []};
    }

    componentWillMount() {
        this.retrieveCaloryRecords().then((caloryRecords) => this.setState({
            caloryRecords,
            loaded: true
        })).catch(error => this.setState({error, loaded: true}));
    }

    retrieveCaloryRecords() {
        return Promise.try(() => {
            return [{_id: 1, description: "Orange", caloryAmount: 120, createdAt: new Date()},
                {
                    _id: 2,
                    description: "Apple",
                    caloryAmount: 90,
                    createdAt: new Date()
                },
                {_id: 3, description: "Bread", caloryAmount: 250, createdAt: new Date()}];
        })
    }

    selectCaloryRecordToBeUpdated(caloryRecord) {
        this.setState({caloryRecordToBeUpdated: _.clone(caloryRecord)});
    }

    updateCaloryRecord(caloryRecord) {
        let {caloryRecords = []} = this.state;
        let indexOfRecord = _.findIndex(caloryRecords, (existingRecord) => existingRecord._id === caloryRecord._id);
        let newState = {caloryRecordToBeUpdated: undefined};
        if (indexOfRecord > -1) {
            caloryRecords[indexOfRecord] = caloryRecord;
            newState.caloryRecords = caloryRecords;
        }
        this.setState(newState);
    }

    renderCaloryRecord(caloryRecord = {}) {
        let {_id, description, caloryAmount, createdAt} = caloryRecord;
        return <tr key={_id}>
            <td>{description}</td>
            <td>{caloryAmount}</td>
            <td>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</td>
            <td><Button bsStyle="info"
                        onClick={this.selectCaloryRecordToBeUpdated.bind(this, caloryRecord)}>Update</Button></td>
            <td><Button bsStyle="primary"
                        onClick={() => this.setState({caloryRecordToBeDeleted: caloryRecord})}>Delete</Button></td>
        </tr>
    }

    onCancelUpdate() {
        this.setState({caloryRecordToBeUpdated: undefined});
    }


    renderCaloryUpdateModal(caloryRecordToBeUpdated) {
        let view = null;
        if (caloryRecordToBeUpdated) {
            let onCancelUpdate = this.onCancelUpdate.bind(this);
            view = <Modal show onHide={onCancelUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Calory Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <CaloryRecordFrom caloryRecord={caloryRecordToBeUpdated}
                                              onCancel={onCancelUpdate}
                                              onSave={this.updateCaloryRecord.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    renderCaloryUpdateModal(caloryRecordToBeUpdated) {
        let view = null;
        if (caloryRecordToBeUpdated) {
            let onCancelUpdate = this.onCancelUpdate.bind(this);
            view = <Modal show onHide={onCancelUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Calory Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <CaloryRecordFrom caloryRecord={caloryRecordToBeUpdated}
                                              onCancel={onCancelUpdate}
                                              onSave={this.updateCaloryRecord.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    onCancelNewRecord() {
        this.setState({showNewCaloryRecordModal: false});
    }

    addNewCaloryRecord(newCaloryRecord) {
        let {caloryRecords = []} = this.state;
        caloryRecords.push(newCaloryRecord);
        this.setState({caloryRecords, showNewCaloryRecordModal: false});
    }

    renderNewCaloryRecordModal(showNewCaloryRecordModal) {
        let view = null;
        if (showNewCaloryRecordModal) {
            let onCancelNewRecord = this.onCancelNewRecord.bind(this);
            view = <Modal show onHide={onCancelNewRecord}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Calory Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12}>
                            <CaloryRecordFrom onCancel={onCancelNewRecord}
                                              onSave={this.addNewCaloryRecord.bind(this)}/>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    cancelDeletionOfCaleryRecord() {
        this.setState({caloryRecordToBeDeleted: undefined});
    }

    deleteRecord(caloryRecordToBeDeleted) {
        let {caloryRecords = []} = this.state;
        caloryRecords = caloryRecords.filter(existingRecord => existingRecord._id !== caloryRecordToBeDeleted._id);
        this.setState({caloryRecords, caloryRecordToBeDeleted: undefined});
    }

    render() {
        let {caloryRecords = [], caloryRecordToBeUpdated, caloryRecordToBeDeleted, loaded, showNewCaloryRecordModal} = this.state;
        let cancelDeletionOfCaleryRecord = this.cancelDeletionOfCaleryRecord.bind(this);
        return <div>
            {loaded && caloryRecords.length === 0 && <div>no items</div>}
            <Row className="margin-bottom-20 margin-top-20">
                <Col xs={12}>
                    <Button bsStyle="primary" onClick={() => this.setState({showNewCaloryRecordModal: true})}>Add new
                        record</Button>
                </Col>
            </Row>
            <CTConfirmModal show={!!caloryRecordToBeDeleted}
                            onCancel={cancelDeletionOfCaleryRecord}
                            onConfirm={this.deleteRecord.bind(this, caloryRecordToBeDeleted)}
                            onHide={cancelDeletionOfCaleryRecord}>
                Do you confirm deleting this record?
            </CTConfirmModal>
            {this.renderNewCaloryRecordModal(showNewCaloryRecordModal)}
            {this.renderCaloryUpdateModal(caloryRecordToBeUpdated)}
            {loaded && caloryRecords.length > 0 && <Table>
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
                {caloryRecords.map(this.renderCaloryRecord.bind(this))}
                </tbody>
            </Table>}
        </div>;
    }
}

SearchCalories.contextTypes = {
    router: PropTypes.object
};

export default SearchCalories;
