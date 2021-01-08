import React from 'react';
import { numberWithCommas } from '../../utility/numberWithCommas';
import './courseAuthor.styles.scss';

const CourseAuthors = ({ authors }) => {
  return _.map(authors, (author, i) => {
    console.log('AUTHORS', author);
    return (
      <div key={i}>
        <div>
          <h5>{author.name}</h5>
          <h6>{`${numberWithCommas(author.students)} Students`}</h6>
        </div>
      </div>
    );
  });
};

export default CourseAuthors;
