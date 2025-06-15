import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedPortfolio } from '../../config/api';

export default function SharedPortfolioPage() {
  const { token } = useParams();
  const [portfolio, setPortfolio] = useState();

  useEffect(() => {

   document.title = "Portfolio";

    const fetchData = async () => {
      try {
        const res = await getSharedPortfolio(token);
        console.log('API response:', res);
        setPortfolio(res.data.portfolio); 
      } catch (err) {
        console.error('Portfolio not found');
      }
    };
    fetchData();
  }, [token]);

  if (!portfolio) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-gray-600">Loading portfolio data...</span>
  </div>
    );
  }

  const student = portfolio.Student;
  const sections = portfolio.PortfolioSections || [];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-6">
          {portfolio.general_image_URL ? (
            <img
              src={portfolio.general_image_URL}
              alt="Portfolio"
              className="w-full h-64 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
              No image provided
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shared Portfolio</h1>
        <p className="text-gray-600 mb-4">{portfolio.general_description}</p>

        <div className="text-sm text-gray-500 mb-6 space-y-1">
          <p><strong>Views:</strong> {portfolio.views}</p>
          <p><strong>Shared At:</strong> {new Date(portfolio.sharedAt).toLocaleString()}</p>
          {student && (
            <p><strong>Owner:</strong> {student.first_name} {student.middle_name} {student.last_name}</p>
          )}
        </div>

        {sections.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sections</h2>
            <ul className="space-y-4">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <h3 className="font-medium text-gray-800">{section.subtitle}</h3>
                  <p className="text-gray-600 text-sm">{section.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
