/** @format */

import React from 'react';
import './description.styles.scss';

const Description = ({ ...otherProps }) => {
  const { title, subTitle, imageUrl } = otherProps;
  return (
    <div className='description-container'>
      <div className='img-container'>
        <img src={imageUrl} alt='imgUrl' />
      </div>
      <div className='description-titles-container'>
        <span className='title'>{title}</span>
        <p className='subtitle'>{subTitle}</p>
      </div>
    </div>
  );
};

export default Description;
