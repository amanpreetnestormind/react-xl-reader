import { Box } from "@material-ui/core";
import React, { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
        this.reloadPage = this.reloadPage.bind(this)
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    reloadPage = () => {
        window.location.reload()
    }

    render() {
        const { hasError } = this.state;

        if (hasError) {
            return <Box className="error-boundary-main">
                <Box style={{
                    textAlign: "center"
                }}>
                    <h1>Something went wrong.</h1>
                    <br />
                    <small>
                        press
                        <input
                            className="btn btn-sm btn-success m-2"
                            type="button"
                            value="Refresh"
                            onClick={this.reloadPage}
                        />
                        button to reload page.</small>
                </Box>
            </Box>
        }

        return this.props.children;
    }
}
