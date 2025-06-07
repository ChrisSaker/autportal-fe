const PortfolioSection = ({ title, children }) => {
    return (
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">{title}</h3>
        {children}
      </div>
    );
  };
  
  export default PortfolioSection;
  