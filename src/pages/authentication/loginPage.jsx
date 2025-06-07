import React, { useEffect } from "react";
import Login from "../../sections/authentication/login";

function LoginPage() {
  useEffect(() => {
    document.title = "Login";
  }, []);

  return <Login />;
}

export default LoginPage;