import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../utility/components/_ct_components";
import SelectUser from "../../../users/_components/select_user/select_user";
import caloriesService from "../../_services/calorie_records_service";
import calorieRecordConstraints from "../../_constraints/calorie_record_constraint";
import utilityService from "../../../../utility/services/utility_service";

class calorieRecordForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {calorieRecord: this.props.calorieRecord};
    }

    componentWillReceiveProps(nextProps) {
        let {calorieRecord = {}} = this.props;
        let {calorieRecord : nextCalorieRecord = {}} = nextProps
        if (calorieRecord._id !== nextCalorieRecord._id) {
            this.setState({calorieRecord: nextProps.calorieRecord, formSubmitted: false});
        }
    }

    onSaveClicked(calorieRecord, e) {
        e.preventDefault();
        this.saveCalorieRecord(calorieRecord);
    }

    saveCalorieRecord(calorieRecord) {
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

    onKeyPress(calorieRecord, e) {
        if (utilityService.isEnterKeyEvent(e)) {
            this.saveCalorieRecord(calorieRecord);
        }
    }

    render() {
        let {adminMode, disabled} = this.props;
        let {calorieRecord = {}, formSubmitted} = this.state;
        let {description, calorieAmount, recordOwnerId} = calorieRecord;
        let onSaveClicked = this.onSaveClicked.bind(this, calorieRecord);
        return <form onSubmit={onSaveClicked} disabled={disabled}
                     onKeyPress={this.onKeyPress.bind(this, calorieRecord)}>
            {adminMode && <CTFormInput label="Select User">
                <SelectUser
                    autoBlur
                    autoload={false}
                    onSelect={this.onValueChange.bind(this, "recordOwnerId")}
                    placeholder="Search for user"
                    value={recordOwnerId}/>
            </CTFormInput>}
            <CTFormInput name="description"
                         autoFocus
                         label="Description"
                         formSubmitted={formSubmitted}
                         value={description}
                         validationFunction={(description) => validate({description}, calorieRecordConstraints.description(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "description")}/>
            <CTFormInput name="calorieAmount"
                         label="Calorie Amount"
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
    adminMode: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default calorieRecordForm;