import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

export default class TextInput extends Component {
  validateInput = (value) => {
    const error = this.props.validate(value);
    this._validate(error);
  };

  handleChange = (e) => {
    e.preventDefault();

    this.validateInput(e.target.value);
  };

  handleKeyUp = (e) => {
    e.preventDefault();

    this.validateInput(e.target.value);
  };

  handleBlur = (e) => {
    this.validateInput(e.target.value);
  };

  _validate = (error) => {
    if (error.length <= 0) {
      const el = $(`#form_${this.props.name}`);
      if (el) {
        if (el.hasClass('has-error')) {
          el.removeClass('has-error');
          el.addClass('has-success');
          el.children('span').text(`valid ${this.props.label}`);
          el.children('span').removeClass('color-red');
          el.children('span').addClass('color-green');
        }
      }
    } else {
      const el = $(`#form_${this.props.name}`);
      if (el) {
        el.removeClass('has-success');
        el.addClass('has-error');
        el.children('span').text(error);
        el.children('span').removeClass('color-green');
        el.children('span').addClass('color-red');
      }
    }
  };

  reset = () => {
    const _input = $(`#${this.props.name}`);
    if (_input) {
      _input.val('');
    }

    const el = $(`#form_${this.props.name}`);
    if (el) {
      el.removeClass('has-error');
      el.removeClass('has-success');
      el.children('span').text('');
      el.children('span').removeClass('color-red');
      el.children('span').removeClass('color-green');
    }
  };

  renderField = (float, { label, name, type, placeholder }) => (
    <div id={`form_${name}`} className={`form-group ${float} form-group-email`}>
      <label htmlFor={name} className='control-label'>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className='form-control'
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
        onBlur={this.handleBlur}
      />
      <span />
    </div>
  );

  renderStatic = ({ label, name, type, placeholder }) => {
    return this.renderField('label-static', { label, name, type, placeholder });
  };

  renderFloating = ({ label, name, type, placeholder }) => {
    return this.renderField('label-floating', {
      label,
      name,
      type,
      placeholder
    });
  };

  render() {
    const { label, name, type, placeholder } = this.props;

    if (placeholder) {
      return (
        <div className='form-group-div'>
          {this.renderStatic({ label, name, type, placeholder })}
        </div>
      );
    }

    return (
      <div className='form-group-div'>
        {this.renderFloating({ label, name, type, placeholder })}
      </div>
    );
  }
}

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  validate: PropTypes.func
};
