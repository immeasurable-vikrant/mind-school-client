import _ from 'lodash';
import User from '../models/user';
import {hostUrl} from '../config';

export const buildUser = function () {
    function makeUser(data) {
        const decorator = _.random(1111, 9999).toString();
        const words = (data.name + decorator).toLowerCase();

        const email = words.trim().replace(' ', '_').concat('@email.com').trim();

        const password = _.random(1111, 99999999).toString();

        return new User({
            email: email,
            password: password,
            profile: {
                name: data.name,
                picture: data.picture,
                instructor: data.instructor
            }
        });
    }

    let authors = [];
    for (let i = 1; i <= 17; i++) {
        const json = require('../models/build-db/author/author-' + i + '.json');

        if(!json.name || _.get(json, 'name.length') <= 0) {
            console.log('json.name.length <= 0');
            continue;
        }

        const author = makeUser({
            name: json.name,
            picture: json.avatar,
            instructor: true
        });

        authors.push(author);
    }

    let merged = [];

    merged = merged.concat(authors);

    for (let i = 1; i <= 13; i++) {
        const raw = require('../models/build-db/user/user-' + i + '.json');

        let users = [];
        raw.map(function(elem) {
            if(!elem.name || _.get(elem, 'name.length') <= 0) {
                console.log('elem.name.length <= 0');
            }

            const user = makeUser(elem);

            users.push(user);
        });

        merged = merged.concat(users);
    }

    merged = _.uniqBy(merged, 'profile.name');

    merged.map(function (elem) {
        const picture = _.get(elem, 'profile.picture');
        if(picture && picture.length > 0) {
            _.set(elem, 'profile.picture', `${hostUrl}/images/${picture}`);
        }
    });

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

    User.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{User} count: ['+count+']:['+merged.length+']');
    });
    console.log('{User} created.');
};

export const populate = function () {
    User.count().exec(function (err, count) {
        if (err) {
            return next(err);
        }
        console.log('{User} count: ['+count+']');
    });
};
