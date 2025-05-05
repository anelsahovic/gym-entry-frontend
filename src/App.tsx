import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Members from './pages/Members';
import Memberships from './pages/Memberships';
import Users from './pages/Users';
import Login from './pages/Login';
import Layout from './components/Layout';
import { SidebarProvider } from './contexts/SidebarContext';
import ShowMember from './pages/ShowMember';
import UserProfile from './pages/UserProfile';

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
          <Route path="/dashboard" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<ShowMember />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
