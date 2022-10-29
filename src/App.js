import React, { Component } from "react";
import UserViewForm from "./components/user_view";

export default class App extends Component {
  render() {
    return (
      <div className="container m-auto">
        <UserViewForm />
      </div>
    );
  }
}
