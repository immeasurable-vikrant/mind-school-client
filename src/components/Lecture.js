import React, { useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

const Lecture = () => {
  const history = useHistory();

  useEffect(() => {
    const url = localStorage.getItem('url');
    console.log('url', url);
    if (url) {
      localStorage.removeItem('url');
      history.push(`/view-lecture/${url}`);
    }
  }, []);

  return (
    <div>
      <h2>Hello hello ello</h2>
    </div>
  );
};
export default withRouter(Lecture);
