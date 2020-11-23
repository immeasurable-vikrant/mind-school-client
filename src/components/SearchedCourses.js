import _ from 'lodash';
import React, { useEffect, useState, Fragment } from 'react';
import useAutocomplete from 'use-autocomplete';
import dateFormat from 'dateformat';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { signError } from '../actions';
import { paginate, paginateReset, paginateLoading } from '../actions/course';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { hostUrl } from '../../config';
const rand = require('random-seed').create();

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  media: {
    height: 140
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

const SearchedCourses = ({
  hasError,
  courses,
  total,
  page,
  isLoading,
  getPaginate,
  fetchPaginateLoading,
  fetchPaginateReset,
  fetchSignError
}) => {
  const testWords = [
    'Android',
    'Angular',
    'ASP',
    'ASP.NET',
    'C',
    'C++',
    'C#',
    'iOS',
    'Java',
    'JavaScript',
    'JSP',
    'NodeJS',
    'Objective C',
    'Perl',
    'PHP',
    'Python',
    'React',
    'React Native',
    'Ruby',
    'Swift'
  ];

  const numberWithCommas = (x) => {
    const parts = parseInt(x, 10).toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const randomSort = () => {
    const type = [
      'title',
      'category',
      'average',
      'reviews',
      'enrolled',
      'price'
    ];
    const sort_type = type[rand(type.length)];
    const order = [1, -1];
    const sort_order = order[rand(order.length)];

    return {
      field: sort_type,
      value: sort_order
    };
  };
  const history = useHistory();
  const [state, setState] = useState({
    limit: 3,
    sort: {}
  });
  const classes = useStyles();
  const [textState, setTextState] = useState('');
  const [completions] = useAutocomplete(textState, testWords);

  // useEffect(() => {
  // 	loadInitialSearch('');
  // }, []);

  const loadInitialSearch = (textState) => {
    // fetchPaginateLoading(true);

    // fetchSignError('');

    // fetchPaginateReset();

    const { limit } = state;
    const sort = randomSort();
    const self = this;
    const callback = () => {
      self.setState({ sort });
    };
    getPaginate(textState, 1, limit, sort, callback);
    // history.pushState('/search-results');
  };

  const onSearchSubmit = (event) => {
    console.log('CLICKED');
    event.preventDefault();

    // if (!isLoading) {
    loadInitialSearch(textState);
    // }
  };

  const courseDetail = (course) => {
    const text = `${numberWithCommas(
      course.enrolled
    )} students enrolled, rating: ${course.average} (${numberWithCommas(
      course.reviews
    )} reviews), Last updated ${dateFormat(course?.updated, 'm/yyyy')}`;

    return (
      <Card className={classes.root} onClick={(e) => handleDetail(e, course)}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={`${hostUrl}/images/${course.picture}`}
            title={course?.title}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='h2'>
              {/* {renderAuthor(course._authors)} */}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size='small' color='primary'>
            Share
          </Button>
          <Button size='small' color='primary'>
            Learn More
          </Button>
        </CardActions>
      </Card>
    );
  };
  const renderCourses = () => {
    return _.map(courses, (course, i) => {
      return (
        <Grid item xs={3} key={i}>
          {courseDetail(course)}
        </Grid>
      );
    });
  };

  const renderLoading = () => {
    if (isLoading) {
      return <div>loadingggg..........</div>;
    }
  };

  const renderState = () => {
    // if (hasError) {
    //   return (
    // 	<div className='alert alert-danger'>
    // 	  <div style={{ textAlign: 'center' }}>
    // 		<strong>There was a loading error</strong>
    // 	  </div>
    // 	</div>
    //   );
    // } else {
    // 	console.log('renderState>>>>>>>>>>>>>>>', courses)
    return (
      <Fragment>
        <div className={classes.root}>
          <Grid container spacing={3}>
            <h2>hello cruel world</h2>
            {renderCourses()}
          </Grid>
        </div>
        <div
          style={{
            marginTop: 30,
            marginBottom: 30
          }}>
          {renderLoading()}
        </div>
      </Fragment>
    );
    // }
  };

  return (
    <Fragment>
      <div style={{ backgroundColor: 'red' }}>
        <form>
          <input
            type='text'
            value={textState}
            onChange={(e) => setTextState(e.target.value)}
          />
          {/* <Button type='submit'>Search</Button> */}
        </form>
        <div>
          {completions.map((val, index) => (
            <p key={index} onClick={onSearchSubmit}>
              {val}
            </p>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: 'green', margin: '20px' }}>
        {renderState()}
      </div>
    </Fragment>
  );
};

SearchedCourses.propTypes = {
  hasError: PropTypes.string,
  isLoading: PropTypes.bool,
  total: PropTypes.number,
  courses: PropTypes.object,
  page: PropTypes.number,
  paginate: PropTypes.number,
  fetchPaginate: PropTypes.func,
  fetchPaginateReset: PropTypes.func,
  fetchPaginateLoading: PropTypes.func,
  fetchSignError: PropTypes.func
};

const mapStateToProps = (state) => {
  // console.log('state>>>>>>>>>>>>>>>>>>>>>>>>>>.', state)
  return {
    hasError: state.paginate.error,
    isLoading: state.paginate.loading,
    courses: state.paginate.courses,
    total: state.paginate.total,
    page: state.paginate.page
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getPaginate: (keyword, page, limit, sort, callback) =>
      dispatch(paginate(keyword, page, limit, sort, callback)),
    fetchPaginateReset: () => dispatch(paginateReset()),
    fetchPaginateLoading: (loading) => dispatch(paginateLoading(loading)),
    fetchSignError: (error) => dispatch(signError(error))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchedCourses)
);
