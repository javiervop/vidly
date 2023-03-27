import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const errors = {};
    const { data } = this.state;
    const options = { abortEarly: true };
    const result = Joi.validate(data, this.schema, options);
    const { error } = result;
    if (!error) return errors;
    console.log(
      "validate results: ",
      Object.keys(error),
      error.details,
      Object.keys(error).length
    );
    // ['isJoi', 'name', 'details', '_object', 'annotate'] ==> error.details[0]
    error.details.map((item) => (errors[item.path[0]] = item.message));
    return errors;
    // return Object.keys(errors).length === 0 ? null : errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema, { abortEarly: true });
    return error ? error.details[0].message : null;
  };

  checkIferrors = () => {
    // return Object.keys(this.state.errors).length > 0;
    return false;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (Object.keys(errors).length > 0) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    // since we destructure e.currentTarget from e
    // one could repace e.currentTarget with "input"
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  renderBotton = (label) => {
    return (
      <button
        disabled={this.checkIferrors()}
        type="submit"
        className="btn btn-primary"
      >
        {label}
      </button>
    );
  };

  renderInput = (name, label, help, type = "text") => {
    const { errors } = this.state;
    return (
      <Input
        name={name}
        value={this.state.data[name] || ""}
        errors={errors[name]}
        label={label}
        help={help}
        type={type}
        onChange={this.handleChange}
      />
    );
  };

  renderSelect = (name, label, help, genres) => {
    const { errors } = this.state;
    return (
      <Select
        name={name}
        value={this.state.data[name]}
        errors={errors[name]}
        label={label}
        help={help}
        onChange={this.handleChange}
        options={genres}
      />
    );
  };
}

export default Form;
