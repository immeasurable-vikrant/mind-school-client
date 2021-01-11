import _ from 'lodash';
import React, { useEffect, useState, Fragment } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import AutoSuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { signError } from '../actions';
import { useMediaQuery } from '@material-ui/core';
import { paginate, paginateReset, paginateLoading } from '../actions/course';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import { hostUrl } from '../../config';
// import HomeDescription from './HomeDescription';
import './style.css';

const rand = require('random-seed').create();
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  text: {
    fontStyle: 'helvetica',
    fontSize: '24px',
    lineHeight: '29px',
    color: '#3c3b37',
    fontWeight: '700',
    padding: '16px',
    // textAlign: 'center',
  },
  card: {
    width: '240px',
    height: '300px',
    backgroundColor: 'white',
    border: 'none',
  },
  cardButton: {
    border: 'none',
  },
  media: {
    height: 140,
  },
}));

const numberWithCommas = (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const HomePageSecondary = ({
  isLoading,
  total,
  page,
  courses,
  hasError,
  fetchPaginate,
}) => {
  const matches = useMediaQuery('(min-width:600px)');
  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = useState({
    dialogStyle: { display: 'none' },
    keyword: '',
    limit: 8,
    sort: {},
    suggestions: [],
  });

  const loadInitial = (keyword) => {
    const { limit } = state;

    const sort = randomSort();

    const callback = () => {
      setState({ sort });
    };

    fetchPaginate(keyword, 1, limit, sort, callback);
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const randomSort = () => {
    const type = [
      'title',
      'category',
      'average',
      'reviews',
      'enrolled',
      'price',
    ];
    const sort_type = type[rand(type.length)];
    const order = [1, -1];
    const sort_order = order[rand(order.length)];

    return {
      field: sort_type,
      value: sort_order,
    };
  };

  const handleDetail = (event, course) => {
    event.preventDefault();
    localStorage.setItem('course', course.no);
    history.push('/detail');
  };

  /* Search auto-suggest methods */
  const onSuggestionsClearRequested = () => {
    setState({
      suggestions: [],
    });
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setState({
      suggestions: getSuggestions(value),
    });
  };

  const getSuggestionValue = (suggestion) => suggestion;
  const renderSuggestion = (suggestion) => <span>{suggestion}</span>;

  const renderInputComponent = (inputProps) => (
    <div className='react-autosuggest__inputContainer'>
      <i className='fa fa-search react-autosuggest__icon' aria-hidden='true' />
      <input {...inputProps} />
    </div>
  );

  const onInputChange = (event, { newValue, method }) => {
    setState({ keyword: newValue });
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (!isLoading) {
      const { keyword } = state;
      loadInitial(keyword);
    }
  };

  /* Search UI component */
  const renderForm = () => {
    const { suggestions, keyword } = state;

    const inputProps = {
      placeholder: 'Please enter a keyword.',
      value: keyword,
      onChange: onInputChange,
    };

    return (
      <div>
        <form onSubmit={onFormSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <span>
              {/* <AutoSuggest
                suggestions={suggestions}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionSelected={(_, { suggestionValue }) =>
                  console.log('Selected: ' + suggestionValue)
                }
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={renderInputComponent}
                highlightFirstSuggestion={true}
              /> */}
            </span>
            <span>
              {/* <RaisedButton label='Search' type='submit' primary={true} /> */}
            </span>
          </div>
        </form>
      </div>
    );
  };

  const renderAuthor = (authors) => {
    return _.map(authors, (author, i) => {
      return (
        <div key={i}>
          {
            <div>
              <h5>{author.name}</h5>
              <h6>{`${numberWithCommas(author.students)} Students`}</h6>
            </div>
          }
        </div>
      );
    });
  };

  const courseDetail = (course) => {
    const text = `${numberWithCommas(
      course.enrolled,
    )} students enrolled, rating: ${course.average} (${numberWithCommas(
      course.reviews,
    )} reviews), Last updated ${dateFormat(course?.updated, 'm/yyyy')}`;

    return (
      <Card className={classes.card} onClick={(e) => handleDetail(e, course)}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={`${hostUrl}/images/${course.picture}`}
            title={course?.title}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {renderAuthor(course._authors)}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size='small' color='primary' className={classes.cardButton}>
            Learn More
          </Button>
        </CardActions>
      </Card>
    );
  };

  const renderCourses = () => {
    return _.map(courses, (course, i) => {
      return matches ? (
        <Grid item xs={3} key={i}>
          {courseDetail(course)}
        </Grid>
      ) : (
        <div key={i} className='item'>
          {courseDetail(course)}
        </div>
      );
    });
  };

  const renderLoading = () => {
    if (isLoading) {
      return <div style={state.dialogStyle}>loadingggg..........</div>;
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
    } else {
      return (
        <Fragment>
          <div>
            {matches ? (
              <Grid container spacing={3}>
                {renderCourses()}
              </Grid>
            ) : (
              // <Grid container spacing={3}>
              <div className='horizontal_slider'>
                <div className='slider_container'>{renderCourses()}</div>
              </div>
              // </Grid>
            )}
          </div>
          <div
            style={{
              marginTop: 30,
              marginBottom: 30,
            }}>
            {renderLoading()}
          </div>
        </Fragment>
      );
    }
  };
  return (
    <Fragment>
      {/* <HomeDescription /> */}
      {renderForm()}
      <h1 className={classes.text}>Browse Hindi Courses</h1>
      <div className={classes.root}>{renderState()}</div>
    </Fragment>
  );
};

HomePageSecondary.propTypes = {
  isLoading: PropTypes.bool,
  hasError: PropTypes.string,
  course: PropTypes.array,
  courses: PropTypes.array,
  total: PropTypes.number,
  page: PropTypes.number,
  fetchPaginate: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    hasError: state.paginate.error,
    isLoading: state.paginate.loading,
    courses: state.paginate.courses,
    total: state.paginate.total,
    page: state.paginate.page,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPaginate: (keyword, page, limit, sort, callback) =>
      dispatch(paginate(keyword, page, limit, sort, callback)),
    paginateReset: () => dispatch(paginateReset()),
    paginateLoading: (loading) => dispatch(paginateLoading(loading)),
    signError: (error) => dispatch(signError(error)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomePageSecondary),
);
