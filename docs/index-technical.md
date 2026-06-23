# Index — Technical Documentation

## Overview
`functions/index.js` serves as the centralized backend entry point for the Firebase Cloud Functions ecosystem. It acts as a multi-purpose API gateway, facilitating authentication, course management, real-time chat interactions, AI-driven document generation, and secure credential handling. It bridges the client-side frontend with Google Cloud services (Firestore, Realtime Database, Authentication) and third-party APIs (GitHub, Google Gemini).

## Architecture
This file is the root controller for the project's backend. 
- **Dependencies**: `firebase-functions`, `firebase-admin`, `axios`, and `@google/generative-ai`.
- **Role**: It acts as a middleware layer that abstracts sensitive operations (e.g., interacting with Gemini or GitHub APIs) from the client-side, ensuring that secret keys remain server-side and that business logic remains consistent.
- **Upstream Dependencies**: The module relies on Firebase Authentication (ID Tokens) for request verification.
- **Downstream Consumers**: The web frontend (hosted on Firebase Hosting) consumes these endpoints for course data, chat history, and document transformation.

## Design Principles
- **Separation of Concerns**: Uses a centralized `handleResponse` helper to standardize API responses and CORS headers.
- **Defense in Depth**: Every protected endpoint enforces `admin.auth().verifyIdToken(idToken)` to validate user sessions.
- **Proxy Pattern**: Implements proxy endpoints (e.g., `githubProxy`, `processPdf`) to hide API keys from the client environment.
- **Declarative Resource Management**: Uses Firestore for structured data (course metadata) and Realtime Database for high-frequency low-latency updates (chat).

## API Reference

### Authentication & Config
*   **`getConfig()`**: Returns Firebase SDK configuration object.
*   **`githubAuth(req)`**: Exchanges an OAuth `code` for a GitHub access token.
*   **`logoutUser(req)`**: Placeholder for server-side session termination logic.

### Course Management
*   **`getCourses()`**: Returns a list of available courses and the user's enrollment status.
*   **`enrollInCourse(req)`**: Adds an entry to `enrolledCourses` in Firestore.
*   **`requestCourse(req)`**: Accepts course requests, parses YouTube playlist IDs via regex, and stores them in `courseRequests`.

### Real-Time Communication
*   **`getChatMessages(req)`**: Fetches sorted messages for a specific `courseId` from the Realtime Database.
*   **`sendMessage(req)`**: Publishes a new message to the chat; includes basic URL link detection.
*   **`deleteMessage(req)`**: Deletes a message if the requester is the sender or an admin.
*   **`updateTypingStatus(req)`** / **`updatePresence(req)`**: Handles real-time UI state flags in the Realtime Database.

### AI & Document Services
*   **`processPdf(req)`**: Sends base64-encoded PDFs to Google Gemini for solution extraction.
*   **`generateHandwritten(req)`** / **`enhanceDocument(req)`**: Performs server-side HTML/CSS rendering to simulate handwritten assignments using dynamic styling.

## Internal Logic
1.  **CORS Middleware**: All requests are wrapped in a `cors` handler, restricting access to pre-configured domains.
2.  **Auth Guard**: Every request extracts the `Authorization` header, verifies the token via `admin.auth()`, and aborts with `401 Unauthorized` if invalid.
3.  **PDF-to-Text Pipeline**: The `processPdf` function wraps Gemini's REST API, offloading the heavy lifting of OCR/LLM analysis and returning a parsed string.
4.  **Styling Engine**: Document generation utilizes a set of helper functions (`generatePaperBackground`, `generateInkBleedEffect`) to inject CSS templates, allowing the frontend to receive fully formed, stylable HTML.

## Data Flow
- **Input**: User-provided JSON payloads (e.g., `courseId`, `pdfBase64`, `message`) via HTTP POST.
- **Verification**: ID token validation against Firebase Auth.
- **Processing**: Interaction with external services (Gemini/GitHub) or internal databases (Firestore/RTDB).
- **Output**: JSON object with a status code, or an error object if an exception is caught.

## Error Handling & Edge Cases
- **Unauthorized Access**: Returns `401` for missing/invalid tokens.
- **Method Mismatch**: Returns `405` for non-POST requests to mutation endpoints.
- **API Failures**: External API calls (Gemini/GitHub) are wrapped in `try/catch` blocks; errors are logged server-side and reported as generic `500` messages to the client to prevent sensitive leakages.

## Usage Example

### Enrolling in a Course
```javascript
const response = await fetch('/enrollInCourse', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ courseId: 'dsa-bootcamp', playlistId: '...' })
});
```

### Fetching Chat Messages
```javascript
const res = await axios.get('/getChatMessages', {
  params: { courseId: 'dsa-bootcamp' },
  headers: { 'Authorization': `Bearer ${idToken}` }
});
const { messages } = res.data;
```