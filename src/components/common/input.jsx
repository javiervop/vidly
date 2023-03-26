import React from "react";

const Input = ({ name, label, help, errors, ...rest }) => {
  // note arguments only use inside input could
  // automatically include by using ...rest parameter
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        name={name}
        id={name}
        aria-describedby={{ name } + "Help"}
        className="form-control"
      />
      <small id={{ name } + "Help"} className="form-text text-muted">
        {help}
      </small>
      {errors && <div className="alert alert-danger">{errors}</div>}
    </div>
  );
};

export default Input;
