import _ from 'lodash';
const rand = require('random-seed').create();
import async from 'async';

import Author from '../models/author';
import Course from '../models/course';

export const buildCourse = function () {
    function makeCourse(data) {
        return new Course({
            no: data.no,
            title: data.title,
            subtitle: data.subtitle,
            authors: data.authors,
            category: data.category,
            average: data.average,
            reviews: data.reviews,
            enrolled: data.enrolled,
            price: data.price,
            picture: data.picture,
            updated: data.updated,
            description: data.description
        });
    }

    let merged = [];

    for (let i = 1; i <= 13; i++) {
        const json = require('../models/build-db/course/course-' + i + '.json');

        const course = makeCourse(json);

        merged = merged.concat(course);
    }

    Course.collection.insert(merged, function (err, docs) {
        if (err) {
            console.log(err);
        }
    });

    Course.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Course} count: ['+count+']:['+merged.length+']');
    });
    console.log('{Course} created.');
};

export const populate = function () {
    Course.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Course} count: ['+count+']');
    });

    const ordermapping = function() {
        return new Promise(function(resolve, reject) {
            console.log('{Course}:pre-ordermapping');

            Course.find().exec(function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    if(results.length <= 0) return;
                    const courses = _.sortBy(results, "no");
                    courses.map(function (course) {
                        const _authors = _.sortBy(course._authors, 'no');

                        Course.update({ '_id': course._id }, { $set: { _authors: _authors } },
                            function(err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log('course: ' + course.no + '=>authors:' + course.authors.length + '=>_authors:' + course._authors.length +' indexed');
                                }
                            });
                    });
                }
            });

            console.log('{Course}:post-ordermapping');

            return setTimeout(resolve, 1);
        })
    };

    Promise.race([
        ordermapping()
            .then(function() {
                return 'done';
            })
    ])
        .then(function(data) {
            console.log('{Course}:{populate} finished.');       })
        .catch(function(err) {
            console.log("error:", err);
        });
};

function randomSort() {
    const type = ['title', 'category', 'average', 'reviews', 'enrolled', 'price'];
    const sort_type = type[rand(type.length)];
    const order = [1, -1];
    const sort_order = order[rand(order.length)];

    return {
        field: sort_type,
        value: sort_order
    };
}

export const searchAll = function (req, res, next) {
    const sort = randomSort();

    Course
        .find()
        .populate({
            path: '_authors'
        })
        .sort({[sort.field]: sort.value})
        .exec(function (err, results) {
            if (err) {
                return next(err);
            }

            if (results) {
                return res.json({"courses": results});
            }
    });
};

export const search = function (req, res, next) {
    const keyword = req.params.keyword;

    if (!keyword || keyword.length < 0) {
        return res.status(400).send({error: 'invalid keyword.'});
    }

    const regex = new RegExp('^.*' + keyword + '.*$', 'i');

    const sort = randomSort();

    Course
        .find()
        .populate({
            path: '_authors'
        })
        .or([
            {'title': {$regex: regex}},
            {'authors': {$elemMatch: {'name': {$regex:regex}}}}
            ])
        .sort({[sort.field]: sort.value})
        .exec(function(err, results) {
            if (err) {
                return next(err);
            }

            if (results) {
                return res.json({"courses": results});
            }
        });
};

export const searchById = function (req, res, next) {
    const id = req.params.id;

    if (!id || id.length < 0) {
        return res.status(400).send({error: 'invalid id.'});
    }

    Course.find({no: id})
        .populate({
            path: '_authors'
        })
        .exec(function(error, doc) {
            if (error) {
                return next(error);
            }

            if (doc) {
                return res.json(doc[0]);
            }
    });
};

export const paginate = function (req, res, next) {
    const keyword = req.query.keyword;
    console.log(keyword);
    if (!keyword || keyword.length <= 0) {
        return paginateAll(req, res, next);
    }
    else {
        return paginateQuery(req, res, next);
    }
};

const paginateAll = function (req, res, next) {
    const page = parseInt(req.query.page);
    if (!page || page <= 0) {
        return res.status(400).send({error: 'invalid page.'});
    }

    const limit = parseInt(req.query.limit);
    if (!limit || limit <= 0) {
        return res.status(400).send({error: 'invalid limit.'});
    }

    const sort_type = req.query.sort_type;
    if(!sort_type) {
        return res.status(400).send({error: 'invalid sort type.'});
    }

    const sort_order = parseInt(req.query.sort_order);
    if(!sort_order) {
        return res.status(400).send({error: 'invalid sort order.'});
    }

    Course.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }

        const total = Math.ceil(count / limit);

        Course
            .find()
            .populate({path: '_authors'})
            .sort({[sort_type]: sort_order})
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(function (err, results) {
                if (err) {
                    return next(err);
                }

                if (results) {
                    return res.json({
                        'page': page,
                        'limit': limit,
                        'total': total,
                        'courses': results
                    });
                }
            });
    });
};

const paginateQuery = function (req, res, next) {
    const keyword = req.query.keyword;
    if (!keyword || keyword.length < 0) {
        return res.status(400).send({error: 'invalid keyword.'});
    }

    const page = parseInt(req.query.page);
    if (!page || page <= 0) {
        return res.status(400).send({error: 'invalid page.'});
    }

    const limit = parseInt(req.query.limit);
    if (!limit || limit <= 0) {
        return res.status(400).send({error: 'invalid limit.'});
    }

    const sort_type = req.query.sort_type;
    if(!sort_type) {
        return res.status(400).send({error: 'invalid sort type.'});
    }

    const sort_order = parseInt(req.query.sort_order);
    if(!sort_order) {
        return res.status(400).send({error: 'invalid sort order.'});
    }

    const _escaped = keyword.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    const regex = new RegExp('^.*' + _escaped + '.*$', 'i');

    Course
        .find()
        .populate({path: '_authors'})
        .or([
            {'title': {$regex: regex}},
            {'authors': {$elemMatch: {'name': {$regex: regex}}}}
        ])
        .sort({[sort_type]: sort_order})
        .count()
        .exec(function (err, count) {
            if (err) {
                return next(err);
            }

            const total = Math.ceil(count / limit);

            Course
                .find()
                .populate({path: '_authors'})
                .or([
                    {'title': {$regex: regex}},
                    {'authors': {$elemMatch: {'name': {$regex: regex}}}}
                ])
                .sort({[sort_type]: sort_order})
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(function (err, results) {
                    if (err) {
                        return next(err);
                    }

                    if (results) {
                        return res.json({
                            'page': page,
                            'limit': limit,
                            'total': total,
                            'courses': results
                        });
                    }
                });
        });
};
