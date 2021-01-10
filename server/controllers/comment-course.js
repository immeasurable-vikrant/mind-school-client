import _ from 'lodash';
import Course from '../models/course';
import User from '../models/user';
import Comment from '../models/comment';
import {counter} from '../models/sequence';

export const buildComment = function () {
    function makeComment(data, i) {
        return new Comment({
            course: i,
            date: data.date,
            name: data.name,
            content: data.content,
            rating: data.rating,
            helpful: data.helpful,
            indent: data.indent,
            origin: data.origin
        });
    }

    let merged = [];

    for (let i = 1; i <= 13; i++) {
        const raw = require('../models/build-db/comment/comment-' + i + '.json');

        let comments = [];
        raw.map(function(elem) {
            const comment = makeComment(elem, i);

            comments.push(comment);
        });

        merged = merged.concat(comments);
    }

    merged.map(function (elem) {
        if(!elem.name || elem.name.length <= 0) {
            console.log('elem name null:['+merged.indexOf(elem)+']')
            merged.pull(elem);
        }
    });

    merged = merged.reverse();

    const divider = 8;
    const repeat = Math.ceil(merged.length / divider);
    for(let i=0; i<repeat; i++) {
        const parts = _.slice(merged, i*divider, (i+1)*divider);

        parts.map(function(part) {
            part.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    Comment.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Comment} count: ['+count+']:['+merged.length+']');
    });
    console.log('{Comment} created.');
};

export const populate = function () {
    Comment.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Comment} count: ['+count+']');
    });

    let object_indexed = 0;
    let user_indexed = 0;
    let reply_indexed = 0;

    const objectmapping = function() {
        return new Promise(function(resolve, reject) {
            console.log('{Comment}:pre-objectmapping');

            for (let i = 1; i <= 13; i++) {
                Comment.find({course: i}).exec(function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results.length <= 0) return;
                        const comments = _.sortBy(results, "no");
                        comments.map(function (comment) {
                            Course.findOne({no: i}, function (err, course) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (course) {
                                        const index = course._comments.indexOf(comment._id);
                                        if (index === -1) {
                                            Course.update({'_id': course._id}, {$push: {_comments: comment._id}},
                                                function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        object_indexed++;
                                                        console.log('{Comment}:{objectmapping} : [' + object_indexed + '] : ' + 'course: [' + course.no + '] => comment: [' + comment.no + '] indexed');
                                                    }
                                                });
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            }

            console.log('{Comment}:post-objectmapping');

            return setTimeout(resolve, 1);
        })
    };

    const usermapping = function () {
        return new Promise(function (resolve, reject) {
            console.log('{Comment}:pre-usermapping');

            for (let i = 1; i <= 13; i++) {
                Comment.find({course: i}).exec(function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results.length <= 0) return;
                        const comments = _.orderBy(results, 'no', 'asc');
                        comments.map(function (comment) {
                            User.findOne({'profile.name': comment.name}, function (err, user) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (user) {
                                        Comment.update({'_id': comment._id}, {$set: {_user: user._id}},
                                            function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else {
                                                    user_indexed++;
                                                    console.log('{Comment}:{usermapping} : [' + user_indexed + '] : ' + 'user: [' + user.no + '] => comment: [' + comment.no + '] indexed');
                                                }
                                            });
                                    }
                                }
                            });
                        });
                    }
                });
            }

            console.log('{Comment}:post-usermapping');

            return setTimeout(resolve, 1);
        })
    };

    const replymapping = function () {
        return new Promise(function (resolve, reject) {
            console.log('{Comment}:pre-replymapping');

            for (let i = 1; i <= 13; i++) {
                Comment.find({course: i}).exec(function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results.length <= 0) return;
                        const comments = _.orderBy(results, 'no', 'asc');
                        comments.map(function (comment) {
                            if (comment.origin.length > 0) {
                                Comment.findOne({name: comment.origin, course: i}, function (err, origin) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        if (origin) {
                                            Comment.update({'_id': origin._id}, {$set: {_reply: comment._id}},
                                                function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        reply_indexed++;
                                                        console.log('{Comment}:{replymapping} : [' + reply_indexed + '] : ' + 'origin: [' + origin.no + '] => reply: [' + comment.no + '] indexed');
                                                    }
                                                });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }

            console.log('{Comment}:post-replymapping');

            return setTimeout(resolve, 1);
        })
    };

    Promise.race([
        objectmapping(),
        usermapping(),
        replymapping()
            .then(function () {
                return 'done';
            })
    ])
        .then(function (data) {
            console.log('{Comment}:{populate} finished.');
        })
        .catch(function (err) {
            console.log("error:", err);
        });
};

export const paginate = function (req, res, next) {
    const course_no = parseInt(req.query.course_no);
    if (!course_no || course_no <= 0) {
        return res.status(400).send({error: 'invalid course.'});
    }

    const page = parseInt(req.query.page);
    if (!page || page <= 0) {
        return res.status(400).send({error: 'invalid page.'});
    }

    const limit = parseInt(req.query.limit);
    if (!limit || limit <= 0) {
        return res.status(400).send({error: 'invalid limit.'});
    }

    Course
        .findOne({no: course_no})
        .populate({path: '_comments'})
        .exec(function (err, course) {
            if (err) {
                console.log(err);
            }

            if (course) {
                Comment
                    .find({course: course_no, indent: {$ne: 1}})
                    .populate({path: '_user'})
                    .populate({path: '_reply'})
                    .sort({'no': -1})
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .exec(function (err, results) {
                        if (err) {
                            return next(err);
                        }

                        return res.json({
                            'page': page,
                            'limit': limit,
                            'total': Math.ceil(course._comments.length / limit),
                            'comments': results
                        });
                    });
            }
        });
};

export const addComment = function (req, res, next) {
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
        .populate({path: '_comments'})
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
                            const content = req.body.content.replace(/(?![^<]*>)/g, "&nbsp;").replace(/\n\r?/g, "<br/>");

                            const comment = Comment({
                                course: course.no,
                                data: Date.now,
                                name: _.get(user, 'profile.name'),
                                user: user.no,
                                _user: user._id,
                                content: content,
                                rating: req.body.rating
                            });

                            comment.save(function (err) {
                                if (err) {
                                    return console.log(err);
                                }

                                Course
                                    .update({'no': course_no}, {
                                        $push: {
                                            _comments: comment._id
                                        }
                                    }, function (err, raw) {
                                        if (err) {
                                            console.log(err);
                                        }

                                        if (raw) {
                                            return res.json({"comment": "added"});
                                        }
                                    });
                            });
                        }
                    });
            }
        });
};

