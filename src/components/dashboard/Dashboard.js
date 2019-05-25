import React, { Component } from "react";
import Notifications from "./Notifications";
import ProjectList from "../projects/ProjectList";
//6. connect with our store
import { connect } from "react-redux"; // glue redux with react

class Dashboard extends Component {
  render() {
    //console.log(this.props);
    const { projects } = this.props;
    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m6">
            <ProjectList projects={projects} />
          </div>
          <div className="col s12 m5 offset-m1">
            <Notifications />
          </div>
        </div>
      </div>
    );
  }
}
// 8. we need to map our state from the store to the props of this component. We do that by creating ths function
const mapStateToProps = state => {
  //9. return an Object that is going to represent which properties are attached to the props so we can access then inside this component
  return {
    projects: state.project.projects
  };
};
export default connect(mapStateToProps)(Dashboard); // 7 connect is a function which return a HOC to taking the dashboard
