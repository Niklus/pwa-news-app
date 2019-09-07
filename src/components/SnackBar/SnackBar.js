import React from 'react';
import './SnackBar.css';

const SnackBar = () => {
  return (
    <div className="mdc-snackbar"
      aria-live="assertive"
      aria-atomic="true"
      aria-hidden="true">
      <div className="mdc-snackbar__text"></div>
      <div className="mdc-snackbar__action-wrapper">
        <button type="button" className="mdc-button mdc-snackbar__action-button"></button>
      </div>
    </div>
  )
}

export default SnackBar;