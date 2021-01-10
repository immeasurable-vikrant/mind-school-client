/** @format */

import fs from 'fs';
import path from 'path';
import * as Authentication from '../controllers/authentication';
import passportLogin from '../services/passport';
import passport from 'passport';
import generateToken from '../services/token-jwt';
import googleStrategy from '../services/google-strategy';
import { clientUrl } from '../config';

passportLogin();

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

googleStrategy();

import * as SearchCourse from '../controllers/search-course';

import * as SearchCart from '../controllers/search-cart';

import * as LectureCourse from '../controllers/lecture-course';

import * as CommentCourse from '../controllers/comment-course';

import * as ViewCourses from '../controllers/view-courses';

export default function (app) {
  app.get('/', requireAuth, function (req, res) {
    res.send({ message: 'Welcome! guest: (' + req.user.email + ')' });
  });
  app.get('/token', requireAuth, Authentication.userinfo);
  app.post('/signin', requireSignin, Authentication.signin);
  app.get('/signout', requireAuth, Authentication.signout);
  app.post('/signup', Authentication.signup);

  app.get('/paginate', SearchCourse.paginate);

  app.get('/courses/:keyword', SearchCourse.search);
  app.get('/courses/detail/:id', SearchCourse.searchById);

  app.get('/lecture/:id', LectureCourse.search);
  app.post('/view-lecture', requireAuth, LectureCourse.viewById);

  app.get('/comments', CommentCourse.paginate);
  app.post('/add-comment', requireAuth, CommentCourse.addComment);
  app.post('/remove-comment', requireAuth, CommentCourse.removeComment);
  app.post('/toggle-helpful', requireAuth, CommentCourse.toggleHelpful);

  app.post('/buy-cart', requireAuth, SearchCart.buyCart);
  app.get('/list-cart', requireAuth, SearchCart.listCart);
  app.post('/add-cart', requireAuth, SearchCart.addCart);
  app.post('/remove-cart', requireAuth, SearchCart.removeCart);

  app.get('/view-courses', requireAuth, ViewCourses.search);

  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['email profile'] }),
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin' }),
    function (req, res) {
      if (req.user) {
        const token = generateToken(req.user);
        const url = `${clientUrl}/social-google?token=${token}`;
        res.redirect(url);
      }
    },
  );

  app.get('/video/:lecture', function (req, res) {
    const fullpath = path.resolve(
      'wwwroot',
      '../public/mp4/',
      './' + req.params.lecture,
    );

    if (!fullpath || fullpath.length < 0) {
      return res.status(400).send({ error: 'invalid path.' });
    }

    const stat = fs.statSync(fullpath);

    const fileSize = stat.size;

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(fullpath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(fullpath).pipe(res);
    }
  });
}
