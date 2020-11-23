import React, {Component} from 'react';
import $ from 'jquery'
import PropTypes from 'prop-types';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Button } from '@material-ui/core';
import {signError, signUp} from '../actions';

import path from 'path';
import TextInput from '../components/TextInput';

import Header from '../components/Header';
import Footer from '../components/Footer';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // muiTheme: getMuiTheme(),
            dialogStyle: {display: 'none'},
            isSubmitting: false
        };
    }

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext() {
        return {muiTheme: this.state.muiTheme};
    }

    static propTypes = {
        topOffset: PropTypes.number,
        leftOffset: PropTypes.number
    };

    componentDidMount() {
        this.setState({
            dialogStyle: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                top: this.props.topOffset,
                left: this.props.leftOffset
            }
        });

        $('#avatar_image').hide();
    }

    componentWillMount() {
        this.props.signError('');
    }

    submitForm = (e) => {
        e.preventDefault();
        console.log('SUBMITTTING', isSubmitting)
        const {isSubmitting} = this.state;

        if(isSubmitting) return;

        const email = $('#email').val();
        const password = $('#password').val();
        const passwordConfirm = $('#passwordConfirm').val();
        const name = $('#name').val();
        const fileToUpload = document.getElementById('fileToUpload').files;

        if (email && password && passwordConfirm && name) {
            if (email.length > 0 && password.length > 0 && passwordConfirm.length > 0 && name.length > 0) {
                if(password === passwordConfirm) {
                    if(!isSubmitting) {
                        $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
                        this.setState({isSubmitting:true});
                    }

                    const failed = () => {
                        $('#submit').html('Submit');
                        this.setState({isSubmitting:false});
                    };

                    let avatar = null;

                    if (fileToUpload) {
                        if (fileToUpload[0]) {
                            const filename = fileToUpload[0].name;

                            if (filename && filename.length > 0) {
                                const ext = path.extname(filename).toLowerCase();

                                if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.ico') {
                                    avatar = fileToUpload[0];
                                }
                            }
                        }
                    }

                    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
                    return sleep(300).then(() => {
                        this.props.signUp({email, password, name, avatar, failed});
                    });
                }
            }
        }
    };

    signError = () => {
        if (this.props.error) {
            return (
                <div className="alert alert-danger">
                    <strong>{this.props.error}</strong>
                </div>
            );
        }
    };

    uploadFile(event) {
        const file = event.target.files[0];
        if(file) {
            const ext = path.extname(file.name).toLowerCase();

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.ico') {
                let reader = new FileReader();

                reader.onload = function (e) {
                    const avatar_image = $('#avatar_image');
                    avatar_image.attr('src', e.target.result);
                    const avatar_text = $('#avatar_text');
                    avatar_text.attr('placeholder', file.name);
                    avatar_image.show();
                };

                reader.readAsDataURL(file);
            }
        }
        else {
            $('#avatar_image').hide();
        }
    }

    renderButton = () => {
        return (
            <div style={{display: 'flex', justifyContent:'left', alignItems:'center', width:'100%', height:'60px'}}>
                <Button
                    label="Avatar Image"
                    labelPosition="before"
                    style={{marginLeft: 0, marginRight:20}}
                    containerElement="label"
                >
                    <input
                        type="file"
                        style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            width: '100%',
                            opacity: 0,
                            marginRight: 20
                        }}
                        id="fileToUpload"
                        name="fileToUpload"
                        className="form-control"
                        onChange={this.uploadFile}/>
                </Button>
                <div>
                    <input id="avatar_text" type="text" readOnly="" className="form-control" placeholder=""/>
                </div>
                <div>
                    <img id="avatar_image" width="50px" height="50px" alt="" className="img-circle" style={{marginLeft:4,marginRight:4, verticalAlign:'middle'}}/>
                </div>
            </div>
        );
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

    validateName = (value) => {
        let error = '';
        if (!value || value.length <= 0) {
            error = 'Required';
        } else if (value.length < 4) {
            error = 'Must be 4 characters or more';
        } else if (value.length > 30) {
            error = 'Must be 30 characters or less';
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

    validatePasswordConfirm = (value) => {
        let error = '';
        if (!value || value.length <= 0) {
            error = 'Required';
        }

        const password = $('#password').val();

        if (value !== password) {
            error = 'Passwords must match';
        }

        return error;
    };

    reset = () => {
        this._email.reset();
        this._password.reset();
        this._passwordConfirm.reset();
        this._name.reset();

        $('#fileToUpload').val('');
        $('#avatar_image').attr('src', '').hide();
        $('#avatar_text').attr('placeholder', '');
    };

    render() {
        return (
            <div>
                <Header/>
                <div style={{textAlign: 'center'}}>
                    {this.signError()}
                </div>
                <div style={this.state.dialogStyle}>
                    <form style={{width:'60%', height:'100%',
                    marginTop:20, marginBottom:100}}
                        id='form_info'
                        name='form_info'
                        onSubmit={(e) => this.submitForm(e)}>
                        <TextInput
                            ref={e=>this._email = e}
                            label="Email"
                            name="email"
                            type="text"
                            validate={this.validateEmail}
                        />
                        <TextInput
                            ref={e=>this._password = e}
                            label="Password"
                            name="password"
                            type="password"
                            validate={this.validatePassword}
                            placeholder="Please enter a password"
                        />
                        <TextInput
                            ref={e=>this._passwordConfirm = e}
                            label="Confirm Password"
                            name="passwordConfirm"
                            type="password"
                            validate={this.validatePasswordConfirm}
                            placeholder="Please re-type password"
                        />
                        <TextInput
                            ref={e=>this._name = e}
                            label="Name"
                            name="name"
                            type="text"
                            validate={this.validateName}
                            placeholder="Please enter your name"
                        />
                        <div className="form-group">
                            {this.renderButton()}
                        </div>
                        <div style={{clear:'both'}}>&nbsp;</div>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <button
                                id="submit"
                                type="submit"
                                value="Submit"
                                name="submit"
                                className="btn btn-lg btn-primary">Submit</button>
                            &nbsp;&nbsp;&nbsp;
                            <button
                                type="button"
                                value="Clear"
                                name="clear"
                                className="btn btn-lg btn-default"
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.props.signError('');
                                    this.reset();
                                }}>Clear</button>
                        </div>
                    </form>
                </div>
            <Footer/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        error: state.auth.error
    };
}

