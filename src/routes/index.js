import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import Loadable from 'react-loadable';
import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import composedAuth from '../middlewares/composedAuth';
// import App from '../components/app/App';
// import Details from '../components/detail/Details';
import reducers from '../reducers';
// import SignIn from '../auth/SignIn';
// import SignUp from '../auth/SignUp';
// import SignOut from '../auth/SignOut';
import ListCart from '../components/ListCart';
// import ViewCourses from '../components/courseview/ViewCourses';
// import DetailCourse from '../components/coursesdetails/DetailCourse';
import Lecture from '../components/Lecture';
import ViewLecture from '../components/ViewLecture';
import SocialGoogle from '../components/SocialGoogle';

export const history = createBrowserHistory({
  forceRefresh: true
});

export const LoadingComponent = ({isLoading, error}) => {

  // Handle the Loading State
  if(isLoading){
    return <div>Loading...</div>
  }
  // Handle the error state
  else if(error) {
    return <div>Sorry, unable to load the page...</div>
  }
  else {
    return null;
  }
}

export const App = Loadable({
  loader: () => import('../components/app/App'),
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

export const SignOut = Loadable({
  loader: () => import('../auth/SignOut'),
  loading: LoadingComponent,
});

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
    <div>
      <Route exact path='/' component={App} />
      <Route path='/signup' component={SignUp} />
      <Route path='/signin' component={SignIn} />
      <Route path='/signout' component={SignOut} />
      <Route path='/detail' component={Details} />
      <Route path={`/detail/:id`} component={DetailCourse} />
      <Route path='/list-cart' component={composedAuth(ListCart)} />
      <Route path='/lecture' component={Lecture} />
      <Route path={`/view-lecture/:url`} component={ViewLecture} />
      <Route path='/view-courses' component={ViewCourses} />
      <Route path='/social-google/:token ' component={SocialGoogle} />
    </div>
  </Router>
);
