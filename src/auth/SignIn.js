/** @format */

import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signError, logIn } from '../actions';
import TextInput from '../components/TextInput';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { hostUrl } from '../../config';
import '../../styles/style.css';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogStyle: { display: 'none' },
      isSubmitting: false
    };
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  };

  getChildContext() {
    return { muiTheme: this.state.muiTheme };
  }

  static propTypes = {
    topOffset: PropTypes.number,
    leftOffset: PropTypes.number
  };

  componentDidMount() {
    this.setState({
      dialogStyle: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        height: '100%',
        top: this.props.topOffset,
        left: this.props.leftOffset
      }
    });
  }

  UNSAFE_componentWillMount() {
    this.props.signError('');
  }

  submitForm = (e) => {
    e.preventDefault();

    const { isSubmitting } = this.state;

    if (isSubmitting) return;

    const { redirect } = this.props;
    const email = $('#email').val();
    const password = $('#password').val();

    if (email && password) {
      if (email.length > 0 && password.length > 0) {
        if (!isSubmitting) {
          $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
          this.setState({ isSubmitting: true });
        }

        const failed = () => {
          $('#submit').html('Submit');
          this.setState({ isSubmitting: false });
        };

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        return sleep(300).then(() => {
          this.props.login({ email, password, redirect, failed });
        });
      }
    }
  };

  signError = () => {
    if (this.props.error) {
      return (
        <div className='alert alert-danger'>
          <strong>{this.props.error}</strong>
        </div>
      );
    }
  };

  validateEmail = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }

    return error;
  };

  validatePassword = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = 'Required';
    } else if (value.length < 4) {
      error = 'Must be 4 characters or more';
    } else if (value.length > 15) {
      error = 'Must be 15 characters or less';
    }

    return error;
  };

  reset = () => {
    this._email.reset();
    this._password.reset();
  };

  renderSocial = () => {
    return (
      <div>
        <a
          className='btn btn-outline-dark google-oAuth-btn'
          href={`${hostUrl}/auth/google`}
          role='button'
          style={{ textTransform: 'none', border: '1px solid #ced4da' }}>
          <img
            width='20px'
            style={{ marginBottom: '3px', marginRight: '5px' }}
            alt='Google sign-in'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png'
          />
          Login with Google
        </a>
      </div>
    );
  };

  renderHeader = () => {
    if (!this.props.dialog) {
      return <Header />;
    }
  };

  renderFooter = () => {
    if (!this.props.dialog) {
      return <Footer />;
    }
  };
  render() {
    return (
      <div>
        {this.renderHeader()}
        <div className='loginBox-header'>
          Log In to Your Immeasurable Account!
        </div>
        <div style={{ textAlign: 'center' }}>{this.signError()}</div>
        <form className='sign-in-form' onSubmit={(e) => this.submitForm(e)}>
          <div>{this.renderSocial()}</div>
          <TextInput
            ref={(e) => (this._email = e)}
            name='email'
            type='text'
            placeholder='Email'
            validate={this.validateEmail}
          />
          <TextInput
            ref={(e) => (this._password = e)}
            name='password'
            type='password'
            validate={this.validatePassword}
            placeholder='Password'
          />
          <div>
            <button
              id='submit'
              type='submit'
              value='Submit'
              className='log-in-btn'
              name='submit'>
              Log In
            </button>
            <div
              className='dont-have-account'
              onClick={(e) => {
                e.preventDefault();
                this.props.history.push('/signup');
              }}>
              Don&apos;t have an account?
              <a className='loginPage-signup' href='/signup'>
                Sign Up
              </a>
            </div>
          </div>
        </form>

        <div style={{ marginBottom: 40 }}>&nbsp;</div>
        {this.renderFooter()}
      </div>
    );
  }
}

Signin.propTypes = {
  dialog: PropTypes.bool,
  history: PropTypes.object,
  signError: PropTypes.func,
  login: PropTypes.func,
  redirect: PropTypes.string,
  error: PropTypes.string
};

function mapStateToProps(state) {
  return { error: state.auth.error };
}

const mapDispatchToProps = (dispatch) => {
  return {
    signError: (error) => dispatch(signError(error)),
    login: ({ email, password, redirect, failed }) =>
      dispatch(logIn({ email, password, redirect, failed }))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