const mapDispatchToProps = dispatch => {
    return {
        signError: (error) => dispatch(signError(error)),
        signUp: ({email, password, name, avatar, failed}) => dispatch(signUp({email, password, name, avatar, failed}))
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));


// import React, {useState, useEffect, Fragment } from 'react';
// import PropTypes from 'prop-types';
// import { withRouter, Link } from 'react-router-dom'
// import {connect} from 'react-redux';
// import {signError, signUp} from '../actions';
// import path from 'path';
// // import TextInput from '../components/text-input';

// // import Header from '../components/header';
// // import Footer from '../components/footer';

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
//     TextField
//    } from '@material-ui/core'
// import Header from '../components/Header';

//     const theme = createMuiTheme({
//         palette: {
//           primary: {
//             main: "#556cd6"
//           },
//           secondary: {
//             main: "#19857b"
//           },
//           error: {
//             main: colors.red.A400
//           },
//           background: {
//             default: "#fff"
//           }
//         }
//       });
    
//     const useStyles = makeStyles((theme) => ({
//         paper: {
//           marginTop: theme.spacing(8),
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center"
//         },
//         avatar: {
//           margin: theme.spacing(1),
//           backgroundColor: theme.palette.secondary.main
//         },
//         form: {
//           width: "100%", // Fix IE 11 issue.
//           marginTop: theme.spacing(3)
//         },
//         submit: {
//           margin: theme.spacing(3, 0, 2)
//         }
//       }));

// const SignUp = ({ error, fetchSignError, fetchSignUp}) => {
//     const[ state, setState] = useState({
//         dialogStyle: {display: 'none'},
//         isSubmitting: false
//     })
    

//     useEffect(() => {
//         setState({dialogStyle: {
//             display: 'flex',
//             justifyContent: 'center',
//             marginTop: 0,
//             marginBottom: 0,
//             marginLeft: 0,
//             marginRight: 0
//         }})
//         // $('#avatar_image').hide();

//     }, [])

//     useEffect(() => {
//         fetchSignError('')
//         return () => {
//             fetchSignError('')
//         };
//       }, []);

