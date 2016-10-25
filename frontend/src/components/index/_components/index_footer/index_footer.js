import React from "react";

class IndexFooter extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }


    render() {
        return <footer className="footer">
            <div className="container">
                <p className="text-muted text-white">
                    <small>&copy; 2016 Calories Tracker</small>
                </p>
            </div>
        </footer>
    }
}

export default IndexFooter;
