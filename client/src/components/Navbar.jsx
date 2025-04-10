import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const authLinks = (
    <>
      <li>
        <Link to="/documents">My Documents</Link>
      </li>
      <li>
        <Link to="/editor">New Document</Link>
      </li>
      <li>
        <a href="#!" onClick={onLogout}>
          Logout
        </a>
      </li>
      {user && <li>Welcome, {user.username}</li>}
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">WriteSync Editor</Link>
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </nav>
  );
};

export default Navbar;
