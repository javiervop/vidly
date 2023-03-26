import React from "react";

const Select = ({ name, label, help, errors, options, ...rest }) => {
  // note arguments only use inside input could
  // automatically include by using ...rest parameter
  // className="custom-select"
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        {...rest}
        name={name}
        id={name}
        aria-describedby={{ name } + "Help"}
        className="form-control"
      >
        <option value="" />
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      <small id={{ name } + "Help"} className="form-text text-muted">
        {help}
      </small>
      {errors && <div className="alert alert-danger">{errors}</div>}
    </div>
  );
};

export default Select;
