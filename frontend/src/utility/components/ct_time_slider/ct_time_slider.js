import React, {PropTypes} from "react";
import Rcslider from "rc-slider";
import stringUtility from "../../services/string_utility";

const minTime = 0;
const maxTime = 60 * 24;

const marks = {
    [minTime]: <strong>{stringUtility.formatMinutes(minTime)}</strong>,
    [maxTime]: <strong>{stringUtility.formatMinutes(maxTime)}</strong>,
};

class CTTimeSlider extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    onTimeChanged(values) {
        if (this.props.onTimeChanged instanceof Function) {
            this.props.onTimeChanged(values[0], values[1]);
        }
    }

    render() {
        return <Rcslider min={minTime}
                         max={maxTime}
                         marks={marks}
                         defaultValue={[minTime, maxTime]}
                         onAfterChange={this.onTimeChanged.bind(this)}
                         range
                         tipFormatter={stringUtility.formatMinutes.bind(this)}/>
    }
}

CTTimeSlider.propTypes = {
    onTimeChanged: PropTypes.func.isRequired
};

export default CTTimeSlider;