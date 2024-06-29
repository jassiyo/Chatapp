import logo from "./logo.svg";
import "./normal.css";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Choose a style theme from react-syntax-highlighter/dist/esm/styles/prism
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { EmptyView } from "./components/EmptyView";
import { BotImage } from "./components/BotImage/BotImage";

function App() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [isHovered, setIsHovered] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [selectedSessionForActions, setSelectedSessionForActions] =
    useState(null);
  const moreActionsRef = useRef(null);

  console.log("----------------------sessions", sessions);
  // Function for session-list
  const handleMouseEnter = (sessionId) => {
    setIsHovered(sessionId);
  };

  const handleMouseLeave = (sessionId) => {
    // Close the hover state only if the more actions menu is not showing for this session
    if (selectedSessionForActions !== sessionId) {
      setIsHovered(null);
    }
  };

  // Function to enter title edit mode
  const handleEditNameClick = (sessionId, currentTitle) => {
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
    setOriginalTitle(currentTitle);
  };
  useEffect(() => {
    if (activeSession) fetchSessions();
  }, [activeSession]);
  // Function to save new title
  const handleConfirmEdit = async () => {
    if (editingTitle !== originalTitle) {
      if (editingSessionId && editingTitle.trim() !== "") {
        // Send the update to the server
        try {
          const response = await fetch(
            `http://localhost:3080/sessions/${editingSessionId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ title: editingTitle }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update session title");
          }

          const updatedSession = await response.json();
          // Update the session title in the local state with the response from the server
          setSessions(
            sessions.map((session) =>
              session._id === editingSessionId ? updatedSession : session
            )
          );

          console.log("Session title updated successfully");
        } catch (error) {
          console.error("Error updating session title:", error);
        }
      }

      // Exit edit mode
      setEditingSessionId(null);
      setEditingTitle(""); // Reset the editing title
    } else {
      // If title is unchanged, just exit edit mode without updating
      handleCancelEdit();
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // handleConfirmEdit();
    } else if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleBlur = () => {
    // handleConfirmEdit();
  };

  const handleMoreFunctionsClick = (e, sessionId) => {
    e.stopPropagation();
    if (selectedSessionForActions === sessionId) {
      setShowMoreActions(!showMoreActions);
    } else {
      setSelectedSessionForActions(sessionId);
      setShowMoreActions(true);
    }
  };

  const handleClickOutside = (event) => {
    if (
      moreActionsRef.current &&
      !moreActionsRef.current.contains(event.target)
    ) {
      closeMoreActions();
    }
  };

  // Close the more actions menu when clicking outside of it
  const closeMoreActions = () => {
    setShowMoreActions(false);
    setSelectedSessionForActions(null);
    setIsHovered(null); // Add this line to reset hover state when closing the actions menu
  };

  const handleDeleteChat = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      try {
        const response = await fetch(
          `http://localhost:3080/sessions/${sessionId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete session");
        }

        // Remove the deleted session from state
        setSessions(sessions.filter((session) => session._id !== sessionId));

        // If the deleted session is the active session, clear the active session
        if (activeSession === sessionId) {
          setActiveSession(null);
          setChatLog([]);
        }

        // Close the actions popup
        setShowMoreActions(false);

        console.log("Session deleted successfully");
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener("click", handleClickOutside, true);

    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const response = await fetch("http://localhost:3080/sessions");
      console.log("-------------------------response", response);
      const data = await response.json();
      console.log("-------------------------data", activeSession);
      setSessions(data);
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0]._id); // Set the first session as active by default if no active session is set
        fetchChatLog(data[0]._id); // Fetch the chat log for the first session
      }
    } catch (e) {
      console.log("----------------------e", e);
    }
  }

  async function fetchChatLog(sessionId) {
    try {
      const response = await fetch(
        `http://localhost:3080/sessions/${sessionId}`
      );
      if (!response.ok) throw new Error("Failed to fetch session");
      const { messages } = await response.json();
      setChatLog(messages);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  }

  function handleSessionClick(sessionId) {
    setActiveSession(sessionId);
    fetchChatLog(sessionId); // Fetch and set the chat log for the selected session
  }

  const clearChatForNew = () => {
    setChatLog([]);
    setActiveSession(null); // Clear the active session
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // If there's no active session, create a new session and use its ID
      let currentSessionId = activeSession;
      if (!currentSessionId) {
        currentSessionId = await createNewSession();
        // Directly update the active session state
        setActiveSession(currentSessionId);
      }

      const userMessage = { sessionId: currentSessionId, message: input };
      await sendMessage(userMessage);

      // Fetch the updated chat log for the current session to include the new message
      await fetchChatLog(currentSessionId);
      fetchSessions();
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  async function createNewSession() {
    try {
      const response = await fetch("http://localhost:3080/new-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat", category: "Instant Chat" }),
      });
      if (!response.ok) {
        throw new Error("Failed to create new session");
      }
      const { id } = await response.json();
      // setActiveSession(id); // Set the newly created session as active
      // setChatLog([]); // Clear the chat log for the new session
      // fetchSessions(); // Optionally, refresh the session list
      return id; // Return the new session ID to be used immediately
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  }

  const updateSessionTitle = async (sessionId, initialContent) => {
    try {
      const response = await fetch("http://localhost:3080/auto-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, initialContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to update session title");
      }

      // Assuming the updated session is returned in the response
      const updatedSession = await response.json();
      console.log("Session title updated:", updatedSession.title);

      // Refresh session list to reflect the updated title
      fetchSessions(); // Assuming fetchSessions is a function that updates your session list in the frontend
    } catch (error) {
      console.error("Error updating session title:", error);
    }
  };

  async function sendMessage(userMessage) {
    try {
      // Add the user's message to the chat log immediately with the correct role
      setChatLog((prevLog) => [
        ...prevLog,
        { role: "user", content: userMessage.message },
      ]);
      const newChatLogWithUserMessage = [
        ...chatLog,
        { role: "user", content: userMessage.message },
      ];
      setInput(""); //Clear the input after sending

      const response = await fetch("http://localhost:3080/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessage),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { reply } = await response.json();
      // Add the bot's reply to the chat log with the correct role
      setChatLog((prevLog) => [
        ...prevLog,
        { role: "assistant", content: reply },
      ]);

      const finalNewChatLog = [
        ...newChatLogWithUserMessage,
        { role: "assistant", content: reply },
      ];
      // setChatLog(finalNewChatLog);

      console.log(finalNewChatLog.length);

      if (finalNewChatLog.length === 2) {
        updateSessionTitle(userMessage.sessionId, userMessage.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="app-main-title">
          <h2>Legal Helper</h2>
        </div>
        <div className="session-list">
          <div className="new-chat-button" onClick={clearChatForNew}>
            <span>+</span>
            New Chat
          </div>
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`session-item ${
                activeSession === session._id ? "active" : ""
              }`}
              onMouseEnter={() => handleMouseEnter(session._id)}
              onMouseLeave={() => handleMouseLeave(session._id)}
            >
              {editingSessionId === session._id ? (
                <input
                  autoFocus
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyPress}
                  className="title-edit-input"
                />
              ) : (
                <span
                  className="session-title"
                  onClick={() => handleSessionClick(session._id)}
                >
                  {session.title}
                  <div className="fade-mask"></div>
                </span>
              )}

              {/* Conditionally render edit and more buttons */}
              {(isHovered === session._id || activeSession === session._id) &&
                editingSessionId !== session._id && (
                  <div className="session-actions">
                    <div
                      className="edit-name-button"
                      onClick={() =>
                        handleEditNameClick(session._id, session.title)
                      }
                    >
                      <svg
                        t="1706429867923"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="7518"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M554.666667 128v85.333333H213.333333v597.333334h597.333334v-341.333334h85.333333v341.333334a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h341.333334zM397.994667 568.661333l426.666666-426.666666 60.373334 60.373333-426.666667 426.666667-60.373333-60.373334z"
                          fill="#ececf1"
                          p-id="7519"
                        ></path>
                      </svg>
                    </div>
                    <div
                      className="more-functions-button"
                      onClick={(e) => handleMoreFunctionsClick(e, session._id)}
                    >
                      <svg
                        t="1706429736531"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="6301"
                        width="18"
                        height="18"
                      >
                        <path
                          d="M243.2 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z"
                          fill="#ececf1"
                          p-id="6302"
                        ></path>
                        <path
                          d="M512 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z"
                          fill="#ececf1"
                          p-id="6303"
                        ></path>
                        <path
                          d="M780.8 512m-83.2 0a1.3 1.3 0 1 0 166.4 0 1.3 1.3 0 1 0-166.4 0Z"
                          fill="#ececf1"
                          p-id="6304"
                        ></path>
                      </svg>
                    </div>
                    {showMoreActions &&
                      selectedSessionForActions === session._id && (
                        <div
                          className="more-actions-popup"
                          ref={moreActionsRef}
                        >
                          <ul>
                            <li>Recategorize</li>
                            <li>Share</li>
                            <li
                              className="chat-delet-action"
                              onClick={() => handleDeleteChat(session._id)}
                            >
                              Delete Chat
                            </li>
                          </ul>
                        </div>
                      )}
                  </div>
                )}
            </div>
          ))}
        </div>
        <div className="profile-space">
          <div className="user-profile">
            <div className="user-avatar">
              <img
                src="https://i.imgur.com/0UY4ifV.jpeg"
                alt="User Avatar"
                className="user-icon-image"
              />
            </div>
            <div className="user-name">Sarthak</div>
          </div>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-box-bar">
          <h3></h3>
        </div>
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {chatLog.length === 0 && (
            <EmptyView
              sendMessage={sendMessage}
              fetchSessions={fetchSessions}
              fetchChatLog={fetchChatLog}
              createNewSession={createNewSession}
              setActiveSession={setActiveSession}
            />
          )}
        </div>
        <div className="text-input-holder">
          <div className="text-input-textarea">
            <form onSubmit={handleSubmit}>
              <input
                // rows="1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-input"
                placeholder="Type your message..."
              />
              <button className="text-action-button">
                <ArrowUpwardIcon />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

