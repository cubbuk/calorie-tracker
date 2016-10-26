import React, {PropTypes} from "react";
import IndexNavbar from "./_components/index_navbar/index_navbar";
import IndexFooter from "./_components/index_footer/index_footer";
import publisher from "../../utility/services/publisher";
import events from "../../utility/constants/events";

class Index extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        publisher.subscribeToEvent(events.AUTHENTICATION_ERROR, this.onAuthenticationError.bind(this))
    }

    componentWillMount(){
        this.authenticationListener = publisher.subscribeToEvent(events.AUTHENTICATION_ERROR, this.onAuthenticationError.bind(this))
    }

    componentWillUnmount(){
        publisher.removeGivenListener(this.authenticationListener);
    }

    onAuthenticationError() {
        let {router} = this.context;
        router.push("/login");
    }


    render() {
        let {children} = this.props;
        return <div>
            <IndexNavbar/>
            <div className="container" style={{marginTop: "71px"}}>
                {children}
            </div>
            <IndexFooter/>
        </div>;
    }
}

Index.contextTypes = {
    router: PropTypes.object
};

export default Index;
