import React, { useState } from "react";
import "../App.css";
import TypingText from "./TypingText/TypingText";
import Modal from "./Modal/Modal";
const cases = [
  "Contract",
  "Corporate",
  "Fraud",
  "Tort",
  "Class Action",
  "Murder",
  "Rent Agreement",
];
  
const cases2 = ["Test1", "Test2", "test3", "test4", "test5"];

export function EmptyView({sendMessage, fetchSessions, fetchChatLog, createNewSession, setActiveSession}) {
  const [modalOpen, setModalOpen] = useState(false); 
  const [modalContent, setModalContent] = useState('');
  
  // Function to open modal
  const openModal = async (val) => {
    setModalContent(val); // Set modal content based on button click
    setModalOpen(true); // Open the modal
    const id = await createNewSession();
    setActiveSession(id);
    sendMessage({ sessionId: id, message: 'I need help with ' + val });
    await fetchChatLog();
  };

   // Function to close modal
   const closeModal = () => {
    setModalOpen(false);
    setModalContent('');
  };
    
  return (
    <div className="EmptyParent">
      <div className="EmptyText">
        {/* <h1>{"Hello what can I help you with"}</h1> */}
        <TypingText text={"Hello How can I help you"} />
      </div>
      <div className="EmptyView">
        {cases.map((val) => {
            const onClick =  async () => {
                const id = await createNewSession()
                setActiveSession(id)
                sendMessage({sessionId: id,message: 'I need help with '+val})
                await fetchChatLog()
            }
          return (
            <button className="buttonView" onClick={onClick}>
              <p>{val}</p>
            </button>
          );
        })}
      </div>
      <div className="EmptyView EmptyView2">
        {cases2.map((val) => {
            const onClick =  async() => {
                const id = await createNewSession()
                setActiveSession(id)
                sendMessage({sessionId: id,message: 'I need help with '+val})
                await fetchChatLog()
            }
          return (
            <button className="buttonView" onClick={() => openModal(val)}>
                      <p>{val}</p>
                      
            </button>
          );
        })}
      </div>
      {/* Modal component */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        <h2>Modal Content</h2>
        <p>You clicked: {modalContent}</p>
        {/* Additional modal content based on modalContent state */}
      </Modal>
    </div>
  );
}
