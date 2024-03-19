// "use client";

// import React from "react";
// import { Navbar, Nav } from "react-bootstrap";
// import PropTypes from "prop-types";

// function NavbarComponent({ onLogin, onLogout, isLoggedIn }) {
//   const handleLogin = () => {
//     onLogin();
//   };

//   const handleLogout = () => {
//     onLogout();
//   };

//   return (
//     <Navbar bg="light" data-bs-theme="light">
//       <Navbar.Brand href="/">Unify</Navbar.Brand>
//       <Nav className="ms-auto">
//         {!isLoggedIn && (
//           <Nav.Link href="#" onClick={handleLogin}>
//             Login to Spotify
//           </Nav.Link>
//         )}
//         {isLoggedIn && (
//           <Nav.Link href="#" onClick={handleLogout}>
//             Logout
//           </Nav.Link>
//         )}
//       </Nav>
//     </Navbar>
//   );
// }

// NavbarComponent.propTypes = {
//   onLogin: PropTypes.func.isRequired,
//   onLogout: PropTypes.func.isRequired,
//   isLoggedIn: PropTypes.bool.isRequired,
// };

// export default NavbarComponent;
