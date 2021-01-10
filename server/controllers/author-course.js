import _ from 'lodash';
import Author from '../models/author';
import Course from '../models/course';

export const buildAuthor = function () {
    function makeAuthor(data) {
        return new Author({
            no: data.no,
            name: data.name,
            author: data.author,
            avatar: data.avatar,
            average: data.average,
            reviews: data.reviews,
            students: data.students,
            courses: data.courses,
            description: data.description
        });
    }

    let merged = [];

    for (let i = 1; i <= 17; i++) {
        const json = require('../models/build-db/author/author-' + i + '.json');

        const author = makeAuthor(json);

        merged = merged.concat(author);
    }

    Author.collection.insert(merged, function (err, docs) {
        if (err) {
            console.log(err);
        }
    });

    Author.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Author} count: ['+count+']:['+merged.length+']');
    });
    console.log('{Author} created.');
};

export const populate = function () {
    Author.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{Author} count: ['+count+']');
    });

    const objectmapping = function() {
        return new Promise(function(resolve, reject) {
            console.log('{Author}:pre-objectmapping');

            Author.find().exec(function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    if(results.length <= 0) return;
                    const authors = _.sortBy(results, "no");
                    authors.map(function (author) {
                        author.author.map(function (no) {
                            Course.findOne({no: no}, function (err, course) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    if (course) {
                                        const index = course._authors.indexOf(author._id);
                                        if (index === -1) {
                                            Course.update({'_id': course._id}, {$push: {_authors: author._id}},
                                                function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                });
                                        }
                                    }
                                }
                            });
                        });
                    });
                }
            });

            console.log('{Author}:post-objectmapping');

            return setTimeout(resolve, 1);
        })
    };

    Promise.race([
        objectmapping()
            .then(function() {
                return 'done';
            })
    ])
        .then(function(data) {
            console.log('{Author}:{populate} finished.');
        })
        .catch(function(err) {
            console.log("error:", err);
        });
};
