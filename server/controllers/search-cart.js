import Cart from '../models/cart';
import Course from '../models/course';
import User from '../models/user';

const pullCart = function(user, course) {
    Cart
        .findOne({user: user._id})
        .populate({path: 'courses.ref'})
        .exec(function (err, cart) {
            if (err) {
                console.log(err);
            }

            if (cart) {
                if (cart.courses.length > 0) {
                    Cart.update({'_id': cart._id}, {
                        $pull: {
                            courses: {
                                ref: course._id,
                                no: course.no
                            }
                        }
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });
};

export const buyCart = function (req, res, next) {
    const email = req.user.email;

    if (!email || email.length < 0) {
        return res.status(400).send({error: 'invalid email.'});
    }

    const course_no = req.body.course_no;

    if (!course_no || course_no.length < 0) {
        return res.status(400).send({error: 'invalid course.'});
    }

    Course
        .findOne({no: course_no})
        .populate({path: '_authors'})
        .exec(function (err, course) {
            if (err) {
                console.log(err);
            }

            if (course) {
                User.findOne({email: email})
                    .populate({path: 'courses.ref'})
                    .exec(function (err, user) {
                        if (err) {
                            console.log(err);
                        }

                        if (user) {
                            const filtered = user.courses.filter(function (elem) {
                                if (elem.no === course.no) {
                                    return elem;
                                }
                            });

                            if (filtered.length <= 0) {
                                User.update({'_id': user._id}, {
                                    $push: {
                                        courses: {
                                            ref: course._id,
                                            no: course.no,
                                            learn: true
                                        }
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    pullCart(user, course);
                                });
                            }
                            else {
                                filtered[0].learn = !filtered[0].learn;
                                User.update({'_id': user._id}, {
                                    $set: {
                                        courses: user.courses
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    pullCart(user, course);
                                });
                            }
                        }

                        return res.json({"learn": "success"});
                    });
            }
        });
};

export const listCart = function (req, res, next) {
    const user = req.user;

    if (!user) {
        return res.status(400).send({error: 'invalid user.'});
    }

    Cart
        .findOne({user: user._id})
        .populate('courses.ref')
        .exec(function (err, cart) {
            if (err) {
                console.log(err);
            }

            if (cart) {
                const courses = cart.courses.map(function(elem) {
                    return elem.ref;
                });

                return res.json(courses);
            }
        });
};

export const addCart = function (req, res, next) {
    const user = req.user;

    if (!user) {
        return res.status(400).send({error: 'invalid user.'});
    }

    const course_no = req.body.course_no;

    if (!course_no || course_no.length < 0) {
        return res.status(400).send({error: 'invalid course.'});
    }

    Course
        .findOne({no: course_no})
        .populate({path: '_authors'})
        .exec(function (err, course) {
            if (err) {
                console.log(err);
            }

            if (course) {
                Cart
                    .findOne({user: user._id})
                    .populate({path: 'courses.ref'})
                    .exec(function (err, cart) {
                        if (err) {
                            console.log(err);
                        }

                        if (cart) {
                            const filtered = cart.courses.filter(function (elem) {
                                if (elem.no === course.no) {
                                    return elem;
                                }
                            });

                            if (filtered.length <= 0) {
                                Cart.update({'_id': cart._id}, {
                                    $push: {
                                        courses: {
                                            ref: course._id,
                                            no: course.no
                                        }
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }

                            return res.json({"cart":"added"});
                        }
                    });
            }
        });
};

export const removeCart = function (req, res, next) {
    const user = req.user;

    if (!user) {
        return res.status(400).send({error: 'invalid user.'});
    }

    const course_no = req.body.course_no;

    if (!course_no || course_no.length < 0) {
        return res.status(400).send({error: 'invalid course.'});
    }

    Course
        .findOne({no: course_no})
        .populate({path: '_authors'})
        .exec(function (err, course) {
            if (err) {
                console.log(err);
            }

            if (course) {
                Cart
                    .findOne({user: user._id})
                    .populate({path: 'courses.ref'})
                    .exec(function (err, cart) {
                        if (err) {
                            console.log(err);
                        }

                        if (cart) {
                            const filtered = cart.courses.filter(function (elem) {
                                if (elem.no === course.no) {
                                    return elem;
                                }
                            });

                            if (filtered.length > 0) {
                                Cart.update({'_id': cart._id}, {
                                    $pull: {
                                        courses: {
                                            ref: course._id,
                                            no: course.no
                                        }
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }

                            return res.json({"cart":"removed"});
                        }
                    });
            }
        });
};
