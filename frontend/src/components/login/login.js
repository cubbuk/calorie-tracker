import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button, Panel} from "react-bootstrap";
import {CTError, CTFormInput} from "utility/components/_ct_components";
import IndexNavbar from "components/index/_components/index_navbar/index_navbar";
import loginConstraints from "./_constraints/login_constraints";
import loginService from "./_services/login_service";
import "./_assets/login.css";

class Login extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    onValueChange(fieldName, value) {
        this.setState({[fieldName]: value});
    }

    onLogin(username, password, e) {
        e.preventDefault();
        loginService.loginUser({username, password})
            .then(() => {
                let {location} = this.props;
                let {router} = this.context;
                if (location.state && location.state.nextPathname) {
                    router.replace({pathname: location.state.nextPathname, query: location.state.nextQuery})
                } else {
                    router.replace('/');
                }
                this.setState({error: undefined, formSubmitted: true});
            })
            .catch(error => this.setState({error, formSubmitted: true}))
    }

    render() {
        let {error, formSubmitted, username, password} = this.state;
        return <div className="login-page">
            <IndexNavbar/>
            <Panel header="Giriş" className="login-panel">
                <CTError error={error}/>
                <form onSubmit={this.onLogin.bind(this, username, password)}>
                    <CTFormInput name="username"
                                 autoFocus
                                 label="Kullanıcı Adı"
                                 formControlClass={this.DEFAULT_FORM_COCTROL_CLASS}
                                 formGroupClass={this.DEFAULT_FORM_GROUP_CLASS}
                                 labelClass={this.DEFAULT_LABEL_CLASS}
                                 formSubmitted={formSubmitted}
                                 value={username}
                                 validationFunction={(username) => validate({username}, loginConstraints.username(), {fullMessages: false})}
                                 onValueChange={this.onValueChange.bind(this, "username")}/>
                    <CTFormInput name="password"
                                 label="Şifre"
                                 formControlClass={this.DEFAULT_FORM_COCTROL_CLASS}
                                 formGroupClass={this.DEFAULT_FORM_GROUP_CLASS}
                                 labelClass={this.DEFAULT_LABEL_CLASS}
                                 formSubmitted={formSubmitted}
                                 value={password}
                                 validationFunction={(password) => validate({password}, loginConstraints.password(), {fullMessages: false})}
                                 onValueChange={this.onValueChange.bind(this, "password")}/>
                    <Button bsStyle="primary"
                            className="pull-right"
                            type="submit"
                            onClick={this.onLogin.bind(this, username, password)}>Giriş</Button>
                </form>
            </Panel>
        </div>
    }
}

Login.prototype.DEFAULT_FORM_COCTROL_CLASS = "form-control nt-search-input";
Login.prototype.DEFAULT_LABEL_CLASS = "control-label select-label";
Login.prototype.DEFAULT_FORM_GROUP_CLASS = "form-group white-bg";

Login.contextTypes = {
    router: PropTypes.object
};


export default Login;