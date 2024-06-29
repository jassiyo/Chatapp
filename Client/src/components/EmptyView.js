import React, { useState } from "react";
import "../App.css";
import TypingText from "./TypingText/TypingText";
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
//   const [isHovered, setIsHovered] = useState(null);
//   const handleMouseEnter = (sessionId) => {
//     setIsHovered(sessionId);
//   };

//   const handleMouseLeave = (sessionId) => {
//     // Close the hover state only if the more actions menu is not showing for this session
//     setIsHovered(null);
//   };
    
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
            <button className="buttonView" onClick={onClick}>
              <p>{val}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
