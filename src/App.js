import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import LoginPage from "./pages/authentication/loginPage";
import HomePage from "./pages/home/homePage";
import PortfoliosPage from "./pages/portfolios/portfolioPage";
import NavBar from "./sections/dashboard/navBar";
import JobListingsPage from "./pages/listings/jobListingsPage";
import PrivateRoute from "./guards/PrivateRoute";
import { AuthProvider } from "./guards/AuthContext";
import UsersPage from "./pages/users/usersPage";
import NotificationPage from "./pages/others/notificationsPage";
import ProfilePage from "./pages/users/profilePage";
import PortfolioPage from "./pages/portfolios/singlePortfolioPage";
import SharedPortfolioPage from "./pages/portfolios/sharedPortfolioPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavBar />
        <Routes>
          <Route
            path="/shared/portfolio/:token"
            element={<SharedPortfolioPage />}
          />
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/portfolios"
            element={
              <PrivateRoute>
                <PortfoliosPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <PrivateRoute>
                <PortfolioPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <PrivateRoute>
                <JobListingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ConditionalNavBar() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/forbiden", "/shared/portfolio/:token"];
  const isSharedPortfolio = location.pathname.startsWith("/shared/portfolio/");

  if (hideNavRoutes.includes(location.pathname) || isSharedPortfolio) {
    return null;
  }

  return <NavBar />;
}

export default App;
