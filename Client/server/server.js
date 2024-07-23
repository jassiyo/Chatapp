const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3080;
const app = express();
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:80"], // Whitelist the domains you want to allow
};
// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors(corsOptions));

// Sample data (can be replaced with a database)

let sessions = [
  { _id: 1, title: "Session 1", speaker: "John Doe" },
  { _id: 2, title: "Session 2", speaker: "Jane Smith" },
];

let messages = {
  1: [
    { role: "assistant", content: "How can I help You", type:"a" },
    { role: "assistant", content: "How can I help You", type:'b' },
    { role: "assistant", content: "How can I help You", type:'a' },
    { role: "assistant", content: "How can I help You", type:'b' },
    { role: "assistant", content: "How can I help You", type:'a' },
    { role: "assistant", content: "How can I help You", type:'b' },
    { role: "assistant", content: "How can I help You", type:'a' },
    // { role: "user", content: "I need help with Civil cases" }
  ],
  2: [
    { role: "assistant", content: "How can I help You" },
    { role: "user", content: "I need help with Criminal cases" },
    { role: "assistant", content: "I would like to know some details" },
  ],
  3: [
    { role: "assistant", content: "How can I help You" },
    { role: "user", content: "I need help with Criminal cases" },
    { role: "assistant", content: "I would like to know some details" },
  ],
  4: [
    { role: "assistant", content: "How can I help You" },
    { role: "user", content: "I need help with Criminal cases" },
    { role: "assistant", content: "I would like to know some details" },
  ],
  5: [
    { role: "assistant", content: "How can I help You" },
    { role: "user", content: "I need help with Criminal cases" },
    { role: "assistant", content: "I would like to know some details" },
  ],
};
let sessionIdNew = 3;
// Endpoint to get all sessions
app.get("/sessions", (req, res) => {
  res.json(sessions);
});
// Endpoint to get a specific session by session_id
app.get("/sessions/:session_id", (req, res) => {
  const sessionId = parseInt(req.params.session_id);
  const session = messages[sessionId];
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({ messages: session });
});
app.post("/new-session", (req, res) => {
  sessions.push({ _id: sessionIdNew, title: "Session " + sessionIdNew });
  messages[sessionIdNew] = [];
  const oldSessionId = sessionIdNew;
  sessionIdNew++;
  res.status(200).json({ id: oldSessionId });
});
app.post("/message", (req, res) => {
  console.log("-----------------------------message", req.body);
  let { sessionId, message } = req.body;
  if (sessionId === undefined) {
    sessionId = sessionIdNew;
    sessions.push({ _id: sessionId, title: "Session " + sessionId });
    messages[sessionId] = [];
    sessionIdNew++;
  }
  messages[sessionId].push({ role: "user", content: message });

  if (message === "link please") {
    messages[sessionId].push({
      role: "assistant",
      content: "I will work on it",
      isLink: true,
    });
    res
      .status(200)
      .json({
        message: {
          role: "assistant",
          content: "I will work on it",
          isLink: true,
        },
      });
  } else {
    messages[sessionId].push({
      role: "assistant",
      content: "I will work on it",
    });
    res
      .status(200)
      .json({ message: { role: "assistant", content: "I will work on it" } });
  }
});

// Searching seassion api
app.get('/sessions', (req, res) => {
  const searchQuery = req.query.q;
  if (searchQuery) {
    const filteredSessions = sessions.filter(session => 
      session.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    res.json(filteredSessions);
  } else {
    res.json(sessions);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});