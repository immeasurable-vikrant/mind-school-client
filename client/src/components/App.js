import React, { Fragment } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import HomePage from "./HomePage/index";
import Loader from "../common-components/loader/loader.component";
import HeroImage from "../common-components/heroImage/heroImage.component";
import WhyLearn from "./WhyLearn/index";
import BecomeTeacher from "./BecomeTeacher";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "16px",
  },
}));

const App = ({ auth, isLoading }) => {
  const classes = useStyles();
  return isLoading ? (
    <Loader />
  ) : (
    <Fragment>
      <HeroImage
        heading={`Welcome ${auth}`}
        subHeading="Keep learning in the moments that matter"
        description="Courses for every step of your career. Instructors with real-world experience."
      />
      <div className={classes.container}>
        <HomePage />
      </div>
      <hr />
      <WhyLearn />
      <hr />
      <div className={classes.container}>
        <HomePage />
      </div>
      <hr />
      <BecomeTeacher />
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth.user || "",
    // isLoading: state.paginate.loading,
  };
};

export default connect(mapStateToProps, null)(App);
