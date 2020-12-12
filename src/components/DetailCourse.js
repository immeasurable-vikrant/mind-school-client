import _ from 'lodash';
import dateFormat from 'dateformat';
import { hostUrl } from '../../config';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchDetailCourse } from '../actions/course';
import { CircularProgress } from '@material-ui/core';
import Footer from './Footer';
import ShowMore from 'react-show-more';
import Header from './Header';
import CartBanner from './CartBanner';
import Curriculum from './Curriculum';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  }
}));

const numberWithCommas = (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const DetailCourse = ({
  course,
  isLoading,
  match,
  hasError,
  getDetailCourse
}) => {
  const classes = useStyles();
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
    window.scrollTo(0, 0);
    getDetailCourse(match?.params?.id);
  }, [getDetailCourse, match]);

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
        <div style={state.dialogStyle}>
          <CircularProgress size={60} thickness={7} />
        </div>
      );
    }
  };

  const authorNames = (authors) => {
    return _.map(authors, (author, i) => {
      let decorator = ', ';
      if (i === authors.length - 1) {
        decorator = '';
      }
      return (
        <span key={i}>
          <a href='/' className='text-emphasis-first'>
            {author.name}
          </a>
          <a href='/' className='text-black'>
            {decorator}
          </a>
        </span>
      );
    });
  };

  const renderAuthor = (authors) => {
    return _.map(authors, (author, i) => {
      let decorator = '<br/>';
      if (i === authors.length - 1) {
        decorator = '';
      }
      return (
        <div key={i}>
          <div className='row'>
            <div className='col-sm-1' />
            <div className='col-sm-4'>
              <div>
                <img alt='alt' src={`${hostUrl}/images/${author.avatar}`} />
              </div>
              <br />
              <div>
                <span className='text-size-third text-bold'>
                  {author.average}
                </span>{' '}
                <span className='text-size-fourth'>Average rating</span>
              </div>
              <div>
                <i className='fa fa-home text-emphasis-second' />
                <span className='text-size-third text-bold'>
                  {numberWithCommas(author.reviews)}
                </span>{' '}
                <span className='text-size-fourth'>Reviews</span>
              </div>
              <div>
                <span className='text-size-third text-bold'>
                  {numberWithCommas(author.students)}
                </span>{' '}
                <span className='text-size-fourth'>Students</span>
              </div>
              <div>
                <span className='text-size-third text-bold'>
                  {numberWithCommas(author.courses)}
                </span>{' '}
                <span className='text-size-fourth'>Courses</span>
              </div>
              <br />
            </div>
            <div className='col-sm-6'>
              <div className='text-size-fifth text-emphasis-fourth text-bold'>
                {author.name}
              </div>
              <div className='text-size-sixth'>
                <ShowMore
                  lines={5}
                  more='Show more'
                  less='Show less'
                  anchorClass=''>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: unescape(author.description)
                    }}
                  />
                </ShowMore>
              </div>
            </div>
            <div className='col-sm-1' />
          </div>
          <div className='row'>
            <div className='text-black'>{decorator}</div>
          </div>
        </div>
      );
    });
  };

  const renderCourse = () => {
    if (!course) return <div>&nbsp;</div>;

    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <CartBanner authorNames={authorNames} course={course} />
          </Grid>
          <Grid xs={12}>
            <div className='text-black text-size-third'>
              rating:{' '}
              <span className='text-emphasis-first'>{course.average}</span> (
              <span className='text-emphasis-second'>
                {numberWithCommas(course.reviews)}
              </span>{' '}
              reviews)
            </div>
            <div className='text-black text-size-third text'>
              <span className='text-emphasis-third'>
                {numberWithCommas(course.enrolled)}
              </span>{' '}
              students enrolled
            </div>
            <div className='text-black text-size-third text'>
              Created by {authorNames(course._authors)}
            </div>
            <div className='text-black text-size-third text'>
              Last updated{' '}
              <span className='text-emphasis-third'>
                {dateFormat(course.updated, 'm/yyyy')}
              </span>
            </div>
          </Grid>
        </Grid>
        <div className='container'>
          <div className='row body-content'>
            <div className='col-sm-offset-1 col-sm-10'>
              <br />
              <br />
              <div className='text-size-second text-bold'>Description</div>
              <br />
              <ShowMore
                lines={5}
                more='Show more'
                less='Show less'
                anchorClass=''>
                <div
                  dangerouslySetInnerHTML={{
                    __html: unescape(course.description)
                  }}
                />
              </ShowMore>
              <br />
              <br />
              <Curriculum />
            </div>
          </div>
        </div>
        <div className='container'>
          <div className='row body-content'>
            <div className='col-sm-offset-1 col-sm-10'>
              <br />
              <br />
              <div className='text-size-second text-bold text-center'>
                About the Instructor
              </div>
            </div>
          </div>
          <br />
        </div>
        <div className='container'>
          {renderAuthor(course._authors)}
          <br />
        </div>
        <br />
        {/* <div className='container'> <Comment/> </div> */}
        {/* </div> */}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div style={{ backgroundColor: 'darkgray' }}>{renderState()}</div>
      <div>{renderCourse()}</div>
      <Footer />
    </div>
  );
};

DetailCourse.propTypes = {
  course: PropTypes.object,
  isLoading: PropTypes.bool,
  match: PropTypes.object,
  hasError: PropTypes.bool,
  getDetailCourse: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    course: state.fetchDetailCourseDone,
    hasError: state.fetchCourseFailure,
    isLoading: state.fetchCourseLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDetailCourse: (course_no) => dispatch(fetchDetailCourse(course_no))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailCourse)
);
