import React from 'react';
import './loader.styles.scss';

const Loader = () => {
  return (
    <div className='spinner'>
      <div className='bounce1'></div>
      <div className='bounce2'></div>
      <div className='bounce3'></div>
      <div className='bounce4'></div>
    </div>
  );
};

export default Loader;
