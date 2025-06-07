import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const PortfolioTitle = ({ title, imageUrl }) => {
  return (
    <div className="bg-gray-200 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-2">
        <div className="w-20 h-20 bg-gray-400 rounded overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Portfolio"
              className="w-full h-full object-cover"
            />
          ) : (
            <FontAwesomeIcon icon={faImage} className="text-white text-3xl" />
          )}
        </div>
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
};

export default PortfolioTitle;
