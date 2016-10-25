import React from "react";
import IndexNavbar from "./_components/index_navbar/index_navbar";
import IndexFooter from "./_components/index_footer/index_footer";

class Index extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
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

export default Index;
