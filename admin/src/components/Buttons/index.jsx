import React from 'react'

const Button = ({
  label = 'click me',
  type = 'button',
  style = {},
  border = 'none',
  onClick = () => { },
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      style={style}
      className={`btn btn__border--${border} btn--${variant} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

export default Button;