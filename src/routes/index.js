//library
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import composedAuth from '../middlewares/composedAuth';
import Loadable from 'react-loadable';
//redux
import reducers from '../reducers';
//components
import Footer from '../components/Footer';
import Header from '../components/Header';
import ListCart from '../components/ListCart';
import Lecture from '../components/Lecture';
import ViewLecture from '../components/ViewLecture';
import SocialGoogle from '../components/SocialGoogle';
import BecomeATeacher from '../components/BecomeATeacher/index';
//pageRoutes
import * as pageRoutes from './pageRoutes';

export const history = createBrowserHistory({
  forceRefresh: true,
});

export const LoadingComponent = ({ isLoading, error }) => {
  console.log('isLoading', isLoading, error);
  // Handle the Loading State
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, unable to load the page...</div>;
  } else {
    return null;
  }
};

export const App = Loadable({
  loader: () => import('../components/App'),
  loading: LoadingComponent,
});

export const SignUp = Loadable({
  loader: () => import('../auth/SignUp'),
  loading: LoadingComponent,
});

export const SignIn = Loadable({
  loader: () => import('../auth/SignIn'),
  loading: LoadingComponent,
});

// export const SignOut = Loadable({
//   loader: () => import('../auth/SignOut'),
//   loading: LoadingComponent,
// });

export const Details = Loadable({
  loader: () => import('../components/detail/Details'),
  loading: LoadingComponent,
});

export const DetailCourse = Loadable({
  loader: () => import('../components/DetailCourse'),
  loading: LoadingComponent,
});

export const ViewCourses = Loadable({
  loader: () => import('../components/ViewCourses'),
  loading: LoadingComponent,
});

export const store = createStore(reducers, applyMiddleware(thunk));

export const Routes = () => (
  <Router>
    <Header />
    <div>
      <Route exact path={pageRoutes.homePage} component={App} />
      <Route path={pageRoutes.signUp} component={SignUp} />
      <Route path={pageRoutes.signIn} component={SignIn} />
      <Route path={pageRoutes.details} component={Details} />
      <Route path={pageRoutes.detailCourse} component={DetailCourse} />
      <Route path={pageRoutes.listCart} component={composedAuth(ListCart)} />
      <Route path={pageRoutes.lecture} component={Lecture} />
      <Route path={pageRoutes.viewLecture} component={ViewLecture} />
      <Route path={pageRoutes.viewCourses} component={ViewCourses} />
      <Route path={pageRoutes.socialGoogle} component={SocialGoogle} />
      <Route path={pageRoutes.becomeATeacher} component={BecomeATeacher} />
    </div>
    <Footer />
  </Router>
);