export const removeComment = function (req, res, next) {
    const user = req.user;
    if (!user) {
        return res.status(400).send({error: 'invalid user.'});
    }

    const course_no = req.body.course_no;
    if (!course_no || course_no.length < 0) {
        return res.status(400).send({error: 'invalid course.'});
    }

    const comment_no = parseInt(req.body.comment_no);
    if (!comment_no || comment_no <= 0) {
        return res.status(400).send({error: 'invalid comment.'});
    }

    Course
        .findOne({no: course_no})
        .populate({path: '_comments'})
        .exec(function (err, course) {
            if (err) {
                console.log(err);
            }

            if (course) {
                const filtered = course._comments.filter(function (elem) {
                    if (elem.no === comment_no) {
                        return elem;
                    }
                });

                if (filtered.length > 0) {
                    const comment = filtered[0];
                    if(comment.origin.length > 0) {
                        Comment
                            .findOne({course: course_no, name: comment.origin})
                            .populate({path: '_user'})
                            .populate({path: '_reply'})
                            .exec(function (err, result) {
                                if (err) {
                                    return next(err);
                                }

                                Comment.update({_id: result._id}, {
                                    $set: {
                                        _reply: null
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                        return handleError(err);
                                    }
                                });
                            });
                    }

                    if(comment._reply) {
                        Comment
                            .findOne({course: course_no, _id: comment._reply})
                            .populate({path: '_user'})
                            .populate({path: '_reply'})
                            .exec(function (err, result) {
                                if (err) {
                                    return next(err);
                                }

                                Comment.update({_id: result._id}, {
                                    $set: {
                                        origin: ''
                                    }
                                }, function (err) {
                                    if (err) {
                                        console.log(err);
                                        return handleError(err);
                                    }
                                });
                            });
                    }

                    Course.update({'no': course_no}, {
                        $pull: {
                            _comments: comment._id
                        }
                    }, function (err) {
                        if (err) {
                            console.log(err);
                            return handleError(err);
                        }

                        Comment
                            .remove({_id: comment._id}, function (err) {
                                if (err) {
                                    console.log(err);
                                    return handleError(err);
                                }

                                return res.json({"comment": "removed"});
                            });

                    });
                }
            }
        });
};

export const toggleHelpful = function (req, res, next) {
    const comment_no = req.body.comment_no;
    if (!comment_no || comment_no.length < 0) {
        return res.status(400).send({error: 'invalid comment.'});
    }

    Comment
        .findOne({no: comment_no})
        .populate({path: '_user'})
        .populate({path: '_reply'})
        .exec(function (err, comment) {
            if (err) {
                console.log(err);
            }

            if (comment) {
                Comment.update({'no': comment_no}, {
                    $set: {
                        helpful: !comment.helpful
                    }
                }, function (err) {
                    if (err) {
                        console.log(err);
                        return handleError(err);
                    }

                    return res.json({"comment": "helpful changed"});
                });
            }
        });
};
