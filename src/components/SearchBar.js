import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button
} from '@material-ui/core';
import { withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { signError } from '../actions';
import { paginate, paginateReset, paginateLoading } from '../actions/course';
const rand = require('random-seed').create();

const numberWithCommas = (x) => {
  const parts = parseInt(x, 10).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'C#',
    year: 2000
  },
  {
    name: 'C++',
    year: 1983
  },
  {
    name: 'Clojure',
    year: 2007
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Go',
    year: 2009
  },
  {
    name: 'Haskell',
    year: 1990
  },
  {
    name: 'Java',
    year: 1995
  },
  {
    name: 'Javascript',
    year: 1995
  },
  {
    name: 'Perl',
    year: 1987
  },
  {
    name: 'PHP',
    year: 1995
  },
  {
    name: 'Python',
    year: 1991
  },
  {
    name: 'Ruby',
    year: 1995
  },
  {
    name: 'Scala',
    year: 2003
  }
];

const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return;

  inputLength === 0
    ? []
    : languages.filter(
        (lang) => lang.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};

const getSuggestionValue = (suggestion) => suggestion.name;
const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

const renderInputComponent = (inputProps) => (
  <div className='react-autosuggest__inputContainer'>
    <i className='fa fa-search react-autosuggest__icon' aria-hidden='true' />
    <input {...inputProps} />
  </div>
);

