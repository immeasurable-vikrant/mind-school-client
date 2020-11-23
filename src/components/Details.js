import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchDetailCourse } from '../actions/course';
import { fetchLecture } from '../actions/lecture';

const Details = ({ detailCourse, lectureCourse }) => {
  const history = useHistory();

  useEffect(() => {
    const course_no = localStorage.getItem('course');
    if (course_no) {
      detailCourse(course_no);
      lectureCourse(course_no);
      history.push(`/detail/${course_no}`);
    }
  }, [detailCourse, lectureCourse, history]);

  return <div />;
};

Details.propTypes = {
  detailCourse: PropTypes.func,
  lectureCourse: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    detailCourse: (course_no) => dispatch(fetchDetailCourse(course_no)),
    lectureCourse: (course_no) => dispatch(fetchLecture(course_no)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(Details));
