import Promise from "bluebird";
import moment from "moment";
import React, {PropTypes} from "react";
import {Button, Col, Row, Table} from "react-bootstrap";

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
            return [{_id: 1, text: "Orange", calories: 120, createdAt: new Date()},
                {
                    _id: 2,
                    text: "Apple",
                    calories: 90,
                    createdAt: new Date()
                },
                {_id: 3, text: "Bread", calories: 250, createdAt: new Date()}];
        })
    }

    renderCaloryRecord(caloryRecord = {}) {
        let {_id, text, calories, createdAt} = caloryRecord;
        return <tr key={_id}>
            <td>{text}</td>
            <td>{calories}</td>
            <td>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</td>
            <td><Button bsStyle="info">Edit</Button></td>
            <td><Button bsStyle="primary">Delete</Button></td>
        </tr>
    }

    render() {
        let {caloryRecords = [], loaded} = this.state;
        return <div>
            {loaded && caloryRecords.length === 0 && <div>no items</div>}
            <Row>
                <Col xs={12}>
                    <Button bsStyle="primary">Add new record</Button>
                </Col>
            </Row>
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