const SearchBar = ({
  hasError,
  isLoading,
  total,
  courses,
  page,
  fetchPaginate,
  fetchPaginateReset,
  fetchPaginateLoading,
  fetchSignError
}) => {
  const [state, setState] = useState({
    dialogStyle: { display: 'none' },
    limit: 5,
    sort: {},
    value: '',
    suggestions: []
  });

  const history = useHistory();

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
    loadInitial('');
  }, []);

  const loadInitial = (keyword) => {
    fetchPaginateLoading(true);

    fetchSignError('');

    fetchPaginateReset();

    const { limit } = state;
    const sort = randomSort();
    const self = this;
    const callback = () => {
      self.setState({ sort });
    };
    fetchPaginate(keyword, 1, limit, sort, callback);
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

  const infiniteScroll = () => {
    if (!isLoading) {
      const { keyword, limit, sort } = state;
      const _page = page + 1;

      if (_page > 0 && _page <= total) {
        paginate(keyword, _page, limit, sort, null);
      }
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setState({
      suggestions: getSuggestions(value)
    });
  };

  const onSuggestionsClearRequested = () => {
    setState({
      suggestions: []
    });
  };

  const onFormSubmit = (event) => {
    console.log('CLICKED');
    event.preventDefault();

    if (!isLoading) {
      const { keyword } = state;
      loadInitial(keyword);
    }
  };

  const handleKeyword = (e) => {
    setState({ keyword: e.target.value });
  };

  const renderForm = () => {
    const { suggestions } = state;
    // const inputProps = {
    // 	placeholder: 'Please enter a keyword.',
    // 	value: state.keyword,
    // 	onChange: onInputChange,
    // };

    const onChange = (event, { newValue }) => {
      setState({
        value: newValue
      });
    };
    const inputProps = {
      placeholder: 'Type a programming language',
      value: state.value,
      onChange
    };

    return (
      <div style={{ backgroundColor: 'red' }}>
        <form onSubmit={onFormSubmit}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <span>
              {/* <Autosuggest
								suggestions={suggestions}
								onSuggestionsFetchRequested={onSuggestionsFetchRequested}
								onSuggestionsClearRequested={onSuggestionsClearRequested}
								getSuggestionValue={getSuggestionValue}
								renderSuggestion={renderSuggestion}
								inputProps={inputProps}
								renderInputComponent={renderInputComponent}
							/> */}
            </span>
            <span>
              <Button type='submit'>Search</Button>
            </span>
          </div>
        </form>
      </div>
    );
  };

  // const handleDetail = (event, course) => {
  // 	event.preventDefault();

  // 	localStorage.setItem('course', course.no);
  // 	history.push('/detail');
  // };

  // const renderAuthor = (authors) => {
  // 	return _.map(authors, (author, i) => {
  // 		return (
  // 			<div key={i}>
  // 				{
  // 					<CardHeader
  // 						title={author.name}
  // 						subtitle={`${numberWithCommas(author.students)} Students`}
  // 						avatar={`${hostUrl}/images/${author.avatar}`}
  // 					/>
  // 				}
  // 			</div>
  // 		);
  // 	});
  // };

  // const courseDetail = (course) => {
  // 	const text = `${numberWithCommas(
  // 		course.enrolled,
  // 	)} students enrolled, rating: ${course.average} (${numberWithCommas(
  // 		course.reviews,
  // 	)} reviews), Last updated ${dateFormat(course.updated, 'm/yyyy')}`;
  // 	return (
  // 		<div onClick={(e) => handleDetail(e, course)}>
  // 			<Card>
  // 				{renderAuthor(course._authors)}
  // 				<CardMedia overlay={<CardTitle title={course.title} subtitle={text} />}>
  // 					<img src={`${hostUrl}/images/${course.picture}`} alt='' />
  // 				</CardMedia>
  // 				<CardActions>{/* <FlatButton label='Read More...' /> */}</CardActions>
  // 			</Card>
  // 		</div>
  // 	);
  // };

  // const renderCourses = () => {
  // 	return _.map(courses, (course, i) => {
  // 		return <div key={i}>{courseDetail(course)}</div>;
  // 	});
  // };

  // const renderLoading = () => {
  // 	if (isLoading) {
  // 		return (
  // 			<div style={state.dialogStyle}>
  // 				<CircularProgress color='orange' size={60} thickness={7} />
  // 			</div>
  // 		);
  // 	}
  // };

  // const renderState = () => {
  // 	if (hasError) {
  // 		return (
  // 			<div className='alert alert-danger'>
  // 				<div style={{ textAlign: 'center' }}>
  // 					<strong>There was a loading error</strong>
  // 				</div>
  // 			</div>
  // 		);
  // 	} else {
  // 		return (
  // 			<div>
  // 				<div
  // 					style={{
  // 						marginTop: 30,
  // 						marginBottom: 30,
  // 						marginLeft: 20,
  // 						marginRight: 20,
  // 					}}>
  // 					Search Results
  // 					<br />
  // 				</div>
  // 				<div
  // 					style={{
  // 						marginTop: 30,
  // 						marginBottom: 30,
  // 					}}>
  // 					{renderCourses()}
  // 				</div>
  // 				<div
  // 					style={{
  // 						marginTop: 30,
  // 						marginBottom: 30,
  // 					}}>
  // 					{renderLoading()}
  // 				</div>
  // 			</div>
  // 		);
  // 	}
  // };

  // const renderButton = () => {
  // 	return (
  // 		<div
  // 			style={{
  // 				display: 'flex',
  // 				justifyContent: 'center',
  // 				margin: 10,
  // 			}}>
  // 			<button
  // 				type='button'
  // 				name='loadmore'
  // 				className='btn btn-lg btn-danger'
  // 				onClick={(e) => {
  // 					e.preventDefault();
  // 					infiniteScroll();
  // 				}}>
  // 				Load More
  // 			</button>
  // 		</div>
  // 	);
  // };

  return (
    <div>
      <div
        style={{
          marginTop: 20,
          marginBottom: 20
        }}>
        {renderForm()}
      </div>
      {/* <div
				style={{
					marginTop: 30,
					marginBottom: 30,
				}}>
				{renderState()}
			</div>
			<div
				style={{
					marginTop: 30,
					marginBottom: 30,
				}}>
				{renderButton()}
			</div> */}
    </div>
  );
};

SearchBar.propTypes = {
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
    fetchPaginate: (keyword, page, limit, sort, callback) =>
      dispatch(paginate(keyword, page, limit, sort, callback)),
    fetchPaginateReset: () => dispatch(paginateReset()),
    fetchPaginateLoading: (loading) => dispatch(paginateLoading(loading)),
    fetchSignError: (error) => dispatch(signError(error))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchBar)
);
