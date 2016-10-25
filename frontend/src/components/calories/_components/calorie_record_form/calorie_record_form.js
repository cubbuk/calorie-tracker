import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../utility/components/_ct_components";
import caloriesService from "../../_services/calorie_records_service";
import calorieRecordConstraints from "../../_constraints/calorie_record_constraint";

class calorieRecordForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {calorieRecord: this.props.calorieRecord};
    }

    componentWillReceiveProps(nextProps) {
        let {calorieRecord = {}} = this.props;
        let {calorieRecord : nextcalorieRecord = {}} = nextProps
        if (calorieRecord._id !== nextcalorieRecord._id) {
            this.setState({calorieRecord: nextProps.calorieRecord, formSubmitted: false});
        }
    }

    onSaveClicked(calorieRecord, e) {
        e.preventDefault();
        if (caloriesService.isValidCalorieRecord(calorieRecord)) {
            let {onSave} = this.props;
            if (onSave instanceof Function) {
                onSave(calorieRecord);
            }
        }
        this.setState({formSubmitted: true});
    }

    onValueChange(fieldName, value) {
        let {calorieRecord = {}} = this.state;
        calorieRecord[fieldName] = value;
        this.setState({calorieRecord});
    }

    render() {
        let {disabled} = this.props;
        let {calorieRecord = {}, formSubmitted} = this.state;
        let {description, calorieAmount} = calorieRecord;
        let onSaveClicked = this.onSaveClicked.bind(this, calorieRecord);
        return <form onSubmit={onSaveClicked} disabled={disabled}>
            <CTFormInput name="description"
                         autoFocus
                         label="Description"
                         formSubmitted={formSubmitted}
                         value={description}
                         validationFunction={(description) => validate({description}, calorieRecordConstraints.description(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "description")}/>
            <CTFormInput name="calorieAmount"
                         label="calorie Amount"
                         type="number"
                         formSubmitted={formSubmitted}
                         value={calorieAmount}
                         validationFunction={(calorieAmount) => validate({calorieAmount}, calorieRecordConstraints.calorieAmount(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "calorieAmount")}/>
            <Button bsStyle="primary" className="pull-right" onClick={onSaveClicked}>Save Record</Button>
            <Button bsStyle="default" className="pull-left" onClick={this.props.onCancel}>Cancel</Button>
        </form>
    }
}

calorieRecordForm.propTypes = {
    calorieRecord: PropTypes.object,
    disabled: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default calorieRecordForm;