import {Box, Flex} from 'grid-emotion';
import {withTheme} from 'emotion-theming';
import React from 'react';
import styled, {css} from 'react-emotion';

import Switch from '../../../components/switch';

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

const inputStyles = props => css`
  color: ${props.theme.gray5};
  display: block;
  width: 100%;
  border: 0;
  padding: 10px;
  transition: border .2s ease;

  &:focus {
    outline: none;
    background: ${p => (props.error ? '#fff' : '#f7f7f9')};
    border-bottom-color: ${p => props.theme.blue};
  }

  ${p => {
  if (props.hover) {
    return css`
      background: ${p => (props.error ? '#fff' : props.theme.offWhite)};
      `;
  }
}}

 ${p => {
  if (props.error) {
    return css`
    box-shadow: 0 0 0 1px ${props.theme.alert.error.border};
    &:hover:focus {
      background: #fff !important;
    }
    `;
  }
}}

  &::placeholder {
    color: ${props.theme.gray2};
  }
`;

const SettingsInputField = styled.input`
  ${inputStyles};

`;

const SettingsTextarea = styled.textarea`
  ${inputStyles};

`;

const SettingsInput = React.createClass({
  render() {
    let {type, placeholder, defaultValue, hover, error, ...props} = this.props;
    return (
      <div>
        <SettingsInputField
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          hover={hover}
          error={error}
        />
      </div>
    );
  }
});

class SettingsPanelItem extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      hover: false
    };
  }

  render() {
    let {
      label,
      required,
      type,
      help,
      placeholder,
      defaultValue,
      error,
      ...props
    } = this.props;
    return (
      <SettingsPanelItemWrapper
        onMouseEnter={() => this.setState({hover: true})}
        onMouseLeave={() => this.setState({hover: false})}
        error={error}>
        <SettingsPanelItemDesc>
          <SettingsPanelItemLabel error={error}>
            {label} {required && <SettingsRequiredBadge error={error} />}
          </SettingsPanelItemLabel>
          {help && <SettingsPanelItemHelp error={error}>{help}</SettingsPanelItemHelp>}
        </SettingsPanelItemDesc>
        <SettingsPanelItemCtrl>
          {(type == 'text' || type == 'email' || type == 'password') &&
            <SettingsInput
              hover={this.state.hover}
              type={type}
              placeholder={placeholder}
              defaultValue={defaultValue}
              error={error}
            />}
          {type == 'switch' && <Switch size="lg" error={error} />}
          {type == 'textarea' &&
            <SettingsTextarea
              placeholder={placeholder}
              hover={this.state.hover}
              error={error}
            />}
          {error && <SettingsErrorReason>Why'd this break yo?</SettingsErrorReason>}
        </SettingsPanelItemCtrl>
      </SettingsPanelItemWrapper>
    );
  }
}

export default SettingsPanelItem;
