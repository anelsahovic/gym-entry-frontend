import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import Members from './pages/Members';
import Memberships from './pages/Memberships';
import Users from './pages/Users';
import Login from './pages/Login';
import Layout from './components/Layout';
import { SidebarProvider } from './contexts/SidebarContext';
import ShowMember from './pages/ShowMember';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          }
        >
          <Route path="/scan" element={<Scan />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<ShowMember />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserProfile />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
