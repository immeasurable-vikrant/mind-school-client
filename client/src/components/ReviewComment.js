/** @format */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Paper, Dialog } from '@material-ui/core';
import Rating from 'react-rating';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { commentError, addComment } from '../actions/comment';
import { userInfo } from '../actions';
import SignIn from '../auth/SignIn';

const styles = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  dialogContent: {
    position: 'relative',
    width: '80vw',
    transform: '',
  },
  dialogBody: {
    paddingBottom: 0,
  },
};

const ReviewComment = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  error,
  logged,
  fetchAddComment,
  fetchUserInfo,
  fetchCommentError,
}) => {
  const [state, setState] = useState({
    dialogStyle: { display: 'none' },
    isSubmitting: false,
    open: false,
    rating: 0,
  });

  useEffect(() => {
    setState({
      dialogStyle: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        height: '100%',
      },
    });
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    return () => {
      fetchCommentError('');
    };
  }, []);

  const handleOpen = () => {
    setState({ open: true });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const onRatingClick = (rate, event) => {
    setState({ rating: rate });
  };

  const submitForm = (values) => {
    if (logged) {
      const { isSubmitting } = state;
      if (isSubmitting) return;

      const { rating } = state;
      const { content } = values;

      if (rating && content) {
        if (!isSubmitting) {
          $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
          setState({ isSubmitting: true });
        }

        const failed = () => {
          $('#submit').html('Submit');
          setState({ isSubmitting: false });
        };

        const course_no = localStorage.getItem('course');
        if (course_no) {
          const page = 1;
          const limit = 4;
          const helpful = false;

          const sleep = (ms) =>
            new Promise((resolve) => setTimeout(resolve, ms));
          return sleep(300).then(() => {
            fetchAddComment(
              course_no,
              page,
              limit,
              content,
              rating,
              helpful,
              failed,
            );
          });
        }
      }
    } else {
      handleOpen();
    }
  };

  const renderTextField = ({
    input,
    label,
    type,
    placeholder,
    multiLine,
    meta: { touched, error },
    ...custom
  }) => (
    <div className='form-group'>
      <div className='row'>
        <label htmlFor={input.name} className='col-lg-2 control-label'>
          {label}
        </label>
        <div className='col-lg-10'>
          <textarea
            {...input}
            {...custom}
            id={input.name}
            type={type}
            className='form-control'
            rows='3'
            placeholder={placeholder}
          />
          <p className='help-block'>{touched && error}</p>
        </div>
      </div>
    </div>
  );

  const onCommentError = () => {
    if (error) {
      return (
        <div className='alert alert-danger'>
          <strong>{error}</strong>
        </div>
      );
    }
  };

  const renderDialog = () => {
    return (
      <div>
        <Dialog
          contentStyle={styles.dialogContent}
          bodyStyle={styles.dialogBody}
          style={styles.dialogRoot}
          modal={false}
          open={state.open}
          onRequestClose={handleClose}
          repositionOnUpdate={false}
          autoScrollBodyContent={true}>
          <SignIn redirect={handleClose} dialog={true} />
          <br />
          <br />
        </Dialog>
      </div>
    );
  };

  const renderRating = () => {
    const { rating } = state;
    return (
      <div>
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <Rating
            ref={(e) => (this._rating = e)}
            fractions={2}
            placeholderRate={rating}
            readonly={false}
            empty={
              <img
                src={`/public/assets/images/star-grey.png`}
                alt='star'
                className='icon'
              />
            }
            placeholder={
              <img
                src={`/public/assets/images/star-yellow.png`}
                alt='star'
                className='icon'
              />
            }
            full={
              <img
                src={`/public/assets/images/star-yellow.png`}
                className='icon'
                alt='icon'
              />
            }
            onClick={onRatingClick}
          />
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>{onCommentError()}</div>
        <div style={state.dialogStyle}>
          <form
            onSubmit={handleSubmit(submitForm)}
            noValidate
            autoComplete='off'>
            <div style={{ width: '300px' }}>
              <Field
                name='content'
                type='text'
                component={renderTextField}
                label='Review'
                placeholder='You can use multiline.'
                multiLine={true}
              />
            </div>
            <div>&nbsp;</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                id='submit'
                type='submit'
                value='Submit'
                name='submit'
                className='btn btn-lg btn-primary'
                disabled={submitting}>
                Submit
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                type='button'
                value='Clear'
                name='clear'
                className='btn btn-lg btn-default'
                disabled={pristine || submitting}
                onClick={(e) => {
                  e.preventDefault();
                  fetchCommentError('');
                  reset();
                }}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>{renderDialog()}</div>
      <div>
        <br />
        <div className='container'>
          <div className='row'>
            <div className='col-sm-12'>
              <Paper
                // zDepth={1}
                style={{
                  width: '100%',
                  height: '100%',
                  marginTop: 40,
                  marginBottom: 40,
                  overflow: 'hidden',
                  backgroundColor: '#FFF',
                  display: 'block',
                }}>
                <br />
                <div
                  className='text-size-second text-bold'
                  style={{ textAlign: 'center' }}>
                  Share your opinion about the quality of this course.
                </div>
                <br />
                {renderRating()}
                {renderForm()}
              </Paper>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export const validate = (values) => {
  const errors = {};

  if (!values.content) {
    errors.content = 'Required';
  } else if (values.content.length < 10) {
    errors.content = 'Must be 10 characters or more';
  }

  return errors;
};

ReviewComment.propTypes = {
  handleSubmit: PropTypes.func,
  pristine: PropTypes.string,
  reset: PropTypes.func,
  submitting: PropTypes.bool,
  error: PropTypes.string,
  logged: PropTypes.bool,
  fetchAddComment: PropTypes.func,
  fetchUserInfo: PropTypes.func,
  fetchCommentError: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    hasError: state.fetchCommentError,
    isLoading: state.fetchCommentLoading,
  };
};

const form = reduxForm({
  form: 'review',
  validate,
});

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCommentError: (error) => dispatch(commentError(error)),
    fetchAddComment: (
      course_no,
      page,
      limit,
      content,
      rating,
      helpful,
      failed,
    ) =>
      dispatch(
        addComment(course_no, page, limit, content, rating, helpful, failed),
      ),
    fetchUserInfo: () => dispatch(userInfo()),
  };
};

export default withRouter(
  form(connect(mapStateToProps, mapDispatchToProps)(ReviewComment)),
);
