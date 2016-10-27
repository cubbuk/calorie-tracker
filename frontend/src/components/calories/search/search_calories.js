import _ from "lodash";
import Loader from "react-loader";
import React, {PropTypes} from "react";
import {Button, Col, Glyphicon, Modal, Panel, Row} from "react-bootstrap";
import {MultiMonthView} from "react-date-picker";
import {CTConfirmModal, CTError, CTTimeSlider, CTPaginator} from "../../../utility/components/_ct_components";
import CalorieRecordForm from "../_components/calorie_record_form/calorie_record_form";
import CalorieRecordsTable from "../../users/_components/calorie_records_table/calorie_records_table";
import SelectUser from "../../users/_components/select_user/select_user";
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
        this.searchCalorieRecords()
            .then(() => this.setState({loaded: true}))
            .catch(error => this.setState({error, loaded: true}));
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimeout);
    }

    selectCalorieRecordToBeUpdated(calorieRecord) {
        this.setState({calorieRecordToBeUpdated: _.clone(calorieRecord), updateError: undefined});
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

    onCancelUpdate() {
        this.setState({calorieRecordToBeUpdated: undefined});
    }

    updateCalorieRecord(calorieRecord) {
        this.setState({isUpdating: true});
        calorieRecordsService.updateCalorieRecord(calorieRecord)
            .then(() => this.searchCalorieRecords())
            .then(() =>
                this.setState({
                    updateError: undefined,
                    isUpdating: false,
                    calorieRecordToBeUpdated: undefined
                }))
            .catch(updateError => this.setState({updateError, isUpdating: false}));
    }

    onCancelNewRecord() {
        this.setState({showNewCalorieRecordModal: false});
    }

    openAddNewCalorieRecordModal() {
        this.setState({addError: undefined, showNewCalorieRecordModal: true});
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

    addNewCalorieRecord(newCalorieRecord) {
        this.setState({isAdding: true});
        calorieRecordsService.addNewCalorieRecord(newCalorieRecord)
            .then(() => this.searchCalorieRecords({pageNumber: 1}))
            .then(() => {
                this.setState({
                    addError: undefined,
                    isAdding: false,
                    showNewCalorieRecordModal: false
                });
            }).catch(addError => this.setState({addError, isAdding: false}));
    }

    selectCalorieRecordToBeDeleted(calorieRecord) {
        this.setState({calorieRecordToBeDeleted: calorieRecord, deleteError: undefined});
    }

    cancelDeletionOfCalorieRecord() {
        this.setState({calorieRecordToBeDeleted: undefined});
    }

    renderCalorieDeleteModal() {
        let {isDeleting, calorieRecordToBeDeleted, deleteError} = this.state;
        let cancelDeletionOfCalorieRecord = this.cancelDeletionOfCalorieRecord.bind(this);
        let view = null;
        if (calorieRecordToBeDeleted) {
            view = <CTConfirmModal disabled={isDeleting}
                                   show
                                   onCancel={cancelDeletionOfCalorieRecord}
                                   onConfirm={this.deleteRecord.bind(this, calorieRecordToBeDeleted)}
                                   onHide={cancelDeletionOfCalorieRecord}>
                <Loader loaded={!isDeleting}/>
                <CTError error={deleteError}/>
                Do you confirm deleting this record?
            </CTConfirmModal>
        }
        return view;
    }

    deleteRecord(calorieRecordToBeDeleted) {
        this.setState({isDeleting: true});
        console.log(calorieRecordToBeDeleted);
        calorieRecordsService.deleteCaloryRecord(calorieRecordToBeDeleted._id)
            .then(() => this.searchCalorieRecords({pageNumber: 1}))
            .then(() => {
                this.setState({
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
            this.searchCalorieRecords({searchParams, pageNumber: 1});
        } else {
            this.setState({searchParams});
        }
    }

    onUserSelected(recordOwnerId) {
        let {searchParams = {}} = this.state;
        searchParams.recordOwnerId = recordOwnerId;
        this.searchCalorieRecords({searchParams, pageNumber: 1});
    }

    onTimeFilterChanged(startTime, endTime) {
        let {searchParams = {}} = this.state;
        searchParams.startMinutes = startTime;
        searchParams.endMinutes = endTime;
        this.searchCalorieRecords({searchParams, pageNumber: 1});
    }

    selectPage(pageNumber) {
        this.searchCalorieRecords({pageNumber});
    }

    searchCalorieRecords(params = {}) {
        params.searchParams = params.searchParams || this.state.searchParams;
        params.pageNumber = params.pageNumber || this.state.pageNumber;
        params.resultsPerPage = RESULTS_PER_PAGE;
        this.searchTimeout = setTimeout(() => this.setState({isSearching: true}), 500); //if search does not finish in given period, show an indicator
        return this.retrieveCalorieRecords(params)
            .then((results = {records: [], count: 0}) => {
                clearTimeout(this.searchTimeout);
                let {searchParams = {}, pageNumber = 1} = params;
                return this.setState({
                    calorieRecords: results.records,
                    totalCount: results.count,
                    isSearching: false,
                    searchParams,
                    pageNumber
                });
            }).catch(error => {
                clearTimeout(this.searchTimeout);
                this.setState({error, isSearching: false})
            });
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

    renderFilters(showFilters) {
        let view = null;
        if (showFilters) {
            const now = new Date();
            let {searchParams} = this.state;
            view = <Row>
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
                    <Row style={{marginBottom: "40px", marginLeft: "-5px"}}>
                        <Col xs={12} md={3}>
                            <div className="margin-bottom-10">Time Filter</div>
                            <CTTimeSlider onTimeChanged={this.onTimeFilterChanged.bind(this)}/>
                        </Col>
                    </Row>
                    <Row className="margin-bottom-20">
                        <Col xs={12}>
                            <MultiMonthView weekNumbers={true}
                                            defaultRange={[searchParams.startDate || now, searchParams.endDate || now]}
                                            highlightRangeOnMouseMove
                                            onRangeChange={this.rangeChanged.bind(this)}/>
                        </Col>
                    </Row>
                </Col>
            </Row>;
        }
        return view;
    }

    renderPanelHeader() {
        let {isSearching, pageNumber, searchParams, showFilters, calorieRecords = []} = this.state;
        return <Row>
            <Col xs={12}>
                <Button className="margin-right-10"
                        onClick={this.openAddNewCalorieRecordModal.bind(this)}>
                    Add new record&nbsp;<Glyphicon glyph="plus"/>
                </Button>
                <Button className="margin-right-10"
                        onClick={() => this.setState({showFilters: !showFilters})}>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                    &nbsp;<Glyphicon glyph="filter"/>
                </Button>
                <Button className="margin-right-10"
                        disabled={calorieRecords.length === 0}
                        onClick={this.retrieveDailySummaries.bind(this, searchParams)}>
                    Daily Summaries&nbsp;<Glyphicon glyph="list"/>
                </Button>
                <Button onClick={this.searchCalorieRecords.bind(this, {searchParams, pageNumber})}>Search&nbsp;
                    <Glyphicon
                        glyph="search"/></Button>
                {isSearching && <img width={35} className="margin-left-10"
                                     src={require("../../../assets/images/loading.gif")}/>}
            </Col>
        </Row>;
    }

    render() {
        let {calorieRecords = [], totalCount = 0, calorieRecordToBeUpdated, loaded, showFilters, showNewCalorieRecordModal, isUpdating, isAdding} = this.state;
        let {error, addError, updateError, pageNumber = 1, showDailyCalorieRecordSummaries} = this.state;
        return <div>
            <CTError error={error}/>
            <Loader loaded={loaded}>
                <Panel bsStyle="primary" header={this.renderPanelHeader()}>
                    {this.renderFilters(showFilters)}
                </Panel>
                {this.renderCalorieDeleteModal()}
                {this.renderNewCalorieRecordModal(showNewCalorieRecordModal, isAdding, addError)}
                {this.renderCalorieUpdateModal(calorieRecordToBeUpdated, isUpdating, updateError)}
                {this.renderDailyCalorieRecordSummariesModal(showDailyCalorieRecordSummaries)}
                <CalorieRecordsTable calorieRecords={calorieRecords}
                                     adminView={this.hasAdminRole}
                                     onUpdateClicked={this.selectCalorieRecordToBeUpdated.bind(this)}
                                     onDeleteClicked={this.selectCalorieRecordToBeDeleted.bind(this)}/>
                <CTPaginator bsSize="medium"
                             style={{marginTop: "0px"}}
                             total={totalCount}
                             activePage={pageNumber}
                             resultsPerPage={RESULTS_PER_PAGE}
                             onSelect={this.selectPage.bind(this)}/>
            </Loader>
        </div>;
    }
}

SearchCalories.contextTypes = {
    router: PropTypes.object
};

export default SearchCalories;
