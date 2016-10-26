import _ from "lodash";
import moment from "moment";
import Loader from "react-loader";
import React, {PropTypes} from "react";
import {Button, Col, Glyphicon, Modal, Panel, Row, Table} from "react-bootstrap";
import {MultiMonthView} from "react-date-picker";
import {CTAlert, CTConfirmModal, CTError, CTTimeSlider} from "../../../utility/components/_ct_components";
import CalorieRecordForm from "../_components/calorie_record_form/calorie_record_form";
import SelectUser from "../../users/_components/select_user/select_user";
import calorieRecordsService from "../_services/calorie_records_service";
import usersService from "../../users/_services/users_service";
import userRoleService from "../../users/_services/user_role_service";
import appState from "../../../utility/app_state";

const MIN_TIME = 0;
const MAX_TIME = 60 * 24;


class SearchCalories extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {calorieRecords: [], filters: {startDate: new Date(), endDate: new Date()}};
        this.hasAdminRole = userRoleService.hasAdminRole(appState.getUser());
        this.retrieveCalorieRecords = this.hasAdminRole ? calorieRecordsService.retrieveCalorieRecords : calorieRecordsService.retrieveCalorieRecordsOfCurrentUser;
    }

    componentWillMount() {
        let {filters = {}} = this.state;
        this.retrieveCalorieRecords(filters).then((results = {records: [], count: 0}) => this.setState({
            calorieRecords: results.records,
            totalCount: results.count,
            loaded: true
        })).catch(error => this.setState({error, loaded: true}));
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimeout);
    }

    selectCalorieRecordToBeUpdated(calorieRecord) {
        this.setState({calorieRecordToBeUpdated: _.clone(calorieRecord), updateError: undefined});
    }

    updateCalorieRecord(calorieRecord) {
        this.setState({isUpdating: true});
        calorieRecordsService.updateCalorieRecord(calorieRecord).then(() => this.retrieveCalorieRecords(this.state.filters))
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
        let {_id, description, calorieAmount, recordDate, recordOwner = {}} = calorieRecord;
        return <tr key={_id}>
            {this.hasAdminRole && <td>{usersService.toFullNameWithUsername(recordOwner)}</td>}
            <td>{description}</td>
            <td>{calorieAmount}</td>
            <td>{moment(recordDate).format("DD/MM/YYYY HH:mm")}</td>
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
                            <CalorieRecordForm calorieRecord={calorieRecordToBeUpdated}
                                               adminMode={this.hasAdminRole}
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
            .then(() => this.retrieveCalorieRecords(this.state.filters))
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
                            <CalorieRecordForm disabled={isAdding}
                                               adminMode={this.hasAdminRole}
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
        calorieRecordsService.deleteCaloryRecord(calorieRecordToBeDeleted._id).then(() => this.retrieveCalorieRecords(this.state.filters)).then((results) => {
            this.setState({
                calorieRecords: results.records,
                totalCount: results.count,
                deleteError: undefined,
                isDeleting: false,
                calorieRecordToBeDeleted: undefined
            });
        }).catch(deleteError => this.setState({deleteError, isDeleting: false}));
    }

    rangeChanged(rangeArrayAsString, rangeArrayAsObject) {
        let {filters = {}} = this.state;
        filters.startDate = rangeArrayAsObject[0] ? rangeArrayAsObject[0].dateMoment.toDate() : undefined;
        filters.endDate = rangeArrayAsObject[1] ? rangeArrayAsObject[1].dateMoment.toDate() : undefined;
        if (filters.endDate) {
            this.search(filters);
        } else {
            this.setState({filters});
        }
    }

    onUserSelected(recordOwnerId) {
        let {filters = {}} = this.state;
        filters.recordOwnerId = recordOwnerId;
        this.search(filters);
    }

    onTimeFilterChanged(startTime, endTime){
        let {filters = {}} = this.state;
        filters.startMinutes = startTime;
        filters.endMinutes = endTime;
        this.search(filters);
    }

    search(filters) {
        this.searchTimeout = setTimeout(() => this.setState({isSearching: true}), 500); //if search does not finish in given period, show an indicator
        this.retrieveCalorieRecords(filters).then((results = {records: [], count: 0}) => {
            clearTimeout(this.searchTimeout);
            this.setState({
                calorieRecords: results.records,
                totalCount: results.count,
                isSearching: false,
                filters
            })
        }).catch(error => this.setState({error, isSearching: false}));
    }

    render() {
        let {calorieRecords = [], calorieRecordToBeUpdated, calorieRecordToBeDeleted, loaded, showFilters, showNewCalorieRecordModal, isUpdating, isAdding, isDeleting} = this.state;
        let {error, deleteError, addError, updateError, filters = {}, isSearching} = this.state;
        let cancelDeletionOfCaleryRecord = this.cancelDeletionOfCaleryRecord.bind(this);
        const now = new Date();
        return <div>
            <CTError error={error}/>
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
                <Panel bsStyle="primary" header={<Row>
                    <Col xs={12}>
                        <Button className="margin-right-10"
                                onClick={() => this.setState({addError: undefined, showNewCalorieRecordModal: true})}>
                            Add new record&nbsp;<Glyphicon glyph="plus"/>
                        </Button>
                        <Button className="margin-right-10" onClick={() => this.setState({showFilters: !showFilters})}>
                            {showFilters ? "Hide Filters" : "Show Filters"}
                            &nbsp;<Glyphicon glyph="filter"/>
                        </Button>
                        {showFilters && <Button onClick={this.search.bind(this, filters)}>Search&nbsp;<Glyphicon
                            glyph="search"/></Button>}
                        {isSearching && <img width={35} className="margin-left-10"
                                             src={require("../../../assets/images/loading.gif")}/>}
                    </Col>
                </Row>}>
                    {showFilters && <Row>
                        <Col xs={12}>
                            {this.hasAdminRole && <Row className="margin-bottom-20">
                                <Col xs={12} sm={12} md={3}>
                                    <SelectUser
                                        autoBlur
                                        autoload={false}
                                        onSelect={this.onUserSelected.bind(this)}
                                        placeholder="Search for user"
                                        value={filters.recordOwnerId}/>
                                </Col>
                            </Row>}
                            <Row className="margin-bottom-20">
                                <Col xs={12}>
                                    <MultiMonthView weekNumbers={true}
                                                    defaultRange={[filters.startDate || now, filters.endDate || now]}
                                                    highlightRangeOnMouseMove
                                                    onRangeChange={this.rangeChanged.bind(this)}/>
                                </Col>
                            </Row>
                            <Row className="margin-bottom-20">
                                <Col xs={12} md={3}>
                                    <div className="margin-bottom-10">Time Filter</div>
                                    <CTTimeSlider onTimeChanged={this.onTimeFilterChanged.bind(this)}/>
                                </Col>
                            </Row>
                        </Col>
                    </Row>}
                </Panel>
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
        </div>
            ;
    }
}

SearchCalories.contextTypes = {
    router: PropTypes.object
};

export default SearchCalories;
