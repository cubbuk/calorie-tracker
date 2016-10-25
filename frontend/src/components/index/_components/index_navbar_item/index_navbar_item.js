import React, {PropTypes} from "react";
import {Link} from "react-router";
import "./_assets/css/index_navbar_item.css";

class IndexNavbarItem extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }


    render() {
        let {children, to, ...otherProps} = this.props;
        let {router} = this.context;
        return <li className={router.isActive(to) && "active"}>
            <Link to={to} className={router.isActive(to) && "active"}>
                <span className="home_navbar_item_menu_item">{children}</span>
            </Link>
        </li>
    }
}

IndexNavbarItem.props = {
    to: React.PropTypes.any.isRequired
};

IndexNavbarItem.contextTypes = {
    router: PropTypes.object
};


export default IndexNavbarItem;
