import classNames from 'classnames';
import {Observer, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {defined} from '../../utils';
import FormState from './state';

@observer class FormField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    /** Inline style */
    style: PropTypes.object,

    label: PropTypes.string,
    defaultValue: PropTypes.any,
    disabled: PropTypes.bool,
    disabledReason: PropTypes.string,
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    required: PropTypes.bool,
    hideErrorMessage: PropTypes.bool,

    // the following should only be used without form context
    onChange: PropTypes.func,
    error: PropTypes.string,
    value: PropTypes.any
  };

  static defaultProps = {
    hideErrorMessage: false,
    disabled: false,
    required: false
  };

  static contextTypes = {
    saveOnBlur: PropTypes.bool,
    form: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    // XXX: from merge
    // this.state = {
      // value: this.getValue(props, context)
    // };
    super(props, context);
  }

  componentDidMount() {
    // Tell model this field is required
    // TODO?: add more validation types
    this.context.form.setRequired(this.props.name, this.props.required);
    // this.context.form.addField(this.props.name, {
    // required: this.props.required,
    // });
  }


  componentWillReceiveProps(nextProps, nextContext) {
    // XXX merge
    // if (
      // this.props.value !== nextProps.value ||
      // (!defined(this.context.form) && defined(nextContext.form))
    // ) {
      // this.setValue(this.getValue(nextProps, nextContext));
    // }
  }

  componentWillUnmount() {
    //this.removeTooltips();
    jQuery(ReactDOM.findDOMNode(this)).unbind();
  }

  getValue(props, context) {
    let form = (context || this.context || {}).form;
    props = props || this.props;
    if (defined(props.value)) {
      return props.value;
    }
    if (form && form.data.hasOwnProperty(props.name)) {
      return form.data[props.name];
    }
    return props.defaultValue || '';
  }

  attachTooltips() {
    jQuery('.tip', ReactDOM.findDOMNode(this)).tooltip();
  }

  removeTooltips() {
    jQuery('.tip', ReactDOM.findDOMNode(this)).tooltip('destroy');
  }

  getError(props, context) {
    return this.context.form.getError(this.props.name);
  }

  getId() {
    return `id-${this.props.name}`;
  }

  setValue = value => {
    this.context.form.setValue(this.props.name, value);
    this.props.onChange && this.props.onChange(value);
  };

  handleBlur = e => {
    if (!this.context.saveOnBlur) return;

    this.context.form.saveField(this.props.name, e.currentTarget.value);
  };

  render() {
    let {
      className,
      required,
      label,
      disabled,
      disabledReason,
      hideErrorMessage,
      help,
      style
    } = this.props;
    let error = this.getError();
    let cx = classNames(className, this.getClassName(), {
      'has-error': !!error,
      required
    });
    let shouldShowErrorMessage = error && !hideErrorMessage;
    let id = this.getId();
    let model = this.context.form;

    return (
      <div style={style} className={cx}>
        <div className="controls">
          {label &&
            <label htmlFor={id} className="control-label">
              {label}
            </label>}
          <div>

            <Observer>
              {() => (
                <this.props.children
                  {...{
                    ...this.props,
                    id,
                    onChange: this.setValue,
                    onBlur: this.handleBlur,
                    value: model.getValue(this.props.name)
                  }}
                />
              )}
            </Observer>

            <Observer>
              {() => {
                if (model.getFieldState(this.props.name) === FormState.SAVING) {
                  return <span>Saving</span>;
                }

                if (model.getFieldState(this.props.name) === FormState.READY) {
                  return <span>Saved!</span>;
                }

                return null;
              }}
            </Observer>

          </div>

          {disabled &&
            disabledReason &&
            <span className="disabled-indicator tip" title={disabledReason}>
              <span className="icon-question" />
            </span>}
          {defined(help) && <p className="help-block">{help}</p>}
          {shouldShowErrorMessage && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }
}

export default FormField;
