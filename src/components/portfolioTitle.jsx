
const PortfolioTitle = ({ title, imageUrl }) => {
  return (
    <div
      className={`p-6 rounded-lg text-center flex items-center justify-center ${
        imageUrl ? '' : 'bg-gray-200'
      }`}
      style={{
        backgroundImage: imageUrl ? `url(http://localhost:8080${imageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '150px', // optional height
      }}
    >
      <h2 className="text-xl font-semibold text-white backdrop-blur-sm bg-black/30 px-4 py-2 rounded">
        {title}
      </h2>
    </div>
  );
};

export default PortfolioTitle;