const CodeBlock = ({ language, value }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(
      () => console.log("Content copied to clipboard!"),
      (err) => console.error("Failed to copy content: ", err)
    );
  };

  return (
    <div className="code-container">
      <div className="code-header">
        <span className="code-language-block-bar">{language}</span>
        <div className="copy-block-bar" onClick={handleCopy}>
          Copy
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={a11yDark}
        customStyle={{ margin: 0 }} // Remove margin from the <pre> tag
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const ChatMessage = ({ message }) => {
  const isBotMessage = message.role === "assistant";
  const isUserMessage = message.role === "user";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => console.log("Text copied to clipboard"),
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  return (
    <div className={`chat-message ${isBotMessage ? "chatgpt" : "user"}`}>
      <div className={`avatar ${isBotMessage ? "chatgpt" : "user"}`}>
        {isBotMessage && <BotImage />}
        {isUserMessage && (
          <img
            src="https://i.imgur.com/0UY4ifV.jpeg"
            alt="User Avatar"
            className="chat-icon-image"
          />
        )}
      </div>
      <div className="message-content">
        <div className="message-title">{isBotMessage ? "ChatBot" : "Me"}</div>
        <div className="message-detail">
          {isBotMessage ? (
            // Render bot's markdown reply
            <ReactMarkdown
              children={message.content}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <CodeBlock
                      language={match[1]}
                      value={String(children).replace(/\n$/, "")}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          ) : (
            // Render user's message as plain text
            message.content
          )}
        </div>
        {isUserMessage && (
          <div className="edit-icon-container">
            <div className="edit-icon">
              <svg
                t="1705879506075"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4213"
                width="16"
                height="16"
              >
                <path
                  d="M853.333333 501.333333c-17.066667 0-32 14.933333-32 32v320c0 6.4-4.266667 10.666667-10.666666 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V213.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h320c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v640c0 40.533333 34.133333 74.666667 74.666667 74.666667h640c40.533333 0 74.666667-34.133333 74.666666-74.666667V533.333333c0-17.066667-14.933333-32-32-32z"
                  fill="#8a8a8a"
                  p-id="4214"
                ></path>
                <path
                  d="M405.333333 484.266667l-32 125.866666c-2.133333 10.666667 0 23.466667 8.533334 29.866667 6.4 6.4 14.933333 8.533333 23.466666 8.533333h8.533334l125.866666-32c6.4-2.133333 10.666667-4.266667 14.933334-8.533333l300.8-300.8c38.4-38.4 38.4-102.4 0-140.8-38.4-38.4-102.4-38.4-140.8 0L413.866667 469.333333c-4.266667 4.266667-6.4 8.533333-8.533334 14.933334z m59.733334 23.466666L761.6 213.333333c12.8-12.8 36.266667-12.8 49.066667 0 12.8 12.8 12.8 36.266667 0 49.066667L516.266667 558.933333l-66.133334 17.066667 14.933334-68.266667z"
                  fill="#8a8a8a"
                  p-id="4215"
                ></path>
              </svg>
            </div>
          </div>
        )}
        {isBotMessage && (
          <div className="bot-icon-container">
            <div
              className="botmsg-icon"
              onClick={() => copyToClipboard(message.content)}
            >
              <svg
                t="1705898286996"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="15077"
                width="16"
                height="16"
              >
                <path
                  d="M512 42.666667a85.333333 85.333333 0 0 1 85.333333 85.333333h170.666667a128 128 0 0 1 128 128v554.666667a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V256a128 128 0 0 1 128-128h170.666667a85.333333 85.333333 0 0 1 85.333333-85.333333zM341.333333 192H256A64 64 0 0 0 192 256v554.666667A64 64 0 0 0 256 874.666667h512a64 64 0 0 0 64-64V256A64 64 0 0 0 768 192h-85.333333V256a42.666667 42.666667 0 0 1-42.666667 42.666667H384a42.666667 42.666667 0 0 1-42.666667-42.666667V192z m170.666667 416a32 32 0 1 1 0 64H341.333333a32 32 0 1 1 0-64h170.666667z m170.666667-170.666667a32 32 0 0 1 0 64H341.333333a32 32 0 1 1 0-64h341.333334zM512 106.666667a21.333333 21.333333 0 0 0-21.333333 21.333333 64 64 0 0 1-57.856 63.701333L426.666667 192h-21.333334v42.666667h213.333334v-42.666667H597.333333A64 64 0 0 1 533.333333 128a21.333333 21.333333 0 0 0-21.333333-21.333333z"
                  fill="#8a8a8a"
                  p-id="15078"
                ></path>
              </svg>
            </div>
            <div className="botmsg-icon">
              <svg
                t="1705898016033"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4479"
                width="16"
                height="16"
              >
                <path
                  d="M512 192a320 320 0 1 0 316.544 272.725333c-2.858667-19.370667 11.306667-38.058667 30.890667-38.058666 15.786667 0 29.696 10.922667 32.085333 26.581333A384 384 0 1 1 768 225.792V181.333333a32 32 0 0 1 64 0v128a32 32 0 0 1-32 32h-128a32 32 0 0 1 0-64h57.6a318.890667 318.890667 0 0 0-217.6-85.333333z"
                  fill="#8a8a8a"
                  p-id="4480"
                ></path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
