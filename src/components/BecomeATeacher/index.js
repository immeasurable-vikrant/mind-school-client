/** @format */

import React, { Fragment, useState } from 'react';
import HeroImage from '../../common-components/heroImage/heroImage.component';
import TeachingDescription from '../../common-components/description/description.component';
import TEACHING_DESCRIPTION_DATA from './teachingDescriptionData';
import './index.scss';

const BecomeATeacher = ({ heading }) => {
  const [state] = useState({
    teachingDescriptions: TEACHING_DESCRIPTION_DATA,
  });

  const { teachingDescriptions } = state;
  const auth = 'vikrant';
  return (
    <Fragment>
      <HeroImage
        heading={`Welcome ${auth}`}
        subHeading='Make a Global impact'
        description='Create an online video course and earn money by teaching people around the world.'
      />
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
