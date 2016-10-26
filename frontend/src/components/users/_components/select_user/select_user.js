import Loader from "react-loader";
import React, {PropTypes} from "react";
import Select from "react-select";
import usersService from "../../_services/users_service";

class SelectUser extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    componentWillMount() {
        if (this.props.value) {
            this.setState({loading: true});
            usersService.findUserById(this.props.value).then((result) => {
                let options = [];
                if (result) {
                    options.push({value: result._id, label: result.fullName});
                }
                this.setState({loading: false, options});
            }).catch(error => {
                this.setState({error, loading: false})
            })
        }
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimeout);
    }

    getOptions(input, callback) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            return usersService.retrieveUserList({query: input}).then(results => {
                callback(null, {
                    options: results.map(result => ({value: result._id, label: result.fullName})),
                    complete: true
                });
            }).catch(err => callback(err, {complete: true}));
        }, 500);
    }

    onChange(value = {}) {
        if (this.props.onChange instanceof Function) {
            this.props.onSelect(value);
        }
        if (this.props.onSelect instanceof Function) {
            this.props.onSelect(value ? value.value : "");
        }
    }

    render() {
        let {onChange, ...otherProps} = this.props;
        let {loading, options = []} = this.state;
        return <Loader loaded={!loading}>
            <Select.Async
                onChange={this.onChange.bind(this)}
                loadOptions={this.getOptions.bind(this)}
                options={options.length === 0 ? undefined : options}
                {...otherProps}/>
        </Loader>;
    }
}

SelectUser.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default SelectUser;

