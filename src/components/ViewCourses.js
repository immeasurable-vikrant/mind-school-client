import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchViewCourses } from '../actions/view-courses';
import { userInfo } from '../actions';
import { CircularProgress, Paper, Avatar } from '@material-ui/core';
import Equalizer from 'react-equalizer';
import { hostUrl } from '../../config';
import Header from './Header';
import Footer from './Footer';

const ViewCourses = ({
  courses,
  isLoading,
  hasError,
  fetchUserInfo,
  viewCourses
}) => {
  const history = useHistory();
  const [state, setState] = useState({
    dialogStyle: { display: 'none' }
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
    viewCourses();
  }, [viewCourses, fetchUserInfo]);

  const handleCourse = (event, course) => {
    event.preventDefault();
    localStorage.setItem('course', course.no);
    console.log('localStorage', localStorage.setItem);
    history.push('/detail');
  };

  const renderState = () => {
    if (hasError) {
      return (
        <div className='alert alert-danger'>
          <div style={{ textAlign: 'center' }}>
            <strong style={{ color: 'red' }}>There was a loading error</strong>
          </div>
        </div>
      );
    }
    if (isLoading) {
      return (
        <div style={state.dialogStyle}>
          <CircularProgress size={60} thickness={7} />
        </div>
      );
    }
  };

  const renderTop = () => {
    if (courses) {
      return (
        <div
          style={{ width: '100%', backgroundColor: 'rgba(33, 33, 33, 0.9)' }}>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-sm-12'>
                <br />
                <div className='text-size-second text-bold text-white'>
                  <span>My Courses</span>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const authorNames = (authors) => {
    return _.map(authors, (author, i) => {
      return (
        <div key={i} style={{ marginBottom: 6 }}>
          <span>
            <Avatar src={`${hostUrl}/images/${author.avatar}`} size={22} />
          </span>
          <span> {author.name}</span>
        </div>
      );
    });
  };

  const listCourse = (course) => {
    console.log('course', course);
    return (
      <div
        onClick={(e) => handleCourse(e, course)}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }}>
        <Paper
          // zDepth={1}
          style={{
            width: '100%',
            height: '100%',
            padding: 10,
            margin: 10,
            backgroundColor: '#FFF'
          }}>
          <div
            style={{
              marginLeft: 3,
              marginRight: 3,
              marginTop: 12,
              marginBottom: 8,
              overflow: 'hidden'
            }}>
            <img
              style={{ width: '100%', height: '100%' }}
              alt='altImg'
              src={`${hostUrl}/images/${course.picture}`}
            />
          </div>
          <hr />
          <div className='text-size-fifth'>{authorNames(course._authors)}</div>
          <hr />
          <div className='text-size-fifth text-bold'>{course.title}</div>
          <div className='text-size-fifth'>{course.subtitle}</div>
        </Paper>
      </div>
    );
  };

  const listCourses = (lists) => {
    return _.map(lists, (course, i) => {
      return (
        <div key={i} className='col-sm-4'>
          {listCourse(course)}
        </div>
      );
    });
  };

  const renderList = () => {
    if (courses) {
      if (courses.length <= 0) {
        return (
          <div
            className='text-size-second text-bold text-center'
            style={{ marginTop: 140, marginBottom: 140, color: 'red' }}>
            There is no course right now.
          </div>
        );
      }

      const rows = _.map(courses, (course, i) => {
        if (i % 3 === 0) {
          const lists = _.slice(courses, i, i + 3);
          return (
            <div key={i} className='row' style={{ marginBottom: 20 }}>
              <Equalizer byRow={true}>{listCourses(lists)}</Equalizer>
            </div>
          );
        }
      });

      return (
        <div>
          <br />
          <div>{rows}</div>
          <br />
        </div>
      );
    }
  };

  const renderCourses = () => {
    if (isLoading) {
      return <div>{renderState()}</div>;
    }

    return (
      <div>
        {renderTop()}
        {renderList()}
      </div>
    );
  };

  return (
    <div>
      <Header />
      {renderCourses()}
      <Footer />
    </div>
  );
};

ViewCourses.propTypes = {
  logged: PropTypes.bool,
  user: PropTypes.object,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  courses: PropTypes.array,
  viewCourses: PropTypes.func,
  fetchUserInfo: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    hasError: state.viewCoursesError,
    isLoading: state.viewCoursesLoading,
    courses: state.fetchViewCourses
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    viewCourses: () => dispatch(fetchViewCourses()),
    fetchUserInfo: () => dispatch(userInfo())
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewCourses)
);
