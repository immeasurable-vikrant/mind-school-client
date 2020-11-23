import _ from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchLecture, viewLecture } from '../actions/lecture';
import { userInfo } from '../actions';
import SignIn from '../auth/SignIn';

import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));

const styles = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0
  },
  dialogContent: {
    position: 'relative',
    width: '80vw',
    transform: ''
  },
  dialogBody: {
    paddingBottom: 0
  }
};

const Curriculum = (props) => {
  const { logged, user, lecture, fetchUserInfo, fetchViewLecture } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded && panel);
  };
  const [state, setState] = useState({
    open: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo();
    }
    // collapsibleTree();
  }, [fetchUserInfo]);

  const handleOpen = () => {
    setState({ open: true });
  };

  const handleClose = () => {
    setState({ open: false });
  };

  const handleViewLecture = (event, header, body, learn) => {
    event.preventDefault();
    if (learn) {
      if (logged) {
        if (!lecture) {
          return handleOpen();
        }
        if (user) {
          return fetchViewLecture(lecture.no, header.no, body.sub_no);
        }
      }
    }
  };

  const renderDialog = () => {
    return (
      <div>
        <Dialog
          contentStyle={styles.dialogContent}
          bodyStyle={styles.dialogBody}
          style={styles.dialogRoot}
          modal={false}
          open={state.open}
          onRequestClose={handleClose}
          repositionOnUpdate={false}
          autoScrollBodyContent={true}>
          <SignIn redirect={handleClose} dialog={true} />
          <br />
          <br />
        </Dialog>
      </div>
    );
  };

  const lecturePreview = (header, body, preview) => {
    if (!lecture) {
      return <span>&nbsp;</span>;
    }
    if (user) {
      const filtered = user.courses.filter((_course) => {
        return _course.no === lecture.no && _course;
      });

      if (filtered) {
        if (filtered.length > 0) {
          if (filtered[0].learn) {
            return (
              <div
                style={{ width: '100%', height: '100% ' }}
                onClick={(e) => handleViewLecture(e, header, body, true)}>
                <i className='fa fa-play-circle-o' aria-hidden='true' />
                <p>Play</p>
              </div>
            );
          }
        }
      }
    }
  };

  const lectureBody = (header) => {
    return _.map(header.body, (body, i) => {
      return (
        <div key={i} className='collapsible-body'>
          <div className='row text-size-fifth'>
            <div className='col-sm-7 text-left'>
              <span>{body.content}</span>
            </div>
            <div className='col-sm-3 text-center'>
              {lecturePreview(header, body, body.preview)}
            </div>
            <div className='col-sm-2 text-right'>
              <span>{body.time}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  const lectureHeader = (lectures) => {
    return _.map(lectures.header, (header, i) => {
      return (
        <Accordion
          key={i}
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1bh-content'
            id='panel1bh-header'>
            {' '}
            {header.title}
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{lectureBody(header)}</Typography>
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  const isFirstUpdate = useRef(true);
  useEffect(() => {
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return;
    }
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  });

  const renderLecture = () => {
    if (!lecture) {
      return <div>&nbsp;</div>;
    }

    return (
      <div>
        <div
          className='container'
          style={{
            textAlign: 'center',
            width: '100%'
          }}></div>
        <div className={classes.root}>{lectureHeader(lecture)}</div>
      </div>
    );
  };

  return (
    <div>
      {renderDialog()}
      {renderLecture()}
    </div>
  );
};

Curriculum.propTypes = {
  fetchUserInfo: PropTypes.func,
  fetchViewLecture: PropTypes.func,
  fetchLecture: PropTypes.func,
  logged: PropTypes.bool,
  user: PropTypes.object,
  hasError: PropTypes.bool,
  isLoading: PropTypes.bool,
  lecture: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    logged: state.auth.logged,
    user: state.auth.user,
    lecture: state.lecture.lecture,
    hasError: state.lecture.error,
    isLoading: state.lecture.loading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLecture: (course_no) => dispatch(fetchLecture(course_no)),
    fetchUserInfo: () => dispatch(userInfo()),
    fetchViewLecture: (lecture_no, header_no, sub_no) =>
      dispatch(viewLecture(lecture_no, header_no, sub_no))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    Curriculum
  )
);
