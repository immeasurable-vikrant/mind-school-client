import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

export default function (ComposedComponent) {
  const ComposedAuth = (props) => {
    const history = useHistory();
    useEffect(() => {
      return () => {
        !props.logged && history.push('/');
      };
    }, []);
    return <ComposedComponent {...props} />;
  };

  const mapStateToProps = (state) => {
    return { logged: state.auth.logged };
  };

  ComposedAuth.propTypes = {
    logged: PropTypes.bool
  };

  return withRouter(connect(mapStateToProps)(ComposedAuth));
}
