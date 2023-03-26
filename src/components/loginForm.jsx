import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
    },
    errors: {
      username: "",
      password: "",
    },
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  // limit or avoid the usage of Ref on your code
  // use it just when necessary
  username = React.createRef();

  componentDidMount() {
    // this.username.current.focus();
  }

  doSubmit = async () => {
    try {
      const { username, password } = this.state.data;
      const resp = await auth.login(username, password);
      // const { data: jwt } = await login(username, password);
      // {data:.jwt., status: 200, statusText: OK, config:.., headers:..x-auth-token.., request:...}
      // console.log(resp);
      // localStorage.setItem("token", jwt);
      // the below return to previously load
      // this.props.history.push("/");
      // the window option reload the page
      // causing the full reload of the app
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput(
            "username",
            "Username",
            "We'll never share your email/username with anyone else."
          )}
          {this.renderInput(
            "password",
            "Password",
            "Provide a secure password",
            "password"
          )}
          {this.renderBotton("login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
