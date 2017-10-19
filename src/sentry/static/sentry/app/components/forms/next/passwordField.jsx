import PropTypes from 'prop-types';
import React from 'react';
import InputField from './inputField';
import FormState from './state';

// TODO(dcramer): im not entirely sure this is working correctly with
// value propagation in all scenarios
export default class PasswordField extends React.Component {
  static propTypes = {
    ...InputField.propTypes,
    hasSavedValue: PropTypes.bool,
    prefix: PropTypes.string
  };

  static defaultProps = {
    ...InputField.defaultProps,
    hasSavedValue: false,
    prefix: ''
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      editing: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // close edit mode after successful save
    // TODO(dcramer): this needs to work with this.context.form
    if (
      this.props.formState &&
      this.props.formState === FormState.SAVING &&
      nextProps.formState === FormState.READY
    ) {
      this.setState({
        editing: false
      });
    }
  }

  cancelEdit = e => {
    e.preventDefault();
    this.setState(
      {
        editing: false
      },
      () => {
        this.context.form.setValue(this.props.name, '');
      }
    );
    if (this.props.onCancelEdit) {
      this.props.onCancelEdit(e);
    }
  };

  startEdit = e => {
    e.preventDefault();
    this.setState({
      editing: true
    });

    if (this.props.onStartEdit) {
      this.props.onStartEdit(e);
    }
  };

  render() {
    let {hasSavedValue, ...otherProps} = this.props;

    if (!hasSavedValue) {
      return <InputField {...otherProps} type="password" />;
    }

    if (this.state.editing) {
      return (
        <div className="form-password editing">
          <div>
            <InputField {...otherProps} type="password" />
          </div>
          <div>
            <a onClick={this.cancelEdit}>Cancel</a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="form-password saved">
          <span>
            {this.props.prefix + new Array(21 - this.props.prefix.length).join('*')}
          </span>
          {!this.props.disabled && <a onClick={this.startEdit}>Edit</a>}
        </div>
      );
    }
  }
}
