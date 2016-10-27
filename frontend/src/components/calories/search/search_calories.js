import _ from "lodash";
import moment from "moment";
import Loader from "react-loader";
import React, {PropTypes} from "react";
import {Button, Col, Glyphicon, Label, Modal, Panel, Row, Table} from "react-bootstrap";
import {MultiMonthView} from "react-date-picker";
import {CTAlert, CTConfirmModal, CTError, CTTimeSlider, CTPaginator} from "../../../utility/components/_ct_components";
import CalorieRecordForm from "../_components/calorie_record_form/calorie_record_form";
import SelectUser from "../../users/_components/select_user/select_user";
import UserRoleLabels from "../../users/_components/user_role_labels/user_role_labels";
import DailyCalorieRecordsSummaryTable from "../_components/daily_calorie_records_summary_table/daily_calorie_records_summary_table";
import calorieRecordsService from "../_services/calorie_records_service";
import usersService from "../../users/_services/users_service";
import userRoleService from "../../users/_services/user_role_service";
import appState from "../../../utility/app_state";
import {RESULTS_PER_PAGE} from "../../../utility/constants/ct_constants";

class SearchCalories extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {
            calorieRecords: [],
            searchParams: {startDate: new Date(), endDate: new Date()},
            pageNumber: 1
        };
        this.hasAdminRole = userRoleService.hasAdminRole(appState.getUser());
        this.retrieveCalorieRecords = this.hasAdminRole ? calorieRecordsService.retrieveCalorieRecords : calorieRecordsService.retrieveCalorieRecordsOfCurrentUser;
    }

    componentWillMount() {
        let {searchParams = {}, pageNumber = 1} = this.state;
        this.retrieveCalorieRecords({
            searchParams,
            pageNumber,
            resultsPerPage: RESULTS_PER_PAGE
        }).then((results = {records: [], count: 0}) => this.setState({
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
        let {searchParams = {}, pageNumber = 1} = this.state;
        calorieRecordsService.updateCalorieRecord(calorieRecord).then(() => this.retrieveCalorieRecords({
            searchParams,
            pageNumber,
            resultsPerPage: RESULTS_PER_PAGE
        })).then(results => {
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
            {this.hasAdminRole && <td>
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
        let {searchParams = {}, pageNumber = 1} = this.state;
        calorieRecordsService.addNewCalorieRecord(newCalorieRecord)
            .then(() => this.retrieveCalorieRecords({searchParams, pageNumber, resultsPerPage: RESULTS_PER_PAGE}))
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
        let {searchParams = {}, pageNumber = 1} = this.state;
        calorieRecordsService.deleteCaloryRecord(calorieRecordToBeDeleted._id)
            .then(() => this.retrieveCalorieRecords({
                searchParams,
                pageNumber,
                resultsPerPage: RESULTS_PER_PAGE
            }))
            .then((results) => {
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
        let {searchParams = {}} = this.state;
        searchParams.startDate = rangeArrayAsObject[0] ? rangeArrayAsObject[0].dateMoment.toDate() : undefined;
        searchParams.endDate = rangeArrayAsObject[1] ? rangeArrayAsObject[1].dateMoment.toDate() : undefined;
        if (searchParams.endDate) {
            this.search(searchParams, 1);
        } else {
            this.setState({searchParams});
        }
    }

    onUserSelected(recordOwnerId) {
        let {searchParams = {}} = this.state;
        searchParams.recordOwnerId = recordOwnerId;
        this.search(searchParams, 1);
    }

    onTimeFilterChanged(startTime, endTime) {
        let {searchParams = {}} = this.state;
        searchParams.startMinutes = startTime;
        searchParams.endMinutes = endTime;
        this.search(searchParams, 1);
    }

    search(searchParams, pageNumber = this.state.pageNumber) {
        this.searchTimeout = setTimeout(() => this.setState({isSearching: true}), 500); //if search does not finish in given period, show an indicator
        this.retrieveCalorieRecords({
            searchParams,
            pageNumber,
            resultsPerPage: RESULTS_PER_PAGE
        }).then((results = {records: [], count: 0}) => {
            clearTimeout(this.searchTimeout);
            this.setState({
                calorieRecords: results.records,
                totalCount: results.count,
                isSearching: false,
                searchParams,
                pageNumber
            })
        }).catch(error => {
            clearTimeout(this.searchTimeout);
            this.setState({error, isSearching: false})
        });
    }

    selectPage(pageNumber) {
        this.setState({pageNumber});
        let {searchParams = {}} = this.state;
        this.search(searchParams, pageNumber);
    }

    retrieveDailySummaries(searchParams = {}) {
        this.setState({preparingDailySummaries: true, showDailyCalorieRecordSummaries: true});
        usersService.dailyCalorieRecordSummaries(searchParams).then((dailyCalorieRecordSummaries) => {
            this.setState({dailyCalorieRecordSummaries, preparingDailySummaries: false})
        }).catch(dailySummaryRecordsError => this.setState({dailySummaryRecordsError, preparingDailySummaries: false}))
    }

    onCloseDailyCalorieRecordSummaries() {
        this.setState({showDailyCalorieRecordSummaries: false});
    }

    renderDailyCalorieRecordSummariesModal(showDailyCalorieRecordSummaries) {
        let view = null;
        if (showDailyCalorieRecordSummaries) {
            const onCloseDailyCalorieRecordSummaries = this.onCloseDailyCalorieRecordSummaries.bind(this);
            let {preparingDailySummaries, dailySummaryRecordsError, dailyCalorieRecordSummaries = []} = this.state;
            let user = appState.getUser();
            let {caloriesPerDay: goalCalories = 0} = user;
            view = <Modal show onHide={onCloseDailyCalorieRecordSummaries}>
                <Modal.Header closeButton>
                    <Modal.Title>Daily Calorie Record Summaries</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CTError error={dailySummaryRecordsError}/>
                    <Loader loaded={!preparingDailySummaries}>
                        <DailyCalorieRecordsSummaryTable goalCalories={goalCalories}
                                                         dailyCalorieRecordSummaries={dailyCalorieRecordSummaries}/>
                    </Loader>
                </Modal.Body>
            </Modal>
        }
        return view;
    }

    render() {
        let {calorieRecords = [], totalCount = calorieRecords.length, calorieRecordToBeUpdated, calorieRecordToBeDeleted, loaded, showsearchParams, showNewCalorieRecordModal, isUpdating, isAdding, isDeleting} = this.state;
        let {error, deleteError, addError, updateError, searchParams = {}, isSearching, pageNumber = 1, showDailyCalorieRecordSummaries} = this.state;
        let cancelDeletionOfCaleryRecord = this.cancelDeletionOfCaleryRecord.bind(this);
        const now = new Date();
        const paginatorComponent = <CTPaginator bsSize="medium"
                                                style={{marginTop: "0px"}}
                                                total={totalCount}
                                                activePage={pageNumber}
                                                resultsPerPage={RESULTS_PER_PAGE}
                                                onSelect={this.selectPage.bind(this)}/>;
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
                        <Button className="margin-right-10"
                                onClick={() => this.setState({showsearchParams: !showsearchParams})}>
                            {showsearchParams ? "Hide Filters" : "Show Filters"}
                            &nbsp;<Glyphicon glyph="filter"/>
                        </Button>
                        <Button className="margin-right-10"
                                disabled={calorieRecords.length === 0}
                                onClick={this.retrieveDailySummaries.bind(this, searchParams)}>
                            Daily Summaries&nbsp;<Glyphicon glyph="list"/>
                        </Button>
                        <Button onClick={this.search.bind(this, searchParams, pageNumber)}>Search&nbsp;<Glyphicon
                            glyph="search"/></Button>
                        {isSearching && <img width={35} className="margin-left-10"
                                             src={require("../../../assets/images/loading.gif")}/>}
                    </Col>
                </Row>}>
                    {showsearchParams && <Row>
                        <Col xs={12}>
                            {this.hasAdminRole && <Row className="margin-bottom-20">
                                <Col xs={12} sm={12} md={3}>
                                    <SelectUser
                                        autoBlur
                                        autoload={false}
                                        onSelect={this.onUserSelected.bind(this)}
                                        placeholder="Search for user"
                                        value={searchParams.recordOwnerId}/>
                                </Col>
                            </Row>}
                            <Row className="margin-bottom-20">
                                <Col xs={12}>
                                    <MultiMonthView weekNumbers={true}
                                                    defaultRange={[searchParams.startDate || now, searchParams.endDate || now]}
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
                {this.renderDailyCalorieRecordSummariesModal(showDailyCalorieRecordSummaries)}
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
                {paginatorComponent}
            </Loader>
        </div>;
    }
}

SearchCalories.contextTypes = {
    router: PropTypes.object
};

export default SearchCalories;
