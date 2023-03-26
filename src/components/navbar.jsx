import React from "react";
import { NavLink, Link } from "react-router-dom";

const NavBar = ({ user }) => {
  // it seems during rendering user may not be availabe, until mount completes
  const name = user ? user.name : "";
  let navLinks = [
    { to: "/movies", text: "Movies" },
    { to: "/customers", text: "Customers" },
    { to: "/rentals", text: "Rentals" },
  ];
  if (!name) {
    navLinks.push({ to: "/login", text: "Login" });
    navLinks.push({ to: "/register", text: "Register" });
  } else {
    navLinks.push({ to: "/profile", text: name });
    navLinks.push({ to: "/logout", text: "Logout" });
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Vidly
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          {navLinks.map((navLink) => (
            <NavLink
              className="nav-item nav-link"
              key={navLink.to}
              to={navLink.to}
            >
              {navLink.text}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
