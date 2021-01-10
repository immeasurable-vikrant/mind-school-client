/** @format */

import jwt from 'jsonwebtoken';
import config from '../config';

const generateToken = (user) => {
  const timestamp = new Date().getTime();

  const token = jwt.sign({ sub: user.id, iat: timestamp }, config.secret);

  return token;
};

export default function (user) {
  try {
    return generateToken(user);
  } catch (err) {
    console.error('error signing json web token:', err);
  }
}
