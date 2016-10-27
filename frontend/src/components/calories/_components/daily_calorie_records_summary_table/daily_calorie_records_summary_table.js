import moment from "moment";
import React, {PropTypes} from "react";
import {Col, Row, Table} from "react-bootstrap";
import {CTAlert} from "../../../../utility/components/_ct_components";

class DailyCalorieRecordsSummaryTable extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }

    render() {
        let {dailyCalorieRecordSummaries = [], goalCalories = 0} = this.props;
        return <Row>
            <Col xs={12}>
                <CTAlert show={dailyCalorieRecordSummaries.length === 0}>There isn't any record to display</CTAlert>
                {dailyCalorieRecordSummaries.length > 0 && <Table bordered responsive>
                    <thead>
                    <tr>
                        <td colSpan="2"><h3>{"Daily Goal " + goalCalories}</h3></td>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Total Calories</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dailyCalorieRecordSummaries.map((summaryRecord, index) => {
                        let goalAchieved = (summaryRecord.totalAmount || 0) >= goalCalories;
                        return <tr key={index} className={goalAchieved ? "success" : "danger"}>
                            <td>{moment(summaryRecord.date).format("DD/MM/YYYY")}</td>
                            <td>{(summaryRecord.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                    })}
                    </tbody>
                </Table>}
            </Col>
        </Row>;
    }
}

DailyCalorieRecordsSummaryTable.propTypes = {
    goalCalories: PropTypes.number.isRequired,
    dailyCalorieRecordSummaries: PropTypes.array.isRequired
};

export default DailyCalorieRecordsSummaryTable;