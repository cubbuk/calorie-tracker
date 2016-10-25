import React, {PropTypes} from "react";
import {MenuItem, Navbar, Nav, NavDropdown} from "react-bootstrap";
import IndexNavbarItem from "../index_navbar_item/index_navbar_item";
import loginService from "../../../login/_services/login_service";
import appState from "../../../../utility/app_state";
import {Link} from "react-router";
import logger from "../../../../utility/services/logger";

class IndexNavbar extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }

    onLogout() {
        loginService.logoutUser().then(() => {
            let {router} = this.context;
            router.replace("login");
        }).catch(error => {
            logger.logError(error);
            this.setState(error);
        });
    }

    render() {
        let user = appState.getUser();
        let {name, surname} = user || {};
        return <Navbar fixedTop>
            <Navbar.Header>
                <Navbar.Brand>
                    <a className="navbar-brand" href="#">Calories Tracker</a>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                {user && <Nav>
                    <IndexNavbarItem to="calories/search">Calories List</IndexNavbarItem>
                </Nav>}
                <Nav pullRight>
                    {user && <NavDropdown eventKey={3} title={name + " " + surname} id="basic-nav-dropdown">
                        <MenuItem eventKey={3.1}><Link to="settings">Settings</Link></MenuItem>
                        <MenuItem eventKey={3.2} onClick={this.onLogout.bind(this)}>Logout</MenuItem>
                    </NavDropdown>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>;
    }
}

IndexNavbar.contextTypes = {
    router: PropTypes.object
};

export default IndexNavbar;
