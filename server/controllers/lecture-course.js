import _ from 'lodash';
import Lecture from '../models/lecture';
import Course from '../models/course';

export const buildLecture = function () {
    function makeLecture(data) {
        return new Lecture({
            no: data.no,
            total: data.total,
            header: data.header
        });
    }

    let merged = [];

    for (let i = 1; i <= 13; i++) {
        const json = require('../models/build-db/lecture/lecture-' + i + '.json');

        const lecture = makeLecture(json);

        merged = merged.concat(lecture);
    }

    Lecture.collection.insert(merged, function (err, docs) {
        if (err) {
            console.log(err);
        }
    });

    Lecture.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Lecture} count: ['+count+']:['+merged.length+']');
    });
    console.log('{Lecture} created.');
};

export const populate = function () {
    Lecture.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Lecture} count: ['+count+']');
    });

    const objectmapping = function () {
        return new Promise(function (resolve, reject) {
            console.log('{Lecture}:pre-ordermapping');

            Lecture.find().exec(function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    if(results.length <= 0) return;
                    const lectures = _.sortBy(results, "no");
                    lectures.map(function (lecture) {
                        Course.findOne({no: lecture.no}, function (err, course) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if (course) {
                                    Lecture.update({'_id': lecture._id}, {$set: {_course: course._id}},
                                        function (err) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                console.log('course: ' + course.no + '=>lecture:' + lecture.no +' indexed');
                                            }
                                        });
                                }
                            }
                        });
                    });
                }
            });

            console.log('{Lecture}:post-ordermapping');

            return setTimeout(resolve, 1);
        })
    };

    Promise.race([
        objectmapping()
            .then(function () {
                return 'done';
            })
    ])
        .then(function (data) {
            console.log('{Lecture}:{populate} finished.');
        })
        .catch(function (err) {
            console.log("error:", err);
        });
};

export const search = function (req, res, next) {
    const id = req.params.id;

    if (!id || id.length < 0) {
        return res.status(400).send({error: 'invalid id.'});
    }

    Lecture.find({no: id})
        .populate({
            path: '_course'
        })
        .exec(function (error, doc) {
            if (error) {
                return next(error);
            }

            if (doc) {
                return res.json(doc[0]);
            }
        });
};

export const viewById = function (req, res, next) {
    const lecture_no = req.body.lecture_no;
    const header_no = req.body.header_no;
    const sub_no = req.body.sub_no;

    Lecture.find({no: lecture_no})
        .populate({
            path: '_course'
        })
        .exec(function (error, doc) {
            if (error) {
                return next(error);
            }

            if (doc) {
                const header_filtered = doc[0].header.filter(function(elem) {
                    if(elem.no === header_no) return elem;
                });

                if(header_filtered) {
                    if(header_filtered.length > 0) {
                        console.log('hn:'+header_filtered[0].no);

                        const body_filtered = header_filtered[0].body.filter(function(elem) {
                            if(elem.sub_no === sub_no) {
                                return elem;
                            }
                        });

                        if(body_filtered) {
                            if(body_filtered.length > 0) {
                                console.log('hn:'+header_filtered[0].no+':bn:'+body_filtered[0].sub_no+':content:'+body_filtered[0].content);
                                const rnd = _.random(1,3);
                                const url = 'lecture-'+rnd+'.mp4';

                                console.log(url);

                                return res.json(rnd);
                            }
                        }
                    }
                }
            }
        });
};
