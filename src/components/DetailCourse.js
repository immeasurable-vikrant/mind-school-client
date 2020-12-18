import _ from 'lodash';
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
import englishIcon from '../../public/assets/images/english.png';
import supportTeam from '../../public/assets/images/clock.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  detailCourseDescriptionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
    color: 'rgba(0, 0, 0, 0.9)',
    marginBottom: '4px'
  },
  detailCourseContainer: {
    margin: '16px'
  },
  courseDescription: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px'
  },
  spanCourseContent: {
    fontSize: '14px',
    color: '#3c3b37',
    lineHeight: '20px',
    fontWeight: '400',
    margin: '8px'
  },
  courseIncludes: {
    margin: '24px 0'
  },
  headingCourseIncludes: {
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px',
    color: '#3c3b37'
  },
  courseInstructor: {
    fontWeight: 700,
    fontSize: '24px',
    lineHeight: '29px',
    color: '#3c3b37'
  },
  authorImg: {
    height: '110px',
    width: '110px',
    borderRadius: '56px'
  },
  instructorCredentials: {
    display: 'flex',
    flexDirection: 'column'
  },
  instructorDetailsDiv: {
    display: 'flex'
  },
  instructorWrapper: {
    display: 'flex',
    flexDirection: 'column',
    margin: '8px'
  },
  authorStudents: {
    display: 'flex',
    margin: '4px 16px'
  },
  authorName: {
    fontSize: '19px',
    lineHeight: '23px',
    fontWeight: '700',
    color: '#094c59'
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
          <div className={classes.instructorWrapper}>
            <div className={classes.instructorDetailsDiv}>
              <img
                alt='alt'
                className={classes.authorImg}
                src={`${hostUrl}/images/${author.avatar}`}
              />
              <div className={classes.instructorCredentials}>
                <div className={classes.authorStudents}>
                  <span className='text-size-third text-bold'>
                    {author.average}
                  </span>
                  <span className='text-size-fourth'>Average rating</span>
                </div>
                <div className={classes.authorStudents}>
                  <i className='fa fa-home text-emphasis-second' />
                  <span className='text-size-third text-bold'>
                    {numberWithCommas(author.reviews)}
                  </span>{' '}
                  <span className='text-size-fourth'>Reviews</span>
                </div>
                <div className={classes.authorStudents}>
                  <span className='text-size-third text-bold'>
                    {numberWithCommas(author.students)}
                  </span>{' '}
                  <span className='text-size-fourth'>Students</span>
                </div>
                <div className={classes.authorStudents}>
                  <span className='text-size-third text-bold'>
                    {numberWithCommas(author.courses)}
                  </span>{' '}
                  <span className='text-size-fourth'>Courses</span>
                </div>
              </div>
            </div>
            <div>
              <div className={classes.authorName}>{author.name}</div>
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
        </Grid>
        <div className={classes.detailCourseContainer}>
          <hr />
          <div className='text-size-second text-bold'>
            <h2 className={classes.detailCourseDescriptionTitle}>
              Course description
            </h2>
          </div>
          <br />
          <ShowMore lines={5} more='Show more' less='Show less' anchorClass=''>
            <div
              className={classes.courseDescription}
              dangerouslySetInnerHTML={{
                __html: unescape(course.description)
              }}
            />
          </ShowMore>
          <hr />
          <div className='course-curriculum-div'>
            <h2 className={classes.detailCourseDescriptionTitle}>
              Course Content
            </h2>
            <p className={classes.spanCourseContent}>
              45 sections • 322 lectures • 32h 29 min length
            </p>
            <Curriculum />
            <hr />
            <div className={classes.courseIncludes}>
              <h2 className={classes.headingCourseIncludes}>
                This Course includes:
              </h2>
              <div className='cart-icons'>
                <img
                  className='img-icon-cart'
                  alt='rtyu'
                  src={englishIcon}
                  width='16px'
                  height='16px'
                />
                <span className='cart-subtitles'>English</span>
              </div>
              <div className='cart-icons'>
                <img
                  className='img-icon-cart'
                  alt='rtyu'
                  src={supportTeam}
                  width='16px'
                  height='16px'
                />
                <span className='cart-subtitles'>44 hr on demand video</span>
              </div>
              <div className='cart-icons'>
                <img
                  className='img-icon-cart'
                  alt='rtyu'
                  src={supportTeam}
                  width='16px'
                  height='16px'
                />
                <span className='cart-subtitles'>Access on mobile and TV</span>
              </div>
              <div className='cart-icons'>
                <img
                  className='img-icon-cart'
                  alt='rtyu'
                  src={supportTeam}
                  width='16px'
                  height='16px'
                />
                <span className='cart-subtitles'>Full time access</span>
              </div>
            </div>
          </div>
        </div>
        <div className='container'>
          <div className={classes.courseInstructor}>Course Instructor</div>
        </div>
        <div className='container'>{renderAuthor(course._authors)}</div>
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
