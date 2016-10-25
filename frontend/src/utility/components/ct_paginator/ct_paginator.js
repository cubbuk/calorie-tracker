import _ from "lodash";
import React, {PropTypes} from "react";
import {Pagination} from "react-bootstrap";


class CTPaginator extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    render() {
        let {total = 0, resultsPerPage, ...otherProps} = this.props;
        let view = null;
        if (total > resultsPerPage) {
            view = <Pagination items={Math.ceil(total / resultsPerPage)} {...otherProps}/>;
        }
        return view;
    }
}

CTPaginator.propTypes = {
    total: PropTypes.number.isRequired,
    resultsPerPage: PropTypes.number
};

CTPaginator.defaultProps = {
    resultsPerPage: 10
};

export default CTPaginator;
