import {Box, Flex} from 'grid-emotion';
import {Observer, observer} from 'mobx-react';
import {withTheme} from 'emotion-theming';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, {css} from 'react-emotion';

import FormState from '../state';

const SettingsPanelItemWrapper = withTheme(
  styled(Flex)`
    padding: 15px 20px;
    border-bottom: 1px solid ${p => p.theme.borderLight};
    align-items: center;
    transition: background .15s;

    ${p => {
    if (p.error) {
      return css`
        background: ${p.theme.alert.error.background};
        border: 1px solid ${p.theme.alert.error.border};
        margin: -1px -1px 0;
      `;
    }
  }}

    &:last-child {
      border-bottom: none;
    }
  `
);

const SettingsPanelItemLabel = styled.div`
  color: ${p => (p.error ? p.theme.alert.error.textDark : p.theme.gray5)};
`;

const SettingsPanelItemCtrl = styled(Box)`
  color: ${p => p.theme.gray3};
  width: 50%;
  padding-left: 10px;
  position: relative;
`;

const SettingsPanelItemDesc = styled(Box)`
  width: 50%;
  padding-right: 10px;
`;

const SettingsRequiredBadge = withTheme(
  styled.div`
    display: inline-block;
    background: ${p => (p.error ? p.theme.alert.error.textLight : p.theme.gray2)};
    width: 5px;
    height: 5px;
    border-radius: 5px;
    text-indent: -9999em;
    vertical-align: super;
  `
);

const SettingsPanelItemHelp = styled.div`
  color: ${p => (p.error ? p.theme.alert.error.textLight : p.theme.gray2)};
  font-size: 14px;
  margin-top: 8px;
  line-height: 1.4;
`;

const SettingsErrorReason = withTheme(
  styled.div`
    color: ${p => p.theme.alert.error.textLight};
    position: absolute;
    left: 9px;
    background: #fff;
    padding: 8px 10px;
    font-size: 12px;
    border: 1px solid ${p => p.theme.alert.error.border};
  `
);

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

  componentDidMount() {
    // Tell model this field is required
    // TODO?: add more validation types
    // this.attachTooltips();
    this.context.form.setRequired(this.props.name, this.props.required);
  }

  componentWillUnmount() {
    //this.removeTooltips();
    jQuery(ReactDOM.findDOMNode(this)).unbind();
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

  handleChange = value => {
    this.context.form.setValue(this.props.name, value);
    this.props.onChange && this.props.onChange(value);
  };

  handleBlur = value => {
    if (!this.context.saveOnBlur) return;

    this.context.form.saveField(this.props.name, value);
  };

  render() {
    let {required, label, disabled, disabledReason, hideErrorMessage, help} = this.props;
    let error = this.getError();
    let shouldShowErrorMessage = error && !hideErrorMessage;
    let id = this.getId();
    let model = this.context.form;

    return (
      <SettingsPanelItemWrapper error={error}>
        <SettingsPanelItemDesc>
          {label &&
            <SettingsPanelItemLabel error={error}>
              {label} {required && <SettingsRequiredBadge error={error} />}
            </SettingsPanelItemLabel>}
          {help && <SettingsPanelItemHelp error={error}>{help}</SettingsPanelItemHelp>}
        </SettingsPanelItemDesc>
        <SettingsPanelItemCtrl>

          <Observer>
            {() => {
              return (
                <this.props.children
                  {...{
                    ...this.props,
                    id,
                    isSaving: model.getFieldState(this.props.name) === FormState.SAVING,
                    isSaved: model.getFieldState(this.props.name) === FormState.READY,
                    onChange: this.handleChange,
                    onBlur: this.handleBlur,
                    value: model.getValue(this.props.name)
                  }}
                />
              );
            }}
          </Observer>

          {disabled &&
            disabledReason &&
            <span className="disabled-indicator tip" title={disabledReason}>
              <span className="icon-question" />
            </span>}
          {shouldShowErrorMessage && <SettingsErrorReason>{error}</SettingsErrorReason>}
        </SettingsPanelItemCtrl>
      </SettingsPanelItemWrapper>
    );
  }
}

export default FormField;
