import React, { Component } from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signError, logIn } from '../actions';

import TextInput from '../components/TextInput';
// import centerComponent from 'react-center-component';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { hostUrl } from '../../config';

// @centerComponent
class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // muiTheme: getMuiTheme(),
      dialogStyle: { display: 'none' },
      isSubmitting: false,
    };
  }

  static childContextTypes = {
    muiTheme: PropTypes.object,
  };

  getChildContext() {
    return { muiTheme: this.state.muiTheme };
  }

  static propTypes = {
    topOffset: PropTypes.number,
    leftOffset: PropTypes.number,
  };

  componentDidMount() {
    this.setState({
      dialogStyle: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 0,
        marginRight: 0,
        width: '100%',
        height: '100%',
        top: this.props.topOffset,
        left: this.props.leftOffset,
      },
    });
  }

  componentWillMount() {
    this.props.signError('');
  }

  submitForm = (e) => {
    e.preventDefault();

    const { isSubmitting } = this.state;

    if (isSubmitting) return;

    const { redirect } = this.props;
    const email = $('#email').val();
    const password = $('#password').val();

    if (email && password) {
      if (email.length > 0 && password.length > 0) {
        if (!isSubmitting) {
          $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
          this.setState({ isSubmitting: true });
        }

        const failed = () => {
          $('#submit').html('Submit');
          this.setState({ isSubmitting: false });
        };

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        return sleep(300).then(() => {
          this.props.Login({ email, password, redirect, failed });
        });
      }
    }
  };

  signError = () => {
    if (this.props.error) {
      return (
        <div className='alert alert-danger'>
          <strong>{this.props.error}</strong>
        </div>
      );
    }
  };

  validateEmail = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address';
    }

    return error;
  };

  validatePassword = (value) => {
    let error = '';
    if (!value || value.length <= 0) {
      error = 'Required';
    } else if (value.length < 4) {
      error = 'Must be 4 characters or more';
    } else if (value.length > 15) {
      error = 'Must be 15 characters or less';
    }

    return error;
  };

  reset = () => {
    this._email.reset();
    this._password.reset();
  };

  renderSocial = () => {
    return (
      <div
        style={{
          marginTop: 10,
        }}>
        <div
          style={{
            marginBottom: 10,
          }}>
          <a href={`${hostUrl}/auth/google`}>
            <button
              type='button'
              name='google'
              className='btn btn-lg btn-default'
              style={{ width: '310px' }}>
              <i className='fa fa-google-plus social google' />
              Login with Google+
            </button>
          </a>
        </div>
      </div>
    );
  };

  renderHeader = () => {
    if (!this.props.dialog) {
      return <Header />;
    }
  };

  renderFooter = () => {
    if (!this.props.dialog) {
      return <Footer />;
    }
  };

  render() {
    return (
      <div>
        {this.renderHeader()}
        <div style={{ textAlign: 'center' }}>{this.signError()}</div>
        <div style={this.state.dialogStyle}>
          <form onSubmit={(e) => this.submitForm(e)}>
            <TextInput
              ref={(e) => (this._email = e)}
              label='Email'
              name='email'
              type='text'
              validate={this.validateEmail}
            />
            <TextInput
              ref={(e) => (this._password = e)}
              label='Password'
              name='password'
              type='password'
              validate={this.validatePassword}
              placeholder='Please enter a password'
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                id='submit'
                type='submit'
                value='Submit'
                name='submit'
                className='btn btn-lg btn-primary'>
                Submit
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                type='button'
                value='Clear'
                name='clear'
                className='btn btn-lg btn-default'
                onClick={(e) => {
                  e.preventDefault();
                  this.props.signError('');
                  this.reset();
                }}>
                Clear
              </button>
              &nbsp;&nbsp;&nbsp;
              <button
                type='button'
                value='Sign Up'
                name='signup'
                className='btn btn-lg btn-danger'
                onClick={(e) => {
                  e.preventDefault();
                  this.props.history.push('/signup');
                }}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
        <div style={this.state.dialogStyle}>{this.renderSocial()}</div>
        <div style={{ marginBottom: 40 }}>&nbsp;</div>
        {this.renderFooter()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { error: state.auth.error };
}

const mapDispatchToProps = (dispatch) => {
  return {
    signError: (error) => dispatch(signError(error)),
    Login: ({ email, password, redirect, failed }) =>
      dispatch(logIn({ email, password, redirect, failed })),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));

// import React, {useState, useEffect, Fragment} from 'react'
// import PropTypes from 'prop-types'
// import { withRouter, useHistory } from 'react-router'
// import {connect} from 'react-redux'
// import {signError, logIn} from '../actions'
// import TextInput from '../components/TextInput'
// import Header from '../components/Header'
// // import Footer from '../components/footer'
// import {hostUrl} from '../../config'
// import {
//     AppBar,
//     colors,
//     Avatar,
//     CssBaseline,
//     ThemeProvider,
//     Typography,
//     Container,
//     createMuiTheme,
//     Box,
//     Grid,
//     makeStyles,
//     Button,
//     FormControlLabel,
//     Checkbox,
//     TextField,
//     Link } from '@material-ui/core'
// // const {
// //     AppBar,
// //     colors,
// //     Avatar,
// //     CssBaseline,
// //     ThemeProvider,
// //     Typography,
// //     Container,
// //     createMuiTheme,
// //     Box,
// //     Grid,
// //     makeStyles,
// //     Button,
// //     SvgIcon,
// //     FormControlLabel,
// //     Checkbox,
// //     AutoComplete,
// //     TextField,
// //     Link
// //   } = MaterialUI;
// const theme = createMuiTheme({
//     palette: {
//       primary: {
//         main: "#556cd6"
//       },
//       secondary: {
//         main: "#19857b"
//       },
//       error: {
//         main: colors.red.A400
//       },
//       background: {
//         default: "#fff"
//       }
//     }
//   });

// const useStyles = makeStyles((theme) => ({
//     paper: {
//       marginTop: theme.spacing(8),
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center"
//     },
//     avatar: {
//       margin: theme.spacing(1),
//       backgroundColor: theme.palette.secondary.main
//     },
//     form: {
//       width: "100%", // Fix IE 11 issue.
//       marginTop: theme.spacing(3)
//     },
//     submit: {
//       margin: theme.spacing(3, 0, 2)
//     }
//   }));

// const SignIn = ({dialog, fetchSignError, fetchLogin, isSubmitting, redirect, error}) => {

//     const history = useHistory()
//     const [state, setState] = useState({
//         dialogStyle:{display:'none'},
//         isSubmitting: false
//     })

//     useEffect(() => {
//         setState({
//         dialogStyle: {
//             display: 'flex',
//             justifyContent: 'center',
//             marginTop: 20,
//             marginBottom: 20,
//             marginLeft: 0,
//             marginRight: 0,
//             width: '100%',
//             height: '100%'
//             }
//         });
//     }, [])

//     useEffect(() => {
//      fetchSignError('')
//         return () => {
//         fetchSignError('')
//         }
//     }, [fetchSignError])

//     const submitForm = (e) => {
//         e.preventDefault();
//         if(isSubmitting) return;
//         const email = $('#email').val();
//         const password = $('#password').val();

//         if (email && password) {
//             if (email.length > 0 && password.length > 0) {
//                 if(!isSubmitting) {
//                     $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
//                     setState({isSubmitting:true});
//                 }
//                 const failed = () => {
//                     $('#submit').html('Submit');
//                     setState({isSubmitting:false});
//                 };
//                 const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//                 return sleep(300).then(() => {
//                     fetchLogin({email, password, redirect, failed});
//                 });
//             }
//         }
//     };

//     const sigInError = () => {
//         if (error) {
//             return (
//                 <div className="alert alert-danger">
//                     <strong>{error}</strong>
//                 </div>
//             )
//         }
//     }

//     const validateEmail = (value) => {
//         let errors = '';
//         if (!value || value.length <= 0) {
//             errors = 'Required';
//         } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
//             errors = 'Invalid email address';
//         }

//         return errors;
//     };

//     const validatePassword = (value) => {
//         let errors = '';
//         if (!value || value.length <= 0) {
//             errors = 'Required';
//         } else if (value.length < 4) {
//             errors = 'Must be 4 characters or more';
//         } else if (value.length > 15) {
//             errors = 'Must be 15 characters or less';
//         }

//         return errors;
//     };

//     const reset = () => {
//         this._email.reset();
//         this._password.reset();
//     };

//     const renderSocial = () => {
//         return (
//             <div style={{
//                 marginTop: 10
//             }}>
//                 <div style={{
//                     marginBottom: 10
//                 }}>
//                     <a href={`${hostUrl}/auth/google`}>
//                     <button
//                         type="button"
//                         name="google"
//                         className="btn btn-lg btn-default"
//                         style={{width:'310px'}}>
//                         <i className="fa fa-google-plus social google"/>Login with Google+</button>
//                 </a>
//                 </div>
//             </div>
//         );
//     };

//     const renderHeader = () => {
//         if(!dialog) {
//             return <Header/>;
//         }
//     };

//     // const renderFooter = () => {
//     //     if(!dialog) {
//     //         // return <Footer/>;
//     //     }
//     // };
//     const classes = useStyles();
//     return (
//       <Fragment>
//       <Header />
//         <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <div className={classes.paper}>
//           <Avatar className={classes.avatar}></Avatar>
//           <Typography component="h1" variant="h5">
//             Sign up
//           </Typography>
//           <form className={classes.form} noValidate>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   autoComplete="fname"
//                   name="firstName"
//                   variant="outlined"
//                   required
//                   fullWidth
//                   id="firstName"
//                   label="First Name"
//                   autoFocus
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   variant="outlined"
//                   required
//                   fullWidth
//                   id="lastName"
//                   label="Last Name"
//                   name="lastName"
//                   autoComplete="lname"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   variant="outlined"
//                   required
//                   fullWidth
//                   id="email"
//                   label="Email Address"
//                   name="email"
//                   autoComplete="email"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   variant="outlined"
//                   required
//                   fullWidth
//                   name="password"
//                   label="Password"
//                   type="password"
//                   id="password"
//                   autoComplete="current-password"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <FormControlLabel
//                   control={<Checkbox value="allowExtraEmails" color="primary" />}
//                   label="I want to receive inspiration, marketing promotions and updates via email."
//                 />
//               </Grid>
//             </Grid>
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               color="primary"
//               className={classes.submit}
//             >
//               Sign Up
//             </Button>
//             <Grid container justify="flex-end">
//               <Grid item>
//                 <Link href="#" variant="body2">
//                   Already have an account? Sign in
//                 </Link>
//               </Grid>
//             </Grid>
//           </form>
//         </div>
//         <Box mt={5}>
//             Copyright
//           {/* <Copyright /> */}
//         </Box>
//       </Container>
//       </Fragment>
//         // <div>
//         //     {renderHeader()}
//         //     <div style={{textAlign: 'center'}}>
//         //         {sigInError()}
//         //     </div>
//         //     <div>
//         //         <form onSubmit={(e) => submitForm(e)}>
//         //             <TextInput
//         //                 // ref={e=>this._email = e}
//         //                 label="Email"
//         //                 name="email"
//         //                 type="text"
//         //                 validate={validateEmail}
//         //             />
//         //             <TextInput
//         //                 // ref={e=>this._password = e}
//         //                 label="Password"
//         //                 name="password"
//         //                 type="password"
//         //                 validate={validatePassword}
//         //                 placeholder="Please enter a password"
//         //             />
//         //             <div style={{display:'flex', justifyContent:'center'}}>
//         //                 <button
//         //                     id="submit"
//         //                     type="submit"
//         //                     value="Submit"
//         //                     name="submit"
//         //                     className="btn btn-lg btn-primary"
//         //                     >Submit</button>
//         //                 &nbsp;&nbsp;&nbsp;
//         //                 <button
//         //                     type="button"
//         //                     value="Clear"
//         //                     name="clear"
//         //                     className="btn btn-lg btn-default"
//         //                     onClick={(e) => {
//         //                         e.preventDefault();
//         //                         fetchSignError('');
//         //                         reset();
//         //                     }}>Clear</button>
//         //                 &nbsp;&nbsp;&nbsp;
//         //                 <button
//         //                     type="button"
//         //                     value="Sign Up"
//         //                     name="signup"
//         //                     className="btn btn-lg btn-danger"
//         //                     onClick={(e) => {
//         //                         e.preventDefault();
//         //                         history.push('/signup');
//         //                     }}>Sign Up</button>
//         //             </div>
//         //         </form>
//         //     </div>
//         //     <div>
//         //         {renderSocial()}
//         //     </div>
//         //     <div style={{marginBottom:40}}>&nbsp;</div>
//         //     {/* {renderFooter()} */}
//         // </div>
//     );

// }

// SignIn.propTypes = {
//     isSubmitting: PropTypes.bool,
//     redirect: PropTypes.bool,
//     dialog: PropTypes.object,
//     error: PropTypes.string,
//     fetchSignError: PropTypes.func,
//     fetchLogin: PropTypes.func
//   }

// const mapStateToProps = (state) => {
//     return {error: state.auth.error};
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         fetchSignError: (error) => dispatch(signError(error)),
//         fetchLogin: ({email, password, redirect, failed}) => dispatch(logIn({email, password, redirect, failed}))
//     }
// };

// SignIn.propTypes = {
//     error: PropTypes.string,
//     fetchLogin: PropTypes.func,
//     fetchSignError: PropTypes.func
//   }

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