//     // const submitForm = (e) => {
//     //     e.preventDefault();
//     //     const {isSubmitting} = state;
//     //     if(isSubmitting) return;
//     //     const email = $('#email').val();
//     //     const password = $('#password').val();
//     //     const passwordConfirm = $('#passwordConfirm').val();
//     //     const name = $('#name').val();
//     //     const fileToUpload = document.getElementById('fileToUpload').files;
//     //     if (email && password && passwordConfirm && name) {
//     //         if (email.length > 0 && password.length > 0 && passwordConfirm.length > 0 && name.length > 0) {
//     //             if(password === passwordConfirm) {
//     //                 if(!isSubmitting) {
//     //                     $('#submit').html('<img src="/public/assets/images/spinner.gif"/>');
//     //                     setState({isSubmitting:true});
//     //                 }

//     //                 const failed = () => {
//     //                     $('#submit').html('Submit');
//     //                     setState({isSubmitting:false});
//     //                 };

//     //                 let avatar = null;

//     //                 if (fileToUpload) {
//     //                     if (fileToUpload[0]) {
//     //                         const filename = fileToUpload[0].name;

//     //                         if (filename && filename.length > 0) {
//     //                             const ext = path.extname(filename).toLowerCase();

//     //                             if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.ico') {
//     //                                 avatar = fileToUpload[0];
//     //                             }
//     //                         }
//     //                     }
//     //                 }

//     //                 const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//     //                 return sleep(300).then(() => {
//     //                     fetchSignUp({email, password, name, avatar, failed});
//     //                 });
//     //             }
//     //         }
//     //     }
//     // };

//     // const signUpError = () => {
//     //     if (error) {
//     //         return (
//     //             <div className="alert alert-danger">
//     //                 <strong>{error}</strong>
//     //             </div>
//     //         );
//     //     }
//     // };

//     // const uploadFile = (event) => {
//     //     const file = event.target.files[0];
//     //     if(file) {
//     //         const ext = path.extname(file.name).toLowerCase();

//     //         if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.ico') {
//     //             const reader = new FileReader();

//     //             reader.onload = function (e) {
//     //                 const avatar_image = $('#avatar_image');
//     //                 avatar_image.attr('src', e.target.result);
//     //                 const avatar_text = $('#avatar_text');
//     //                 avatar_text.attr('placeholder', file.name);
//     //                 avatar_image.show();
//     //             };

//     //             reader.readAsDataURL(file);
//     //         }
//     //     }
//     //     else {
//     //         $('#avatar_image').hide();
//     //     }
//     // }

//     // const renderButton = () => {
//     //     return (
//     //         <div style={{display: 'flex', justifyContent:'left', alignItems:'center', width:'100%', height:'60px'}}>
//     //             <RaisedButton
//     //                 label="Avatar Image"
//     //                 labelPosition="before"
//     //                 style={{marginLeft: 0, marginRight:20}}
//     //                 containerElement="label"
//     //             >
//     //                 <input
//     //                     type="file"
//     //                     style={{
//     //                         cursor: 'pointer',
//     //                         position: 'absolute',
//     //                         top: 0,
//     //                         bottom: 0,
//     //                         right: 0,
//     //                         left: 0,
//     //                         width: '100%',
//     //                         opacity: 0,
//     //                         marginRight: 20
//     //                     }}
//     //                     id="fileToUpload"
//     //                     name="fileToUpload"
//     //                     className="form-control"
//     //                     onChange={uploadFile}/>
//     //             {/* </RaisedButton> */}
//     //             <div>
//     //                 <input id="avatar_text" type="text" readOnly="" className="form-control" placeholder=""/>
//     //             </div>
//     //             <div>
//     //                 <img id="avatar_image" width="50px" height="50px" alt="" className="img-circle" style={{marginLeft:4,marginRight:4, verticalAlign:'middle'}}/>
//     //             </div>
//     //         </div>
//     //     );
//     // };

//     // const validateEmail = (value) => {
//     //     let error = '';
//     //     if (!value || value.length <= 0) {
//     //         error = 'Required';
//     //     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
//     //         error = 'Invalid email address';
//     //     }

//     //     return error;
//     // };

//     // const validateName = (value) => {
//     //     let error = '';
//     //     if (!value || value.length <= 0) {
//     //         error = 'Required';
//     //     } else if (value.length < 4) {
//     //         error = 'Must be 4 characters or more';
//     //     } else if (value.length > 30) {
//     //         error = 'Must be 30 characters or less';
//     //     }

