import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import AuthUser from "./components/AuthUser";
import Guest from "./components/navbar/guest";
import Auth from "./components/navbar/auth";

function App() {
  const { getToken } = AuthUser();

  // Conditionally render either Guest or Auth based on user authentication
  return getToken() ? <Auth /> : <Guest />;
}

export default App;
