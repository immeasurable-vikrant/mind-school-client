import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import { Button } from '@material-ui/core';
import { signError, signUp } from '../actions';
import { ERROR_MESSAGES } from '../common/constants';
import path from 'path';
import TextInput from '../components/TextInput';

import Header from '../components/Header';
import Footer from '../components/Footer';

class SignUp extends Component {
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
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        top: this.props.topOffset,
        left: this.props.leftOffset
      }
    });

    $('#avatar_image').hide();
  }

  UNSAFE_componentWillMount() {
    this.props.signError('');
  }

  submitForm = (e) => {
    e.preventDefault();
    const { isSubmitting } = this.state;

    if (isSubmitting) return;

    const email = $('#email').val();
    const password = $('#password').val();
    const passwordConfirm = $('#passwordConfirm').val();
    const name = $('#name').val();
    // const fileToUpload = document.getElementById('fileToUpload').files;

    if (email && password && passwordConfirm && name) {
      if (
        email.length > 0 &&
        password.length > 0 &&
        passwordConfirm.length > 0 &&
        name.length > 0
      ) {
        if (password === passwordConfirm) {
          if (!isSubmitting) {
            $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
            this.setState({ isSubmitting: true });
          }

          const failed = () => {
            $('#submit').html('Submit');
            this.setState({ isSubmitting: false });
          };

          const avatar = null;

          // if (fileToUpload) {
          //   if (fileToUpload[0]) {
          //     const filename = fileToUpload[0].name;

          //     if (filename && filename.length > 0) {
          //       const ext = path.extname(filename).toLowerCase();

          //       if (
          //         ext === '.png' ||
          //         ext === '.jpg' ||
          //         ext === '.jpeg' ||
          //         ext === '.gif' ||
          //         ext === '.ico'
          //       ) {
          //         avatar = fileToUpload[0];
          //       }
          //     }
          //   }
          // }

          const sleep = (ms) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          return sleep(300).then(() => {
            this.props.signUp({ email, password, name, avatar, failed });
          });
        }
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

  uploadFile(event) {
    const file = event.target.files[0];
    if (file) {
      const ext = path.extname(file.name).toLowerCase();

      if (
        ext === '.png' ||
        ext === '.jpg' ||
        ext === '.jpeg' ||
        ext === '.gif' ||
        ext === '.ico'
      ) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const avatar_image = $('#avatar_image');
          avatar_image.attr('src', e.target.result);
          const avatar_text = $('#avatar_text');
          avatar_text.attr('placeholder', file.name);
          avatar_image.show();
        };

        reader.readAsDataURL(file);
      }
    } else {
      $('#avatar_image').hide();
    }
  }

  renderButton = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          width: '100%',
          height: '60px'
        }}>
        {/* <Button
          label='Avatar Image'
          labelPosition='before'
          style={{ marginLeft: 0, marginRight: 20 }}
          containerElement='label'>
          <input
            type='file'
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              width: '100%',
              opacity: 0,
              marginRight: 20,
            }}
            id='fileToUpload'
            name='fileToUpload'
            className='form-control'
            onChange={this.uploadFile}
          />
        </Button> */}
        <div>
          <input
            id='avatar_text'
            type='text'
            readOnly=''
            className='form-control'
            placeholder=''
          />
        </div>
        <div>
          <img
            id='avatar_image'
            width='50px'
            height='50px'
            alt=''
            className='img-circle'
            style={{ marginLeft: 4, marginRight: 4, verticalAlign: 'middle' }}
          />
        </div>
      </div>
    );
  };

  validateEmail = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = ERROR_MESSAGES.MANDATORY_FIELD;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = ERROR_MESSAGES.INVALID_NAME;
    }

    return error;
  };

  validateName = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = ERROR_MESSAGES.MANDATORY_FIELD;
    } else if (value.length < 4) {
      error = ERROR_MESSAGES.maxNCharacters(4);
    } else if (value.length > 30) {
      error = ERROR_MESSAGES.maxNCharacters(30);
    }

    return error;
  };

  validatePassword = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = ERROR_MESSAGES.MANDATORY_FIELD;
    } else if (value.length < 4) {
      error = ERROR_MESSAGES.maxNCharacters(4);
    } else if (value.length > 15) {
      error = ERROR_MESSAGES.maxNCharacters(4);
    }

    return error;
  };

  validatePasswordConfirm = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = ERROR_MESSAGES.MANDATORY_FIELD;
    }

    const password = $('#password').val();

    if (value !== password) {
      error = 'Passwords must match';
    }

    return error;
  };

  reset = () => {
    this._email.reset();
    this._password.reset();
    this._passwordConfirm.reset();
    this._name.reset();

    // $('#fileToUpload').val('');
    // $('#avatar_image').attr('src', '').hide();
    // $('#avatar_text').attr('placeholder', '');
  };

  render() {
    return (
      <div>
        <Header />
        <div className='loginBox-header'>Sign Up and Start Learning today!</div>
        <div style={{ textAlign: 'center' }}>{this.signError()}</div>
        <div style={this.state.dialogStyle}>
          <form
            className='sign-in-form'
            id='form_info'
            name='form_info'
            onSubmit={(e) => this.submitForm(e)}>
            <TextInput
              ref={(e) => (this._name = e)}
              placeholder=' Full Name'
              name='name'
              type='text'
              validate={this.validateName}
            />
            <TextInput
              ref={(e) => (this._email = e)}
              placeholder='Email'
              name='email'
              type='text'
              validate={this.validateEmail}
            />
            <TextInput
              ref={(e) => (this._password = e)}
              placeholder='Password'
              name='password'
              type='password'
              validate={this.validatePassword}
            />
            <TextInput
              ref={(e) => (this._passwordConfirm = e)}
              placeholder='Confirm Password'
              name='passwordConfirm'
              type='password'
              validate={this.validatePasswordConfirm}
            />
            <input type='checkbox' className='checkbox-terms-conditions' />
            {/* <div className='form-group'>{this.renderButton()}</div> */}
            {/* <div style={{ clear: 'both' }}>&nbsp;</div> */}
            <div>
              <button
                id='submit'
                type='submit'
                value='Submit'
                name='submit'
                className='log-in-btn'>
                Submit
              </button>
              {/* &nbsp;&nbsp;&nbsp;
              <button
                type='button'
                value='Clear'
                name='clear'
                className='btn btn-lg btn-default'
                onClick={(e) => {
                  e.preventDefault();
                  this.props.signError('');
                  this.reset();
                }}>
                Clear
              </button> */}
            </div>
          </form>
        </div>
        <Footer />
      </div>
    );
  }
}

SignUp.propTypes = {
  dialog: PropTypes.bool,
  history: PropTypes.object,
  signError: PropTypes.func,
  signUp: PropTypes.func,
  redirect: PropTypes.string,
  error: PropTypes.string
};

function mapStateToProps(state) {
  return {
    error: state.auth.error
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    signError: (error) => dispatch(signError(error)),
    signUp: ({ email, password, name, avatar, failed }) =>
      dispatch(signUp({ email, password, name, avatar, failed }))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
