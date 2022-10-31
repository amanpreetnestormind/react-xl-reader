import React, { Component } from "react";
import ErrorBoundary from "./components/error_boundry";
import UserViewForm from "./components/user_view";

export default class App extends Component {
  render() {
    return (
      <div className="container m-auto">
        <ErrorBoundary>
          <UserViewForm />
        </ErrorBoundary>
      </div>
    );
  }
}
