import React from 'react';
import FormField from './formField';
import Input from './input';

export default class InputField extends React.Component {
  static propTypes = {
    ...FormField.propTypes
  };

  onChange = (onChange, e) => {
    onChange(e.target.value, e);
  };

  render() {
    let {inputStyle, inputClassName, ...otherProps} = this.props;
    return (
      <FormField {...this.props}>
        {({onChange, ...formFieldProps}) => (
          <Input
            style={inputStyle}
            {...otherProps}
            className={inputClassName}
            onChange={this.onChange.bind(this, onChange)}
            {...formFieldProps}
          />
        )}
      </FormField>
    );
  }
}
