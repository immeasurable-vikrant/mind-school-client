import React from 'react';
import { useHistory } from 'react-router-dom';
import dateFormat from 'dateformat';
import { hostUrl } from '../../../config';
import { numberWithCommas } from '../../utility/numberWithCommas';
import CourseAuthor from '../courseAuthor/courseAuthor.component';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';

import './courseDetail.styles.scss';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  text: {
    fontStyle: 'helvetica',
    fontSize: '24px',
    lineHeight: '29px',
    color: '#3c3b37',
    fontWeight: '700',
    padding: '16px',
  },
  card: {
    width: '240px',
    height: '300px',
    backgroundColor: 'white',
    border: 'none',
    boxShadow: '0 0 black',
  },
  cardButton: {
    border: 'none',
  },
  media: {
    height: 140,
  },
}));

const CourseDetail = ({ course }) => {
  const classes = useStyles();
  const history = useHistory();
  const handleDetail = (event, course) => {
    event.preventDefault();
    localStorage.setItem('course', course.no);
    history.push('/detail');
  };

  const courseInfo = `${numberWithCommas(
    course.enrolled,
  )} students enrolled, rating: ${course.average} (${numberWithCommas(
    course.reviews,
  )} reviews), Last updated ${dateFormat(course?.updated, 'm/yyyy')}`;
  return (
    <Card className={classes.card} onClick={(e) => handleDetail(e, course)}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`${hostUrl}/images/${course.picture}`}
          title={course?.title}
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            <CourseAuthor authors={course._authors} />
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {courseInfo}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size='small' color='primary' className={classes.cardButton}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};
export default CourseDetail;
