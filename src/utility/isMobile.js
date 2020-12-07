import checkUserDevice from './checkMobileRequest';

/**
 * isMobile - utility for detecting user agent
 * @returns {Boolean} Returns boolean value
 * How to use it 
 * Import isMobile
  return (
    <div>
     const mobile = isMobile()
    </div>
  );
 */
const isMobile = () => {
  return checkUserDevice() === 'mobile';
};

export default isMobile;
