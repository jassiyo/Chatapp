import "./App.css";
import LegalChatBot from "./components/LegalChatBot/LegalChatBot";
import Login from "./components/Pages/Login/Login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./components/Pages/Register/Register";
import Modal from "./components/Modal/Modal";
import NewChatModal from "./components/Modal/ModalContent/NewChatModal";

function App() {

  
  return (
   <>
      <Router>
      <Routes>
        <Route path="/" element={<LegalChatBot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/modal" element={<NewChatModal />} />
      </Routes>
    </Router>
   </>
  );
};
export default App;
