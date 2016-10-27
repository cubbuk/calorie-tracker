import moment from "moment";
import React, {PropTypes} from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import {CTAlert} from "../../../../utility/components/_ct_components";
import UserRoleLabels from "../user_role_labels/user_role_labels";

class CalorieRecordsTable extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }

    onUpdateClicked(calorieRecord) {
        if (this.props.onUpdateClicked instanceof Function) {
            this.props.onUpdateClicked(calorieRecord);
        }
    }

    onDeleteClicked(calorieRecord) {
        if (this.props.onDeleteClicked instanceof Function) {
            this.props.onDeleteClicked(calorieRecord);
        }
    }

    renderCalorieRecord(calorieRecord = {}) {
        let {adminView} = this.props;
        let {_id, description, calorieAmount, recordDate, recordOwner = {}} = calorieRecord;
        return <tr key={_id}>
            {adminView && <td>
                <div>{recordOwner.fullName}</div>
                <div>
                    <small className="text-muted">{recordOwner.username}</small>
                </div>
                <div><UserRoleLabels roles={recordOwner.roles || []}/></div>
            </td>}
            <td>{description}</td>
            <td>{calorieAmount}</td>
            <td>{moment(recordDate).format("DD/MM/YYYY HH:mm")}</td>
            <td><Button bsStyle="info"
                        onClick={this.onUpdateClicked.bind(this, calorieRecord)}>Update</Button></td>
            <td><Button bsStyle="primary"
                        onClick={this.onDeleteClicked.bind(this, calorieRecord)}>Delete</Button></td>
        </tr>
    }

    render() {
        let {calorieRecords = [], adminView} = this.props;
        return <Row>
            <Col xs={12}>
                <CTAlert show={calorieRecords.length === 0}>
                    There isn't any record.
                </CTAlert>
                {calorieRecords.length > 0 && <Table bordered responsive>
                    <thead>
                    <tr>
                        {adminView && <th>User</th>}
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
            </Col>
        </Row>;
    }
}

CalorieRecordsTable.propTypes = {
    calorieRecords: PropTypes.array.isRequired,
    adminView: PropTypes.bool,
    onUpdateClicked: PropTypes.func,
    onDeleteClicked: PropTypes.func
};

export default CalorieRecordsTable;