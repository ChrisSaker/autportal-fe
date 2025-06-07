import React, { useEffect } from "react";
import Notifications from "../../sections/others/notifications"

function PortfoliosPage() {
    useEffect(() => {
      document.title = "Notifications";
    }, []);
  
    return (
        <Notifications />
    );
  }
  
  export default PortfoliosPage;