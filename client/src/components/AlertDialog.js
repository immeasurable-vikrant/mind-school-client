import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Button } from '@material-ui/core';

const AlertDialog = ({ message, handleConfirm }) => {
  const [state, setState] = useState({
    open: false
  });
  
  const handleClose = () => {
    setState({ open: false });
  };

  const actions = [
    <Button key='' color='primary' onClick={() => handleClose()}>
      Cancel
    </Button>,
    <Button
      key=''
      color='primary'
      onClick={() => {
        handleConfirm();
        handleClose();
      }}>
      Confirm
    </Button>
  ];

  return (
    <div>
      <Dialog
        actions={actions}
        modal={false}
        open={state.open}
        onRequestClose={handleClose}>
        {message}
      </Dialog>
    </div>
  );
};

AlertDialog.propTypes = {
  message: PropTypes.string,
  handleConfirm: PropTypes.func
};

export default AlertDialog;
