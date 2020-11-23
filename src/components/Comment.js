import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { Dialog, Button, CircularProgress } from '@material-ui/core';
import {
  resetComment,
  listComment,
  removeComment,
  toggleHelpful
} from '../actions/comment';
import { userInfo } from '../actions';

import AlertDialog from './AlertDialog';
import SignIn from '../auth/SignIn';

const styles = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0
  },
  dialogContent: {
    position: 'relative',
    width: '80vw',
    transform: ''
  },
  dialogBody: {
    paddingBottom: 0
  }
};

const Comment = ({
  comments,
  isLoading,
  hasError,
  logged,
  total,
  fetchResetComment,
  fetchListComment,
  fetchRemoveComment,
  fetchToggleHelpful,
  fetchUserInfo
}) => {
  const history = useHistory();
  const [state, setState] = useState({
    dialogStyle: { display: 'none' },
    open: false,
    course_no: 0,
    page: 1,
    limit: 4,
    remove_no: 0
  });

  useEffect(() => {
    setState({
      dialogStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        marginBottom: 100,
        width: '100%',
        height: '100%'
      }
    });
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }

    const course_no = localStorage.getItem('course');
    if (course_no) {
      setState({ course_no });
      fetchResetComment();
      setTimeout(() => {
        fetchListComment(course_no, state?.page, state?.limit);
      }, 500);
    }
  }, []);

  const handleOpen = () => {
    setState({ open: true });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const showMore = () => {
    let _page = state.page + 1;
    if (_page >= total) {
      _page = total;
    }
    setState({ page: _page });
    fetchListComment(state?.course_no, _page, state?.limit);
  };

  const commentRemove = (comment) => {
    if (logged) {
      if (this._alert) {
        this.setState({ remove_no: comment.no });
        this._alert.handleOpen();
      }
    } else {
      handleOpen();
    }
  };

  const deleteComment = () => {
    const { course_no, page, limit, remove_no } = this.state;
    fetchRemoveComment(course_no, page, limit, remove_no);
  };

  const toggleHelpful = (comment) => {
    if (logged) {
      const { course_no, page, limit } = this.state;
      fetchToggleHelpful(course_no, page, limit, comment.no);
    } else {
      this.handleOpen();
    }
  };

  const reviewComment = () => {
    if (logged) {
      history.push('/review-comment');
    } else {
      handleOpen();
    }
  };

  const renderState = () => {
    if (hasError) {
      return (
        <div className='alert alert-danger'>
          <div style={{ textAlign: 'center' }}>
            <strong>There was a loading error</strong>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div style={this.state.dialogStyle}>
          <CircularProgress size={60} thickness={7} />
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
          open={this.state.open}
          onRequestClose={this.handleClose}
          repositionOnUpdate={false}
          autoScrollBodyContent={true}>
          <SignIn redirect={this.handleClose} dialog={true} />
          <br />
          <br />
        </Dialog>
      </div>
    );
  };

  const commentAdd = () => {
    return (
      <div>
        <span>
          <Button
            color='primary'
            onClick={() => {
              this.reviewComment();
            }}>
            Rate the Course
          </Button>
        </span>
      </div>
    );
  };

  const commentPicture = (comment) => {
    if (comment._user) {
      return (
        <img
          src={`${_.get(comment, '_user.profile.picture')}`}
          width='70px'
          height='70px'
          alt=''
          className='img-circle'
          style={{ marginLeft: 0, marginRight: 0, verticalAlign: 'middle' }}
        />
      );
    }
  };

  const commentDate = (comment) => {
    if (comment._user) {
      return (
        <p className='text-size-fifth'>
          <Moment fromNow ago>
            {comment.date}
          </Moment>{' '}
          ago
        </p>
      );
    }
  };

  const commentName = (comment) => {
    if (comment._user) {
      return (
        <p className='text-size-fifth'>
          {_.get(comment, '_user.profile.name')}
        </p>
      );
    }
  };

  const commentContent = (comment) => {
    if (comment._user) {
      return (
        <div>
          <p
            className='text-size-fifth text-bold'
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        </div>
      );
    }
  };

  const commentReplyDate = (comment) => {
    if (comment._reply) {
      return (
        <p className='text-size-fifth'>
          <Moment fromNow ago>
            {_.get(comment, '_reply.date')}
          </Moment>{' '}
          ago
        </p>
      );
    }
  };

  const commentReplyName = (comment) => {
    if (comment._reply) {
      if (_.get(comment, '_reply.name')) {
        return (
          <p className='text-size-fifth text-bold' style={{ marginBottom: 20 }}>
            {_.get(comment, '_reply.name')} (Instructor)
          </p>
        );
      }
    }
  };

  const commentReplyContent = (comment) => {
    if (comment._reply) {
      return (
        <p
          className='text-size-fifth text-bold'
          dangerouslySetInnerHTML={{ __html: _.get(comment, '_reply.content') }}
        />
      );
    }
  };

  const commentReply = (comment) => {
    if (comment._reply) {
      return (
        <div
          style={{
            marginBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 14,
            paddingBottom: 14,
            backgroundColor: '#EEE',
            borderRadius: 16
          }}>
          {commentReplyDate(comment)}
          {commentReplyName(comment)}
          {commentReplyContent(comment)}
          {commentMark(comment._reply)}
        </div>
      );
    }
  };

  const commentMark = (comment) => {
    return (
      <div>
        <span className='text-size-third'>Mark as:</span>
        <span>
          <Button
            color='primary'
            // primary={comment.helpful}
            onClick={() => {
              toggleHelpful(comment);
            }}>
            Helpful
          </Button>
        </span>
        <span>
          <Button
            onClick={() => {
              commentRemove(comment);
            }}>
            Delete
          </Button>
        </span>
      </div>
    );
  };

  // const listComment = (comment) => {
  //     return (
  //         <div>
  //             <br/>
  //             <Paper zDepth={1} style={{
  //                 width: '100%',
  //                 height: '100%',
  //                 marginBottom: 10,
  //                 overflow: 'hidden',
  //                 backgroundColor: '#FFF',
  //                 display: 'block'
  //             }}>
  //                 <div className="container-fluid">
  //                     <div className="row" style={{marginTop:20}}>
  //                         <div className="col-sm-5">
  //                             <div style={{marginLeft: 3, marginRight: 3, marginTop: 8, marginBottom: 8, overflow: 'hidden'}}>
  //                                 <div className="row">
  //                                     <div className="col-xs-4">
  //                                         {commentPicture(comment)}
  //                                     </div>
  //                                     <div className="col-xs-8">
  //                                         {commentDate(comment)}
  //                                         {commentName(comment)}
  //                                     </div>
  //                                 </div>
  //                             </div>
  //                         </div>
  //                         <div className="col-sm-7">
  //                             <div style={{textAlign: 'center'}}>
  //                                 <Rating
  //                                     placeholderRate={comment.rating}
  //                                     fractions={2}
  //                                     readonly={true}
  //                                     empty={<img alt='alt' src={`/public/assets/images/star-grey.png`} className="icon" />}
  //                                     placeholder={<img alt='' src={`/public/assets/images/star-yellow.png`} className="icon" />}
  //                                     full={<img alt='' src={`/public/assets/images/star-yellow.png`} className="icon" />}
  //                                 />
  //                             </div>
  //                             <div style={{marginLeft:10, marginRight:10,marginTop:12, marginBottom:12}}>
  //                                 {commentContent(comment)}
  //                                 {commentMark(comment)}
  //                                 <br/>
  //                                 {commentReply(comment)}
  //                             </div>
  //                         </div>
  //                     </div>
  //                 </div>
  //                 <br/>
  //             </Paper>
  //         </div>
  //     );
  // };

  const renderList = () => {
    const { page, limit } = this.state;

    if (!comments) return <div>&nbsp;</div>;
    if (page <= 0 || limit <= 0) return <div>&nbsp;</div>;

    return _.map(comments, (comment, i) => {
      return <div key={i}>{/* {listComment(comment)} */}</div>;
    });
  };

  const renderMore = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 15,
          marginBottom: 15
        }}>
        <button
          type='button'
          name='showmore'
          className='btn btn-lg btn-danger btn-block'
          onClick={(e) => {
            e.preventDefault();
            showMore();
          }}>
          Show More
        </button>
      </div>
    );
  };

  if (isLoading) {
    return <div>{renderState()}</div>;
  }

  return (
    <div>
      <div></div>
      <AlertDialog
        ref={(e) => (this._alert = e)}
        message='Are you sure ?'
        handleConfirm={deleteComment}
      />
      {renderDialog()}
      {commentAdd()}
      {renderList()}
      {renderMore()}
    </div>
  );
};

Comment.propTypes = {
  total: PropTypes.number,
  comments: PropTypes.string,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  logged: PropTypes.bool,
  fetchResetComment: PropTypes.func,
  fetchListComment: PropTypes.func,
  fetchRemoveComment: PropTypes.func,
  fetchToggleHelpful: PropTypes.func,
  fetchUserInfo: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    hasError: state.fetchCommentError,
    isLoading: state.fetchCommentLoading,
    comments: state.fetchCommentList.comments,
    total: state.fetchCommentList.total
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchResetComment: () => dispatch(resetComment()),
    fetchListComment: (course_no, page, limit) =>
      dispatch(listComment(course_no, page, limit)),
    fetchRemoveComment: (course_no, page, limit, comment_no) =>
      dispatch(removeComment(course_no, page, limit, comment_no)),
    fetchToggleHelpful: (course_no, page, limit, comment_no) =>
      dispatch(toggleHelpful(course_no, page, limit, comment_no)),
    fetchUserInfo: () => dispatch(userInfo())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Comment)
);
