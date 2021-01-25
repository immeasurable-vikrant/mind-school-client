import _ from 'lodash';
import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchViewCourses } from '../../actions/view-courses';
import { userInfo } from '../../actions';
import { CircularProgress, Avatar, Grid, Typography } from '@material-ui/core';
import { hostUrl } from '../../../config';
import { makeStyles } from '@material-ui/core/styles';
import './index.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: '16px',
  },
  noCourse: {
    marginTop: '140px',
    marginBottom: '140px',
    fontSize: '22px',
    fontWeight: '500',
    lineHeight: '27px',
    color: '#3c3b37',
    textAlign: 'center',
  },
}));

const ViewCourses = ({
  courses,
  isLoading,
  hasError,
  fetchUserInfo,
  viewCourses,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [state, setState] = useState({
    dialogStyle: { display: 'none' },
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
        height: '100%',
      },
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
        <div className={classes.root}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                My Courses
              </Typography>
            </Grid>
          </Grid>
        </div>
      );
    }
  };

  const authorNames = (authors) => {
    return _.map(authors, (author, i) => {
      return (
        <div key={i} className="author-names">
          <span>
            <Avatar src={`${hostUrl}/images/${author.avatar}`} size={22} />
          </span>
          <span style={{margin: '8px'}}>{author.name}</span>
        </div>
      );
    });
  };

  const listCourse = (course) => {
    return (
      <div
        className='description-container-view-courses'
        onClick={(e) => handleCourse(e, course)}>
        <div className='img-container-view-courses'>
          <img src={`${hostUrl}/images/${course.picture}`} alt='imgUrl' className='course-picture'/>
        </div>
        <div className='description-titles-container-view-courses'>
          <span className='title-view-courses'>
            {authorNames(course._authors)}
          </span>
          <p className='subtitle-view-courses'>{course.title}</p>
          <p className='subtitle-view-courses'>{course.subtitle}</p>
        </div>
      </div>
    );
  };

  const listCourses = (lists) => {
    return _.map(lists, (course, i) => {
      return <div key={i}>{listCourse(course)}</div>;
    });
  };

  const renderList = () => {
    if (courses) {
      if (courses.length <= 0) {
        return (
          <div className={classes.noCourse}>There is no course right now.</div>
        );
      }

      const rows = _.map(courses, (course, i) => {
        if (i % 3 === 0) {
          const lists = _.slice(courses, i, i + 3);
          return <div key={i}>{listCourses(lists)}</div>;
        }
      });

      return (
        <div>
          <div>{rows}</div>
        </div>
      );
    }
  };

  const renderCourses = () => {
    if (isLoading) {
      return <div>{renderState()}</div>;
    }
    return (
      <Fragment>
        {renderTop()}
        {renderList()}
      </Fragment>
    );
  };

  return (
    <Fragment>
      {renderCourses()}
      <hr />
    </Fragment>
  );
};

ViewCourses.propTypes = {
  logged: PropTypes.bool,
  user: PropTypes.object,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  courses: PropTypes.array,
  viewCourses: PropTypes.func,
  fetchUserInfo: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    hasError: state.viewCoursesError,
    isLoading: state.viewCoursesLoading,
    courses: state.fetchViewCourses,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    viewCourses: () => dispatch(fetchViewCourses()),
    fetchUserInfo: () => dispatch(userInfo()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewCourses),
);
