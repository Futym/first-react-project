import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar/>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
