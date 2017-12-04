import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import chai from "chai";
import jquery from "jquery";
import FaCheckCircle from "react-icons/lib/fa/check-circle";
import FaTimesCircle from "react-icons/lib/fa/times-circle";

import Editor from "./Editor";
import Preview from "./Preview";
import "./DomChallenge.scss";

class DomChallenge extends Component {
  constructor(props) {
    super(props);
    const { challenge } = this.props;
    this.state = {
      code: challenge.challengeSeed[0]
    };
  }

  updateCode = code => {
    this.setState({ code });
  };

  testCode = () => {
    const { dispatch, challenge, challengeName } = this.props;
    const { tests } = challenge;
    /* eslint-disable no-unused-vars */
    const { code } = this.state;
    const { assert } = chai;
    const $ = jquery;
    /* eslint-enable no-unused-vars */

    // TODO: Make a temp array of the status (pass or fail) for each test, then submit action when it's all said and done.
    const testStatuses = [];
    for (let i = 0; i < tests.length; i += 1) {
      try {
        /* eslint-disable no-eval */
        eval(tests[i].testString);
        testStatuses[i] = true;
      } catch (e) {
        /* eslint-enable no-eval */
        testStatuses[i] = false;
      }
    }
    // TODO: Submit action to make challenge.tests have hasPassed value
    dispatch({
      type: "TEST_CHALLENGE_CODE",
      testStatuses,
      challenge,
      challengeName
    });
  };

  render() {
    const { description, name, tests } = this.props.challenge;
    /* eslint-disable react/no-danger */
    return (
      <div className="dom-challenge">
        <div className="dom-challenge-description">
          <h1 className="dom-challenge-name">{name}</h1>
          {description.map((descriptionHtml, i) => (
            <div
              key={i}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ))}
          <button className="dom-challenge-button" onClick={this.testCode}>
            Run tests (Ctrl + Enter)
          </button>
          <h3>Test-stuff incomplete</h3>
          {this.state.testsPassed && "The tests have motherfucking passed"}
          <div>
            {tests.map(test => (
              <div className="challenge-test" key={test.text}>
                <div>
                  {test.hasPassed ? (
                    <FaCheckCircle className="test-icon-pass" />
                  ) : (
                    <FaTimesCircle className="test-icon-fail" />
                  )}
                </div>
                <div dangerouslySetInnerHTML={{ __html: test.text }} />
              </div>
            ))}
          </div>
        </div>
        <Editor code={this.state.code} updateCode={this.updateCode} />
        <Preview code={this.state.code} />
      </div>
    );
    /* eslint-enable react/no-danger */
  }
}

DomChallenge.propTypes = {
  challenge: PropTypes.shape({
    description: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string,
    tests: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  challengeName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const challengeName = state.router.pathname.split("/")[2];
  const challenge = state.challenges[challengeName];
  return { challenge, challengeName };
};

export default connect(mapStateToProps)(DomChallenge);
