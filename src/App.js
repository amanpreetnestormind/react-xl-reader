import React, { Component } from "react";
import ErrorBoundary from "./components/error_boundry";
import TableData from "./components/table_data";

export default class App extends Component {
  render() {
    return (
      <div className="container m-auto">
        <ErrorBoundary>
          <TableData />
        </ErrorBoundary>
      </div>
    );
  }
}
