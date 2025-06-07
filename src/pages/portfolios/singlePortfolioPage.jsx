import { useEffect } from "react";
import Portfolio from "../../sections/portfolios/portfolio";
import { useLocation } from 'react-router-dom';

function PortfoliosPage() {
    const { state } = useLocation();
    const portfolio = state?.portfolio;

  useEffect(() => {
    document.title = "Portfolio";

    if (!portfolio) {
      console.warn("No portfolio data received.");
    }
  }, [portfolio]);
  
    return (
        <Portfolio portfolio={portfolio}/>
    );
  }
  
  export default PortfoliosPage;