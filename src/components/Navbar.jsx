"use client";

import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function GlobalNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Navbar.Brand>Unify</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Navbar>
  );
}

export default GlobalNavbar;
