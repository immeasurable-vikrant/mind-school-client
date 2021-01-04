/** @format */

import React, { Fragment, useState } from 'react';
import TeachingDescription from '../../common-components/description/description.component';
import TEACHING_DESCRIPTION_DATA from './teachingDescriptionData';
import './index.scss';

const BecomeATeacher = () => {
  const [state] = useState({
    teachingDescriptions: TEACHING_DESCRIPTION_DATA,
  });

  const { teachingDescriptions } = state;
  return (
    <Fragment>
      <div className='become-teacher-container'>
        {teachingDescriptions.map(({ id, ...otherProps }) => {
          return (
            <Fragment key={id}>
              <TeachingDescription {...otherProps} />
            </Fragment>
          );
        })}
      </div>
    </Fragment>
  );
};

export default BecomeATeacher;
