import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

export default function(ComposedComponent) {
  class AuthenticationEditor extends Component {
    static contextTypes = {
      router: propTypes.object
    }

    accessControl = () => {
        if (!this.props.authenticated) {
            this.context.router.history.push('/');
        }
        else if (!this.props.accessLevel==="editor") {
            this.context.router.history.push('/');
        }
    }

    componentWillMount() {
      this.accessControl();
    }

    componentWillUpdate(nextProps) {
      this.accessControl();
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { 
      authenticated: state.auth.authenticated,
      accessLevel : state.auth.accessLevel
       };
  }

  return connect(mapStateToProps)(AuthenticationEditor);
}
