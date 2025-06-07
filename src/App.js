import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

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

function App() {
  return (
    <AuthProvider>
    <Router>
        <ConditionalNavBar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/portfolios" element={
            <PrivateRoute>
            <PortfoliosPage />
            </PrivateRoute>
            } /> */}
          <Route path="/portfolios" element={<PortfoliosPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/jobs" element={<JobListingsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Routes>
    </Router>
  </AuthProvider>
  );
}

function ConditionalNavBar() {
  const location = useLocation();
  const hideNavRoutes = ["/", "/forbiden"];

  if (hideNavRoutes.includes(location.pathname)) {
    return null; 
  }

  return <NavBar />;
}

export default App;
