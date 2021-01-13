import _ from "lodash";
import React, { Fragment, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Carousel from "react-elastic-carousel";
import Skeleton from "@material-ui/lab/Skeleton";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { randomSort } from "../../utility/randomSort";
import { paginate, paginateReset, paginateLoading } from "../../actions/course";
import CourseDetail from "../../common-components/courseDetail/courseDetail.component";
import "./index.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  text: {
    fontStyle: "helvetica",
    fontSize: "24px",
    lineHeight: "29px",
    color: "#3c3b37",
    fontWeight: "700",
    padding: "16px",
  },
}));

const HomePage = ({ isLoading, courses, hasError, fetchPaginate }) => {
  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  const [state, setState] = useState({
    keyword: "",
    limit: 9,
    sort: {},
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

  const breakPoints = [
    { width: 1, itemsToShow: 2 },
    { width: 550, itemsToShow: 2, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 },
  ];

  return hasError ? (
    <div className="alert alert-danger">
      <div style={{ textAlign: "center" }}>
        <strong>There was a loading error</strong>
      </div>
    </div>
  ) : (
    <Fragment>
      <h1 className={classes.text}>Browse All Courses</h1>
      <div className={classes.root}>
        {matches ? (
          <Fragment>
            <Carousel breakPoints={breakPoints}>
              {_.map(courses, (course, i) => {
                return !isLoading ? (
                  <div key={i}>
                    <CourseDetail course={course} />
                  </div>
                ) : (
                  <div>
                    <Skeleton variant="rect" width={210} height={118} />
                    <Skeleton animation="wave" width={210} />
                    <Skeleton animation="wave" width={210} />
                  </div>
                );
              })}
            </Carousel>
          </Fragment>
        ) : (
          <div className="horizontal_slider">
            <div className="slider_container">
              {_.map(courses, (course, i) => {
                return !isLoading ? (
                  <div key={i} className="item">
                    <CourseDetail course={course} />
                  </div>
                ) : (
                  <div key={i} className="item">
                    <Skeleton variant="rect" width={210} height={118} />
                    <Skeleton animation="wave" width={210} />
                    <Skeleton animation="wave" width={210} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

HomePage.propTypes = {
  isLoading: PropTypes.bool,
  hasError: PropTypes.string,
  courses: PropTypes.array,
  fetchPaginate: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    hasError: state.paginate.error,
    isLoading: state.paginate.loading,
    courses: state.paginate.courses,
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
  connect(mapStateToProps, mapDispatchToProps)(HomePage)
);
