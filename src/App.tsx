import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Members from './pages/Members';
import Memberships from './pages/Memberships';
import Users from './pages/Users';
import Login from './pages/Login';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/members" element={<Members />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
