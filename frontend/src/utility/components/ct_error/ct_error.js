import _ from "lodash";
import React, {PropTypes} from "react";
import CTAlert from "../ct_alert/ct_alert";
import "./assets/css/ct_error.css";

const FETCH_ERROR = "TypeError: Failed to fetch";

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
            if (error.toString() === FETCH_ERROR) {
                view = <ul>
                    <li><span>Network error</span></li>
                </ul>;
            } else {
                view = <ul>
                    {Object.keys(error).map((errorKey, index) => <li key={index}>{error[errorKey]}</li>)}
                </ul>;
            }
        } else {
            view = <ul>
                <li>{error}</li>
            </ul>;
        }
        return view;
    }

    render() {
        let {bsStyle, error, show, ...otherProps} = this.props;
        return <CTAlert bsStyle="danger" className="ct_error"
                        show={!_.isEmpty(error) || (error && error.toString() === FETCH_ERROR)} {...otherProps}>{this.renderError(error ? (error.error || error) : "")}</CTAlert>
    }
}

CTError.propTypes = {error: PropTypes.any};

export default CTError;
