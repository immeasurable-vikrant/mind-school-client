import _ from 'lodash';
import User from '../models/user';

export const search = function (req, res, next) {
    const email = req.user.email;

    if (!email || email.length < 0) {
        return res.status(400).send({error: 'invalid email.'});
    }

    User.findOne({email: email})
        .populate({
            path: 'courses.ref',
            populate: {
                path: '_authors',
                model: 'Author'
            }
        })
        .exec(function (err, user) {
            if (err) {
                console.log(err);
            }

            if (user) {
                const filtered = user.courses.filter(function(elem) {
                    if(elem.learn === true) {
                        return elem;
                    }
                });

                if(filtered.length > 0) {
                    const results = filtered.map(function(elem) {
                        return elem.ref;
                    });

                    return res.json(results);
                }
                else {
                    return res.json([]);
                }
            }
        });
};
