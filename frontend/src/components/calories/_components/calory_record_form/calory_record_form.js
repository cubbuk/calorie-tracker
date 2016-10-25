import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../utility/components/_ct_components";
import caloriesService from "../../_services/calories_service";
import caloryRecordConstraints from "../../_constraints/calory_record_constraint";

class CaloryRecordForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {caloryRecord: this.props.caloryRecord};
    }

    componentWillReceiveProps(nextProps) {
        let {caloryRecord = {}} = this.props;
        let {caloryRecord : nextCaloryRecord = {}} = nextProps
        if (caloryRecord._id !== nextCaloryRecord._id) {
            this.setState({caloryRecord: nextProps.caloryRecord, formSubmitted: false});
        }
    }

    onSaveClicked(caloryRecord, e) {
        e.preventDefault();
        if (caloriesService.isValidCaloryRecord(caloryRecord)) {
            let {onSave} = this.props;
            if (onSave instanceof Function) {
                onSave(caloryRecord);
            }
        }
        this.setState({formSubmitted: true});
    }

    onValueChange(fieldName, value) {
        let {caloryRecord = {}} = this.state;
        caloryRecord[fieldName] = value;
        this.setState({caloryRecord});
    }

    render() {
        let {caloryRecord = {}, formSubmitted} = this.state;
        let {description, caloryAmount} = caloryRecord;
        let onSaveClicked = this.onSaveClicked.bind(this, caloryRecord);
        return <form onSubmit={onSaveClicked}>
            <CTFormInput name="description"
                         autoFocus
                         label="Description"
                         formSubmitted={formSubmitted}
                         value={description}
                         validationFunction={(description) => validate({description}, caloryRecordConstraints.description(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "description")}/>
            <CTFormInput name="caloryAmount"
                         label="Calory Amount"
                         type="number"
                         formSubmitted={formSubmitted}
                         value={caloryAmount}
                         validationFunction={(caloryAmount) => validate({caloryAmount}, caloryRecordConstraints.caloryAmount(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "caloryAmount")}/>
            <Button bsStyle="primary" className="pull-right" onClick={onSaveClicked}>Save Record</Button>
            <Button bsStyle="default" className="pull-left" onClick={this.props.onCancel}>Cancel</Button>
        </form>
    }
}

CaloryRecordForm.propTypes = {
    caloryRecord: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default CaloryRecordForm;