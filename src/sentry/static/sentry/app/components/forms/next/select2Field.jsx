import jQuery from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';

import InputField from './inputField';

export default class Select2Field extends React.Component {
  static propTypes = {
    ...InputField.propTypes,
    choices: PropTypes.array.isRequired,
    allowClear: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    multiple: PropTypes.bool,
    escapeMarkup: PropTypes.bool
  };

  static defaultProps = {
    ...InputField.defaultProps,
    allowClear: false,
    allowEmpty: false,
    placeholder: '--',
    escapeMarkup: true,
    multiple: false
  };

  componentWillUnmount() {
    if (this.select) {
      jQuery(this.select).select2('destroy');
    }
  }

  onChange = (onChange, e) => {
    if (this.props.multiple) {
      let options = e.target.options;
      let value = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      onChange(value, e);
    } else {
      onChange(e.target.value, e);
    }
  };

  handleSelectMount = (ref) => {
    if (ref) {
      this.select = ref;
      jQuery(this.select).select2(this.getSelect2Options()).on('change', this.onChange);
    }
  }


  getSelect2Options() {
    return {
      allowClear: this.props.allowClear,
      allowEmpty: this.props.allowEmpty,
      width: 'element',
      escapeMarkup: !this.props.escapeMarkup ? m => m : undefined
    };
  }

  render() {
    return (
      <InputField
        {...this.props}
        field={(onChange, ...props) => (
          <select ref={this.handleSelectMount} {...props} onChange={this.onChange.bind(this, onChange)}>
            {(this.props.choices || []).map(choice => {
              return (
                <option key={choice[0]} value={choice[0]}>
                  {choice[1]}
                </option>
              );
            })}
          </select>
        )}
      />
    );
  }
}
