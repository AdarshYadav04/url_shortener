import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import NotFound from './pages/Notfound/Notfound.jsx';

const App=()=> {
  return (
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
  );
}

export default App;