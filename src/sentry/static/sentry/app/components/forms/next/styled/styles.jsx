import {css} from 'react-emotion';

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


export {
  inputStyles,
};
