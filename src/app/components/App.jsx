import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "react-sidebar";

import "./App.scss";
import Header from "./Header/Header";
import Map from "./Map/Map";
import Challenge from "./Challenge/Challenge";

class App extends Component {
  onSetSidebarOpen = () => {
    const { dispatch } = this.props;
    dispatch({ type: "TOGGLE_SIDEBAR_OPEN" });
  };

  render() {
    const { sidebarOpen } = this.props;
    return (
      <Sidebar
        sidebar={<Map />}
        open={sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        pullRight
        styles={{
          content: {
            overflowY: "auto"
          },
          sidebar: {
            zIndex: 10
          },
          overlay: {
            position: "relative"
          }
        }}
        sidebarClassName="sidebar"
      >
        <div className="main-content">
          <Header />
          <Route path="/challenge/:challenge" component={Challenge} />
        </div>
      </Sidebar>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({ sidebarOpen: state.sidebar.isOpen });

export default connect(mapStateToProps)(App);
