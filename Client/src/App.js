import "./App.css";
import LegalChatBot from "./components/LegalChatBot/LegalChatBot";
import Login from "./components/Pages/Login/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./components/Pages/Register/Register";

function App() {

  
  return (
   <>
      <Router>
      <Routes>
        <Route path="/" element={<LegalChatBot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
   </>
  );
};
export default App;
