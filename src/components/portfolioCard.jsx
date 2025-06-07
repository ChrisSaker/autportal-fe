import { useState } from "react";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import {
  faEye,
  faComment,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPortfolioById, viewPortfolio } from "../config/api";
import { useNavigate } from "react-router-dom";

const Portfolio = ({ portfolio }) => {
  const [portfolioMenuOpen, setportfolioMenuOpen] = useState(false);
  const [commentsDropdownOpen, setCommentsDropdownOpen] = useState(false);
  const [openCommentMenuId, setOpenCommentMenuId] = useState(null);

  const navigate = useNavigate();

  const handleMenuClick = () => {
    setportfolioMenuOpen(!portfolioMenuOpen);
  };

  const handleCommentsClick = () => {
    setCommentsDropdownOpen(!commentsDropdownOpen);
  };

  const handleCommentMenuClick = (id) => {
    setOpenCommentMenuId(openCommentMenuId === id ? null : id);
  };

  const handleNavigateToPortfolio = async () => {
  try {
    const view = await viewPortfolio(portfolio.id);

    if (!view) {
      console.warn("Failed to view portfolio.");
    }

    const fullPortfolio = await getPortfolioById(portfolio.id);

    if (!fullPortfolio || !fullPortfolio.data) {
      throw new Error("Portfolio data not found.");
    }

    navigate('/portfolio', {
      state: { portfolio: fullPortfolio.data.data },
    });
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
  }
};

  return (
    <div className="relative max-w-lg bg-white rounded-lg flex flex-col shadow-md">
      <div className="flex flex-row justify-between p-4">
        <div className="flex flex-row gap-3">
          <div className="rounded-xl bg-blue-900 w-16 h-16">{/*profile*/}</div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {portfolio.student.first_name} {portfolio.student.last_name}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-200 relative h-56 flex items-center justify-center">
      <p className="p-4 text-lg absolute">{portfolio.general_description}</p>
        <button
        onClick={handleNavigateToPortfolio}
        className="absolute bottom-4 right-4 bg-gray-700 text-white text-sm font-semibold p-1 rounded">
          + view portfolio
        </button>
      </div>
      <div className="flex flex-row justify-between p-4 text-sm text-gray-600 items-center">
        <div className="flex flex-row gap-2 items-center">
          <FontAwesomeIcon icon={faEye} />
          <span>{portfolio.views === 1 ? `${portfolio.views} view` : `${portfolio.views} views`}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between p-4 text-sm border-t border-b text-gray-600 font-semibold">
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={handleCommentsClick}
            className="flex flex-row gap-2 items-center"
          >
            <FontAwesomeIcon icon={faComment} className="h-5 w-5" />
            <span>Suggest</span>
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <FontAwesomeIcon icon={faShareNodes} className="h-5 w-5" />
          <span>Share portfolio</span>
        </div>
      </div>
      {commentsDropdownOpen && (
        <div className="flex flex-col w-full gap-6 p-4">
          <div className="flex flex-row gap-4 w-full justify-between">
            <div className="bg-gray-200 border border-amber-50 w-12 h-12 rounded-lg">
              {/*image*/}
            </div>
            <div className="flex border border-gray-300 w-5/6 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                placeholder="Write a comment"
                className="flex-grow p-2 outline-none min-w-0 focus:outline-none focus:border-green-500"
              />
              <button className="bg-green-500 text-white px-2 m-2 rounded flex-shrink-0">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
