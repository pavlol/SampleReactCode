import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

export default function(ComposedComponent) {
  class Authentication extends Component {
    static contextTypes = {
      router: propTypes.object
    }

    componentWillMount() {

      if (!this.props.authenticated) {
        this.context.router.history.push('/');
      }
    }

    componentWillUpdate(nextProps) {

      if (!nextProps.authenticated) {
        this.context.router.history.push('/');
      }
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

  return connect(mapStateToProps)(Authentication);
}
