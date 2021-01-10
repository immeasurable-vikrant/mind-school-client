import passport from 'passport';
import CryptoJS from 'crypto-js';
import User from '../models/user';
import config from '../config';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

export default function () {
    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: config.secret
    };

    const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
        User.findById(payload.sub, function (err, user) {
            if (err) {
                return done(err, false);
            }

            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });

    const localOptions = {usernameField: 'email'};
    const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            const bytes = CryptoJS.AES.decrypt(user.password, config.secret);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if(decrypted && decrypted.length > 0) {
                if (decrypted !== password) {
                    return done(null, false);
                }
                else {
                    return done(null, user);
                }
            }
        });
    });

    passport.use(jwtLogin);
    passport.use(localLogin);
};