//     //     return error;
//     // };

//     // const validatePassword = (value) => {
//     //     let error = '';
//     //     if (!value || value.length <= 0) {
//     //         error = 'Required';
//     //     } else if (value.length < 4) {
//     //         error = 'Must be 4 characters or more';
//     //     } else if (value.length > 15) {
//     //         error = 'Must be 15 characters or less';
//     //     }

//     //     return error;
//     // };

//     // const validatePasswordConfirm = (value) => {
//     //     let error = '';
//     //     if (!value || value.length <= 0) {
//     //         error = 'Required';
//     //     }

//     //     const password = $('#password').val();

//     //     if (value !== password) {
//     //         error = 'Passwords must match';
//     //     }

//     //     return error;
//     // };

//     const reset = () => {
//         this._email.reset();
//         this._password.reset();
//         this._passwordConfirm.reset();
//         this._name.reset();

//         $('#fileToUpload').val('');
//         $('#avatar_image').attr('src', '').hide();
//         $('#avatar_text').attr('placeholder', '');
//     };
//     const classes = useStyles();
//     return (
//         <Fragment>
//           <Header />
//         <Container component="main" maxWidth="xs">
//         <CssBaseline />
//         <div className={classes.paper}>
//           <Avatar className={classes.avatar}></Avatar>
//           <Typography component="h1" variant="h5" color='primary'>
//            Create an Account
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
//                 <Link to='/signin' variant="body2">
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
//         //     {/* <Header/> */}
//         //     <div style={{textAlign: 'center'}}>
//         //         {signUpError()}
//         //     </div>
//         //     <div style={state.dialogStyle}>
//         //         <form style={{width:'60%', height:'100%',
//         //         marginTop:20, marginBottom:100}}
//         //             id='form_info'
//         //             name='form_info'
//         //             onSubmit={(e) => submitForm(e)}>
//         //             {/* <TextInput
//         //                 ref={e=>this._email = e}
//         //                 label="Email"
//         //                 name="email"
//         //                 type="text"
//         //                 validate={this.validateEmail}
//         //             />
//         //             <TextInput
//         //                 ref={e=>this._password = e}
//         //                 label="Password"
//         //                 name="password"
//         //                 type="password"
//         //                 validate={this.validatePassword}
//         //                 placeholder="Please enter a password"
//         //             />
//         //             <TextInput
//         //                 ref={e=>this._passwordConfirm = e}
//         //                 label="Confirm Password"
//         //                 name="passwordConfirm"
//         //                 type="password"
//         //                 validate={this.validatePasswordConfirm}
//         //                 placeholder="Please re-type password"
//         //             />
//         //             <TextInput
//         //                 ref={e=>this._name = e}
//         //                 label="Name"
//         //                 name="name"
//         //                 type="text"
//         //                 validate={this.validateName}
//         //                 placeholder="Please enter your name"
//         //             /> */}
//         //             <div className="form-group">
//         //                 {renderButton()}
//         //             </div>
//         //             <div style={{clear:'both'}}>&nbsp;</div>
//         //             <div style={{display:'flex', justifyContent:'center'}}>
//         //                 <button
//         //                     id="submit"
//         //                     type="submit"
//         //                     value="Submit"
//         //                     name="submit"
//         //                     className="btn btn-lg btn-primary">Submit</button>
//         //                 &nbsp;&nbsp;&nbsp;
//         //                 <button
//         //                     type="button"
//         //                     value="Clear"
//         //                     name="clear"
//         //                     className="btn btn-lg btn-default"
//         //                     onClick={(e) => {
//         //                         e.preventDefault();
//         //                         signUpError('');
//         //                         reset();
//         //                     }}>Clear</button>
//         //             </div>
//         //         </form>
//         //     </div>
//         // {/* <Footer/> */}
//         // </div>
//     );
// }

// SignUp.propTypes = {
//     error: PropTypes.string,
//     fetchSignError: PropTypes.func,
//     fetchSignUp: PropTypes.func
// }


// const mapStateToProps = (state) => {
//     return {
//         error: state.auth.error
//     };
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         fetchSignError: (error) => dispatch(signError(error)),
//         fetchSignUp: ({email, password, name, avatar, failed}) => dispatch(signUp({email, password, name, avatar, failed}))
//     }
// };

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
