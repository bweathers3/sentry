import PropTypes from 'prop-types';
import React from 'react';
import {Observer} from 'mobx-react';

import FormModel from './model';
import {t} from '../../../locale';

export default class Form extends React.Component {
  static propTypes = {
    cancelLabel: PropTypes.string,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    onSubmitSuccess: PropTypes.func,
    onSubmitError: PropTypes.func,
    submitDisabled: PropTypes.bool,
    submitLabel: PropTypes.string,
    footerClass: PropTypes.string,
    extraButton: PropTypes.element,
    initialData: PropTypes.object,
    requireChanges: PropTypes.bool,
    allowUndo: PropTypes.bool,
    saveOnBlur: PropTypes.bool,
    apiMethod: PropTypes.string,
    apiEndpoint: PropTypes.string
  };

  static defaultProps = {
    cancelLabel: t('Cancel'),
    submitLabel: t('Save Changes'),
    submitDisabled: false,
    footerClass: 'form-actions align-right',
    className: 'form-stacked',
    requireChanges: false,
    allowUndo: false,
    saveOnBlur: false
  };

  static childContextTypes = {
    saveOnBlur: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    let {saveOnBlur, apiEndpoint, apiMethod, initialData} = props;

    this.model = new FormModel({
      saveOnBlur,
      apiEndpoint,
      apiMethod,
      initialData
    });

    window.test = this.model;
  }

  getChildContext() {
    return {
      saveOnBlur: this.props.saveOnBlur,
      form: this.model
    };
  }

  onSubmit = e => {
    e.preventDefault();
    if (this.model.isSaving) {
      return;
    }

    this.props.onSubmit(this.model.getData(), this.onSubmitSuccess, this.onSubmitError);
  };

  onSubmitSuccess = data => {
    this.model.submitSuccess(data);
    this.props.onSubmitSuccess && this.props.onSubmitSuccess(data);
  };

  onSubmitError = error => {
    this.model.submitError(error);
    this.props.onSubmitError && this.props.onSubmitError(error);
  };

  render() {
    let {isSaving} = this.model;
    let {
      className,
      children,
      footerClass,
      submitDisabled,
      submitLabel,
      cancelLabel,
      onCancel,
      extraButton,
      requireChanges,
      saveOnBlur
    } = this.props;
    let shouldShowFooter = !saveOnBlur;

    return (
      <form onSubmit={this.onSubmit} className={className}>
        <Observer>
          {() => {
            return this.model.isError
              ? <div className="alert alert-error alert-block">
                  {t(
                    'Unable to save your changes. Please ensure all fields are valid and try again.'
                  )}
                </div>
              : null;
          }}
        </Observer>

        {children}

        {shouldShowFooter &&
          <div className={footerClass} style={{marginTop: 25}}>
            <Observer>
              {() => (
                <button
                  className="btn btn-primary"
                  disabled={
                    this.model.isError ||
                      isSaving ||
                      submitDisabled ||
                      (requireChanges ? !this.model.formChanged : false)
                  }
                  type="submit">
                  {submitLabel}
                </button>
              )}
            </Observer>

            {onCancel &&
              <button
                type="button"
                className="btn btn-default"
                disabled={isSaving}
                onClick={onCancel}
                style={{marginLeft: 5}}>
                {cancelLabel}
              </button>}
            {extraButton}
          </div>}
      </form>
    );
  }
}
