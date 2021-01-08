import React from 'react';
import { useHistory } from 'react-router-dom';
import dateFormat from 'dateformat';
import { hostUrl } from '../../../config';
import { numberWithCommas } from '../../utility/numberWithCommas';
import CourseAuthor from '../courseAuthor/courseAuthor.component';

import './courseDetail.styles.scss';

const CourseDetail = ({ course }) => {
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
    <div class='main' onClick={(e) => handleDetail(e, course)}>
      <ul class='cards'>
        <li class='cards_item'>
          <div class='card'>
            <div class='card_image'>
              <img src={`${hostUrl}/images/${course.picture}`} width='100%' />
            </div>
            <div class='card_content'>
              <h2 class='card_title'>
                <CourseAuthor authors={course._authors} />
              </h2>
              <p class='card_text'>{courseInfo}</p>
              <button class='btn card_btn'>Read More</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default CourseDetail;
