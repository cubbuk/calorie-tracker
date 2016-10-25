import _ from "lodash";
import React, {PropTypes} from "react";
import CTAlert from "../ct_alert/ct_alert";

class CTError extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    renderError(error) {
        let view = null;
        if (_.isArray(error)) {
            view = <ul>
                {error.map((eachError, index) => <li key={index}>{eachError}</li>)}
            </ul>;
        } else if (_.isObject(error)) {
            view = <ul>
                {Object.keys(error).map((errorKey, index) => <li key={index}>{error[errorKey]}</li>)}
            </ul>;
        } else {
            view = <ul>
                <li>{error}</li>
            </ul>;
        }
        return view;
    }

    render() {
        let {bsStyle, error, show, ...otherProps} = this.props;
        return <CTAlert bsStyle="danger" show={!_.isEmpty(error)} {...otherProps}>{this.renderError(error)}</CTAlert>
    }
}

CTError.propTypes = {error: PropTypes.any};

export default CTError;
