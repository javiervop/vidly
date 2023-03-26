import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import * as userService from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
      name: "",
    },
    errors: {
      username: "",
      password: "",
      name: "",
    },
    userId: "new",
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username")
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: Joi.string().required().label("Password").min(5).max(15),
    name: Joi.string().required().label("Name"),
  };

  doSubmit = async () => {
    // console.log("this.state.data", this.state.data);
    try {
      const resp = await userService.saveuser(
        this.state.data,
        this.state.userId
      );
      // console.log("doSubmit", resp);
      // console.log("this.state.data", this.state.data);
      this.setState({
        data: {
          username: resp.data["email"], // || this.state.data["username"],
          password: this.state.data["password"],
          name: resp.data["name"],
          isAdmin: resp.data["isAdmin"],
        },
        userId: resp.data._id,
      });
      // console.log("doSubmit", resp);
      // {data:.jwt., status: 200, statusText: OK, config:.., headers:..x-auth-token.., request:...}
      // note we can read the token from the body or from header
      // it is good practive to read from headers
      // localStorage.setItem("token", resp.data["jwt"]);
      auth.setUserToken(resp.data["jwt"]);
      // this.props.history.push("/");
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        // console.log("this.state.data", this.state.data);
        const errors = { ...this.state.errors };
        console.log("ex.response:", ex.response);
        errors.username = ex.response.data.message;
        this.setState({ errors });
      }
    }
  };

  render() {
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
          {this.renderInput("name", "Name", "Please provide a name")}

          {this.renderBotton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
