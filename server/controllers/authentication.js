import path from 'path';
import AES from 'crypto-js/aes';
import User from '../models/user';
import Cart from '../models/cart';
import generateToken from '../services/token-jwt';
import config, {hostUrl} from '../config';

export const userinfo = function (req, res, next) {
    const email = req.user.email;

    if (!email || email.length < 0) {
        return res.status(400).send({error: 'invalid email.'});
    }

    User.findOne({email: email})
        .populate({path: 'courses.ref'})
        .exec(function (err, user) {
            if (err) {
                console.log(err);
            }
            else {
                if (user) {
                    return res.json(user);
                }
            }
        });
};

export const signin = function (req, res, next) {
    res.send({token: generateToken(req.user)});
};

export const signout = function (req, res, next) {
    req.session.destroy(function(err) {
        if(err) {
            return res.status(400).send(err);
        }

        req.logout();
        res.send("logout success.");
    });
};

export const signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const files = req.files;

    if (!email || !password || !name) {
        return res.status(400).send({error: 'Invalid user information.'});
    }

    User.findOne({email: email}, function (err, exists) {
        if (err) {
            return next(err);
        }

        if (exists) {
            return res.status(409).send({error: 'Email is already in use'});
        }

        const encrypted = AES.encrypt(password, config.secret).toString();
        if(encrypted && encrypted.length > 0) {
            let filename = `${hostUrl}/images/anonymous.png`;

            if(files) {
                const avatar = req.files.avatar;
                if(avatar) {
                    const name = avatar.name;
                    const fullpath = path.resolve('wwwroot', '../public/img/', './' + name);

                    avatar.mv(fullpath, function (err) {
                        if (err) {
                            return next(err);
                        }
                    });

                    if(name && name.length > 0) {
                        filename = `${hostUrl}/images/${name}`;
                    }
                }
            }

            const user = new User({
                email: email,
                password: encrypted,
                profile: {
                    name: name,
                    picture: filename
                }
            });

            user.save(function (err) {
                if (err) {
                    return next(err);
                }

                const cart = new Cart({
                    user: user._id
                });

                cart.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    else {
                        return res.json({token: generateToken(user)});
                    }
                });
            });
        }
    });
};
