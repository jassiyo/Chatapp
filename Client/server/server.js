const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3080;
// Create an instance of Express
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
    {
      "variable": "petitionType",
      "type": "b",
      "content": "What is the specific type of criminal miscellaneous petition being filed?"
    },
    {
      "variable": "petitionSection",
      "type": "b",
      "content": "Under which section(s) of the Criminal Procedure Code is the petition being filed?"
    },
    {
      "variable": "petitionerName",
      "type": "b",
      "content": "What is the full name of the petitioner?"
    },
    {
      "variable": "petitionerType",
      "type": "b",
      "content": "What is the type of petitioner (e.g., accused, complainant, prosecution)?"
    },
    {
      "variable": "petitionerAddress",
      "type": "b",
      "content": "What is the full address of the petitioner?"
    },
    {
      "variable": "respondentName",
      "type": "b",
      "content": "What is the full name of the respondent?"
    },
    {
      "variable": "respondentType",
      "type": "b",
      "content": "What is the type of respondent (e.g., accused, complainant, prosecution)?"
    },
    {
      "variable": "respondentAddress",
      "type": "b",
      "content": "What is the full address of the respondent?"
    },
    {
      "variable": "mainCaseNumber",
      "type": "b",
      "content": "What is the main case number associated with this petition?"
    },
    {
      "variable": "mainCaseStatus",
      "type": "b",
      "content": "What is the current status of the main case?"
    },
    {
      "variable": "courtName",
      "type": "b",
      "content": "In which court is the petition being filed?"
    },
    {
      "variable": "courtJurisdiction",
      "type": "b",
      "content": "What is the jurisdiction of the court where the petition is filed?"
    },
    {
      "variable": "filingDate",
      "type": "c",
      "content": "What is the date of filing of the petition?"
    },
    {
      "variable": "filingTime",
      "type": "b",
      "content": "At what time was the petition filed?"
    },
    {
      "variable": "reliefSought",
      "type": "b",
      "content": "What is the specific relief sought in the petition?"
    },
    {
      "variable": "groundsForPetition",
      "type": "b",
      "content": "What are the detailed grounds on which the petition is filed?"
    },
    {
      "variable": "documentsAttached",
      "type": "b",
      "content": "What documents are attached to support the petition?"
    },
    {
      "variable": "courtFeeAmount",
      "type": "currency",
      "content": "What is the amount of court fee paid for filing the petition?"
    },
    {
      "variable": "courtFeeReceiptNumber",
      "type": "b",
      "content": "What is the receipt number for the court fee paid?"
    },
    {
      "variable": "advocateName",
      "type": "b",
      "content": "What is the name of the advocate filing the petition?"
    },
    {
      "variable": "advocateBarCouncilNumber",
      "type": "b",
      "content": "What is the Bar Council registration number of the advocate?"
    },
    {
      "variable": "vakalatnamaDate",
      "type": "c",
      "content": "What is the date of the vakalatnama filed by the advocate?"
    },
    {
      "variable": "registrationDate",
      "type": "c",
      "content": "On what date was the petition registered by the court?"
    },
    {
      "variable": "scrutinyDate",
      "type": "c",
      "content": "On what date was the petition scrutinized by the court staff?"
    },
    {
      "variable": "defectsNotified",
      "type": "a",
      "content": "Were any defects notified in the petition?",
      "options": ["Yes", "No"]
    },
    {
      "variable": "defectsRectificationDate",
      "type": "c",
      "content": "On what date were the notified defects rectified?"
    },
    {
      "variable": "noticeIssueDate",
      "type": "c",
      "content": "On what date was the notice issued to the respondent?"
    },
    {
      "variable": "noticeServeDate",
      "type": "c",
      "content": "On what date was the notice served to the respondent?"
    },
    {
      "variable": "firstHearingDate",
      "type": "c",
      "content": "What is the date set for the first hearing of the petition?"
    },
    {
      "variable": "adjournmentDates",
      "type": "b",
      "content": "What are the dates of any adjournments in the petition hearing?"
    },
    {
      "variable": "adjournmentReasons",
      "type": "b",
      "content": "What are the reasons for the adjournments, if any?"
    },
    {
      "variable": "interimOrderDate",
      "type": "c",
      "content": "What is the date of any interim order passed on the petition?"
    },
    {
      "variable": "interimOrderSummary",
      "type": "b",
      "content": "What is the summary of the interim order, if any?"
    },
    {
      "variable": "finalOrderDate",
      "type": "c",
      "content": "What is the date of the final order passed on the petition?"
    },
    {
      "variable": "finalOrderSummary",
      "type": "b",
      "content": "What is the summary of the final order passed on the petition?"
    },
    {
      "variable": "appealFiled",
      "type": "a",
      "content": "Has an appeal been filed against the order on this petition?",
      "options": ["Yes", "No"]
    },
    {
      "variable": "appealDate",
      "type": "c",
      "content": "If an appeal was filed, on what date was it filed?"
    },
    {
      "variable": "appealOutcome",
      "type": "b",
      "content": "What was the outcome of the appeal, if any?"
    },
    {
      "variable": "petitionStatus",
      "type": "b",
      "content": "What is the current status of the petition (e.g., pending, disposed, withdrawn)?"
    },
    {
      "variable": "disposalDate",
      "type": "c",
      "content": "On what date was the petition finally disposed of?"
    },
    {
      "variable": "disposalReason",
      "type": "b",
      "content": "What was the reason for the disposal of the petition?"
    },
    {
      "variable": "specialInstructions",
      "type": "b",
      "content": "Are there any special instructions or notes regarding this petition?"
    }
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
