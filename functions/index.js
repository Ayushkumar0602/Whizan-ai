const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const axios = require('axios');
admin.initializeApp();

// CORS configuration
const cors = require('cors')({
  origin: [
    'https://8whf1skq-3000.inc1.devtunnels.ms',
    'http://localhost:3000' ,// For local development
    'https://study2-7bdc7.web.app',
    'https://whizan.xyz'
  ]
});

// Shared response handler
const handleResponse = (res, status, data) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.status(status).json(data);
};

// Firebase config endpoint (as you provided)
exports.getConfig = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    handleResponse(res, 200, {
      firebase: {
        apiKey: "AIzaSyCVYdfql5aqHrChlA1v3nxRLkIbYyWMvUg",
        authDomain: "study2-7bdc7.firebaseapp.com",
        databaseURL: "https://study2-7bdc7-default-rtdb.firebaseio.com",
        projectId: "study2-7bdc7",
        storageBucket: "study2-7bdc7.firebasestorage.app",
        messagingSenderId: "320617984870",
        appId: "1:320617984870:web:04b61ea4ee88ae057e4ea7",
        measurementId: "G-VRM14GRNWG"
      }
    });
  });
});

// Add your page-specific endpoints below this line

//course.html
// Add these endpoints to your existing index.js

// Get courses endpoint
exports.getCourses = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Get enrolled courses
        const enrolledSnapshot = await admin.firestore()
          .collection('enrolledCourses')
          .where('userId', '==', userId)
          .get();
        
        const enrolledCourses = enrolledSnapshot.docs.map(doc => doc.data().courseId);
  
        // Define course catalog (could also move this to Firestore)
        const courses = [
          {
            id: "dsa-bootcamp",
            title: "DSA Bootcamp",
            description: "Comprehensive Data Structures and Algorithms course covering all fundamentals with implementation.",
            difficulty: "intermediate",
            playlistId: "PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt&si=iuffAVR6LWkUpcCT",
            duration: "8 weeks",
            lessons: "45 lessons"
          },
          {
            id: "Machine Learning Bootcamp",
            title: "Machine Learning Bootcamp",
            description: "Comprehensive Machine Learning course covering all fundamentals with implementation.",
            difficulty: "intermediate",
            playlistId: "PLxCzCOWd7aiEXg5BV10k9THtjnS48yI-T&si=-xiUVia57qQ4VyaL",
            duration: "8 weeks",
            lessons: "32 lessons"
          },
          {
            id: "DSA using java",
            title: "java dsa",
            description: "Comprehensive Data Structures and Algorithms course covering all fundamentals with implementation.",
            difficulty: "intermediate",
            playlistId: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ&si=PYekS2IehcVHX1Th",
            duration: "8 weeks",
            lessons: "32 lessons"
          }
        ];
  
        // Add enrollment status to each course
        const coursesWithEnrollment = courses.map(course => ({
          ...course,
          isEnrolled: enrolledCourses.includes(course.id)
        }));
  
        handleResponse(res, 200, {
          courses: coursesWithEnrollment,
          hasEnrolledCourses: enrolledCourses.length > 0
        });
      } catch (error) {
        console.error('Error getting courses:', error);
        handleResponse(res, 500, { error: 'Failed to load courses' });
      }
    });
  });
  
  // Enroll in course endpoint
  exports.enrollInCourse = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { courseId, playlistId } = req.body;
        if (!courseId || !playlistId) {
          return handleResponse(res, 400, { error: 'Missing required fields' });
        }
  
        // Check if already enrolled
        const existingEnrollment = await admin.firestore()
          .collection('enrolledCourses')
          .where('userId', '==', userId)
          .where('courseId', '==', courseId)
          .get();
  
        if (!existingEnrollment.empty) {
          return handleResponse(res, 400, { error: 'Already enrolled in this course' });
        }
  
        // Create enrollment
        await admin.firestore().collection('enrolledCourses').add({
          userId,
          courseId,
          playlistId,
          enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
          progress: 0,
          lastAccessed: admin.firestore.FieldValue.serverTimestamp()
        });
  
        handleResponse(res, 200, { success: true });
      } catch (error) {
        console.error('Error enrolling in course:', error);
        handleResponse(res, 500, { error: 'Failed to enroll in course' });
      }
    });
  });
  
  // Request course endpoint
  exports.requestCourse = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { title, playlist, email } = req.body;
        if (!title || !playlist || !email) {
          return handleResponse(res, 400, { error: 'Missing required fields' });
        }
  
        // Extract playlist ID if URL is provided
        let playlistId = playlist;
        const urlRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = playlist.match(urlRegex);
        if (match && match[1]) {
          playlistId = match[1];
        }
  
        // Save request
        await admin.firestore().collection('courseRequests').add({
          userId,
          userEmail: email,
          courseTitle: title,
          playlistId,
          originalPlaylistInput: playlist,
          requestedAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'pending'
        });
  
        handleResponse(res, 200, { success: true });
      } catch (error) {
        console.error('Error submitting course request:', error);
        handleResponse(res, 500, { error: 'Failed to submit request' });
      }
    });
  });


  

  //chat.html
  // Chat Endpoints








// Get enrolled courses
exports.getEnrolledCourses = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Get enrolled courses
        const snapshot = await admin.firestore()
          .collection('enrolledCourses')
          .where('userId', '==', userId)
          .get();
  
        const enrolledCourses = snapshot.docs.map(doc => doc.data().courseId);
  
        // Sample courses - in production, fetch from Firestore
        const allCourses = [
          { id: "dsa-bootcamp", name: "DSA Bootcamp", icon: "code" },
          { id: "Machine Learning Bootcamp", name: "Machine Learning", icon: "model_training" },
          { id: "DSA using java", name: "java dsa", icon: "model_training" }
          
        ];
  
        // Filter to only enrolled courses
        const userCourses = allCourses.filter(course => enrolledCourses.includes(course.id));
  
        handleResponse(res, 200, { courses: userCourses });
      } catch (error) {
        console.error("Error getting enrolled courses:", error);
        handleResponse(res, 500, { error: 'Failed to load courses' });
      }
    });
  });
  
  // Get chat messages
  exports.getChatMessages = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        const courseId = req.query.courseId;
        if (!courseId) {
          return handleResponse(res, 400, { error: 'Course ID is required' });
        }
  
        // Check if user is enrolled in the course
        const enrollment = await admin.firestore()
          .collection('enrolledCourses')
          .where('userId', '==', userId)
          .where('courseId', '==', courseId)
          .get();
  
        if (enrollment.empty) {
          return handleResponse(res, 403, { error: 'Not enrolled in this course' });
        }
  
        // Get messages from Realtime Database
        const snapshot = await admin.database().ref(`course_chats/${courseId}/messages`).once('value');
        const messages = snapshot.val();
  
        // Format messages
        const messageArray = messages ? Object.entries(messages).map(([key, value]) => ({
          id: key,
          ...value
        })).sort((a, b) => a.timestamp - b.timestamp) : [];
  
        handleResponse(res, 200, { messages: messageArray });
      } catch (error) {
        console.error("Error getting chat messages:", error);
        handleResponse(res, 500, { error: 'Failed to load messages' });
      }
    });
  });
  
  // Send message
  exports.sendMessage = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { courseId, text } = req.body;
        if (!courseId || !text) {
          return handleResponse(res, 400, { error: 'Course ID and text are required' });
        }
  
        // Check if user is enrolled in the course
        const enrollment = await admin.firestore()
          .collection('enrolledCourses')
          .where('userId', '==', userId)
          .where('courseId', '==', courseId)
          .get();
  
        if (enrollment.empty) {
          return handleResponse(res, 403, { error: 'Not enrolled in this course' });
        }
  
        // Create message object
        const newMessage = {
          text: text,
          senderId: userId,
          timestamp: Date.now()
        };
  
        // Detect URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = text.match(urlRegex);
        if (urls && urls.length > 0) {
          newMessage.urls = urls.slice(0, 3); // Limit to 3 URLs
        }
  
        // Push to Realtime Database
        const newMessageRef = admin.database().ref(`course_chats/${courseId}/messages`).push();
        await newMessageRef.set(newMessage);
  
        // Update last read
        await admin.database().ref(`course_chats/${courseId}/last_read/${userId}`).set(Date.now());
  
        handleResponse(res, 200, { 
          success: true,
          messageId: newMessageRef.key
        });
      } catch (error) {
        console.error("Error sending message:", error);
        handleResponse(res, 500, { error: 'Failed to send message' });
      }
    });
  });
  
  // Delete message
  exports.deleteMessage = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { courseId, messageId } = req.body;
        if (!courseId || !messageId) {
          return handleResponse(res, 400, { error: 'Course ID and message ID are required' });
        }
  
        // Get the message to verify ownership
        const messageSnapshot = await admin.database().ref(`course_chats/${courseId}/messages/${messageId}`).once('value');
        const message = messageSnapshot.val();
  
        if (!message) {
          return handleResponse(res, 404, { error: 'Message not found' });
        }
  
        // Only allow deletion by sender or admin
        if (message.senderId !== userId && userId !== 'instructor-uid') {
          return handleResponse(res, 403, { error: 'Not authorized to delete this message' });
        }
  
        // Delete the message
        await admin.database().ref(`course_chats/${courseId}/messages/${messageId}`).remove();
  
        handleResponse(res, 200, { success: true });
      } catch (error) {
        console.error("Error deleting message:", error);
        handleResponse(res, 500, { error: 'Failed to delete message' });
      }
    });
  });
  
  // Typing indicator
  exports.updateTypingStatus = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { courseId, isTyping } = req.body;
        if (!courseId || typeof isTyping !== 'boolean') {
          return handleResponse(res, 400, { error: 'Invalid request data' });
        }
  
        // Update typing status
        await admin.database().ref(`course_chats/${courseId}/typing/${userId}`).set(isTyping);
  
        handleResponse(res, 200, { success: true });
      } catch (error) {
        console.error("Error updating typing status:", error);
        handleResponse(res, 500, { error: 'Failed to update typing status' });
      }
    });
  });
  
  // Presence management
  exports.updatePresence = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { courseId, isOnline } = req.body;
        if (!courseId || typeof isOnline !== 'boolean') {
          return handleResponse(res, 400, { error: 'Invalid request data' });
        }
  
        // Update presence
        const userStatusRef = admin.database().ref(`course_chats/${courseId}/online/${userId}`);
        
        if (isOnline) {
          await userStatusRef.set(true);
          // Set up onDisconnect
          userStatusRef.onDisconnect().remove();
        } else {
          await userStatusRef.remove();
        }
  
        handleResponse(res, 200, { success: true });
      } catch (error) {
        console.error("Error updating presence:", error);
        handleResponse(res, 500, { error: 'Failed to update presence' });
      }
    });
  });

  //college.html

  exports.logoutUser = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        // Here you could add server-side session cleanup if needed
        handleResponse(res, 200, { success: true });
      } catch (error) {
        console.error('Logout error:', error);
        handleResponse(res, 500, { error: 'Logout failed' });
      }
    });
  });





  //Assignment.html

  // Process PDF with Gemini
exports.processPdf = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        await admin.auth().verifyIdToken(idToken);
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { pdfBase64 } = req.body;
        if (!pdfBase64) {
          return handleResponse(res, 400, { error: 'PDF content is required' });
        }
  
        // Call Gemini API
        const GEMINI_API_KEY = "AIzaSyAM1p730RTRu40S1sHghd1KD4501K6iCsI";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
        const response = await axios.post(url, {
          contents: [{
            parts: [
              {
                text: "Extract the assignment questions from the uploaded PDF. Provide detailed step-by-step solutions for each question. Show all work and calculations clearly. Include all mathematical and scientific symbols exactly as they appear. Format mathematical symbols properly, including vectors, integrals, and superscripts. Be thorough in your explanations so that someone learning the material can understand your reasoning completely.answer all question of assignment in one go whatever question is asked."
              },
              {
                inline_data: {
                  mime_type: "application/pdf",
                  data: pdfBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8192
          }
        });
  
        // Extract text from response
        let text = "";
        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          text = response.data.candidates[0].content.parts[0].text;
        }
  
        handleResponse(res, 200, { text });
      } catch (error) {
        console.error("Error processing PDF:", error);
        handleResponse(res, 500, { error: 'Failed to process PDF' });
      }
    });
  });
  
  // Generate handwritten document
  exports.generateHandwritten = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        await admin.auth().verifyIdToken(idToken);
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { text, font, color, size, paperStyle } = req.body;
        if (!text || !font || !color || !size || !paperStyle) {
          return handleResponse(res, 400, { error: 'Missing required parameters' });
        }
  
        // Generate HTML with the handwritten style
        const paperBackground = generatePaperBackground(paperStyle);
        const processedText = processTextForDisplay(text);
        const htmlContent = generateHtmlDocument(processedText, font, color, size, paperBackground);
  
        handleResponse(res, 200, { htmlContent });
      } catch (error) {
        console.error("Error generating handwritten document:", error);
        handleResponse(res, 500, { error: 'Failed to generate document' });
      }
    });
  });
  
  // Enhance document with realistic effects
  exports.enhanceDocument = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      try {
        // Verify authentication
        const idToken = req.headers.authorization?.split('Bearer ')[1];
        if (!idToken) {
          return handleResponse(res, 401, { error: 'Unauthorized' });
        }
  
        await admin.auth().verifyIdToken(idToken);
  
        // Validate request
        if (req.method !== 'POST') {
          return handleResponse(res, 405, { error: 'Method not allowed' });
        }
  
        const { 
          content, 
          font, 
          color, 
          size, 
          paperStyle, 
          inkBleed, 
          paperTexture, 
          handwritingVariance 
        } = req.body;
  
        if (!content || !font || !color || !size || !paperStyle) {
          return handleResponse(res, 400, { error: 'Missing required parameters' });
        }
  
        // Generate realistic effects
        const paperTextureCSS = generateRealisticPaperTexture(paperStyle, paperTexture);
        const inkBleedCSS = generateInkBleedEffect(color, inkBleed);
        const handwritingVarianceCSS = generateHandwritingVariance(handwritingVariance);
  
        // Generate enhanced HTML
        const enhancedHtml = generateEnhancedHtml(
          content, 
          font, 
          color, 
          size, 
          paperTextureCSS, 
          inkBleedCSS, 
          handwritingVarianceCSS
        );
  
        handleResponse(res, 200, { htmlContent: enhancedHtml });
      } catch (error) {
        console.error("Error enhancing document:", error);
        handleResponse(res, 500, { error: 'Failed to enhance document' });
      }
    });
  });
  
  // Helper functions
  function generatePaperBackground(style) {
    switch (style) {
      case 'lined':
        return `
          background-color: white;
          background-image: linear-gradient(#dee 1px, transparent 1px);
          background-size: 100% 28px;
        `;
      case 'graph':
        return `
          background-color: white;
          background-image: 
            linear-gradient(#dee 1px, transparent 1px),
            linear-gradient(90deg, #dee 1px, transparent 1px);
          background-size: 20px 20px;
        `;
      default:
        return 'background-color: white;';
    }
  }
  
  function generateRealisticPaperTexture(paperStyle, textureIntensity) {
    const intensity = textureIntensity / 100;
    let texture = '';
  
    const baseColor = `rgb(${240 - (10 * intensity)}, ${240 - (15 * intensity)}, ${240 - (5 * intensity)})`;
  
    switch (paperStyle) {
      case 'lined':
        texture = `
          background-color: ${baseColor};
          background-image: 
            linear-gradient(rgba(0, 0, 0, ${0.05 * intensity}) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 0, 0, ${0.03 * intensity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, ${0.02 * intensity}), transparent 50%);
          background-size: 100% 28px, 30px 100%, 100% 100%;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, ${0.05 * intensity});
        `;
        break;
      case 'graph':
        texture = `
          background-color: ${baseColor};
          background-image: 
            linear-gradient(rgba(0, 0, 0, ${0.05 * intensity}) 1px, transparent 1px),
            linear-gradient(to right, rgba(0, 0, 0, ${0.05 * intensity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, ${0.02 * intensity}), transparent 50%);
          background-size: 20px 20px, 20px 20px, 100% 100%;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, ${0.05 * intensity});
        `;
        break;
      default:
        texture = `
          background-color: ${baseColor};
          background-image: 
            linear-gradient(to bottom, rgba(0, 0, 0, ${0.02 * intensity}), transparent 50%),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.${5 + (5 * intensity)}" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.${10 + (10 * intensity)}"/></svg>');
          box-shadow: inset 0 0 20px rgba(0, 0, 0, ${0.05 * intensity});
        `;
    }
  
    return texture;
  }
  
  function generateInkBleedEffect(inkColor, bleedIntensity) {
    const intensity = bleedIntensity / 100;
    const color = inkColor || '#000033';
    const r = parseInt(color.substr(1, 2), g = parseInt(color.substr(3, 2)), b = parseInt(color.substr(5, 2)), 16);
  
    return `
      text-shadow: 
        0 0 ${0.5 * intensity}px rgba(${r}, ${g}, ${b}, ${0.3 * intensity}),
        0 0 ${1 * intensity}px rgba(${r}, ${g}, ${b}, ${0.2 * intensity}),
        0 0 ${2 * intensity}px rgba(${r}, ${g}, ${b}, ${0.1 * intensity});
    `;
  }
  
  function generateHandwritingVariance(varianceIntensity) {
    const intensity = varianceIntensity / 100;
    return `
      letter-spacing: ${0.05 * intensity}px;
      word-spacing: ${0.2 * intensity}px;
    `;
  }
  
  function processTextForDisplay(text) {
    return text
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/([a-zA-Z\d])²/g, '$1<sup>2</sup>')
      .replace(/([a-zA-Z\d])³/g, '$1<sup>3</sup>')
      .replace(/([a-zA-Z])\*I\*/g, '$1<sub>x</sub>')
      .replace(/([a-zA-Z])\*J\*/g, '$1<sub>y</sub>')
      .replace(/([a-zA-Z])\*K\*/g, '$1<sub>z</sub>')
      .replace(/∇φ/g, '∇φ')
      .replace(/Step (\d+):/g, '<strong>Step $1:</strong>')
      .replace(/\n/g, '<br>');
  }
  
  function generateHtmlDocument(content, font, color, size, paperBackground) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Handwritten Assignment</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap');
          
          body {
            ${paperBackground}
            padding: 40px;
            line-height: 1.8;
          }
          .handwritten {
            font-family: '${font}', cursive;
            color: ${color};
            font-size: ${size};
          }
          h1, h2, h3 {
            font-family: '${font}', cursive;
            color: ${color};
            margin-top: 1em;
            margin-bottom: 0.5em;
          }
          h1 {
            font-size: calc(${size} * 1.5);
            text-align: center;
            text-decoration: underline;
          }
          h2 {
            font-size: calc(${size} * 1.3);
          }
          h3 {
            font-size: calc(${size} * 1.1);
          }
          strong {
            text-decoration: underline;
          }
          .answer {
            margin-left: 20px;
            border-left: 2px solid ${color};
            padding-left: 10px;
          }
          sup, sub {
            font-size: 70%;
          }
        </style>
      </head>
      <body>
        <h1>Detailed Solution</h1>
        <div class="handwritten">
          ${content}
        </div>
      </body>
      </html>
    `;
  }
  
  function generateEnhancedHtml(content, font, color, size, paperTexture, inkBleed, handwritingVariance) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Enhanced Handwritten Assignment</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap');
          
          body {
            ${paperTexture}
            padding: 40px;
            line-height: 1.8;
            position: relative;
          }
          body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              to bottom,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.8) 50%,
              rgba(255,255,255,0) 100%
            );
            pointer-events: none;
          }
          .handwritten {
            font-family: '${font}', cursive;
            color: ${color};
            font-size: ${size};
            ${inkBleed}
            ${handwritingVariance}
          }
          h1, h2, h3 {
            font-family: '${font}', cursive;
            color: ${color};
            margin-top: 1em;
            margin-bottom: 0.5em;
            ${inkBleed}
            ${handwritingVariance}
          }
          h1 {
            font-size: calc(${size} * 1.5);
            text-align: center;
            text-decoration: underline;
          }
          h2 {
            font-size: calc(${size} * 1.3);
          }
          h3 {
            font-size: calc(${size} * 1.1);
          }
          strong {
            text-decoration: underline;
          }
          .answer {
            margin-left: 20px;
            border-left: 2px solid ${color};
            padding-left: 10px;
          }
          sup, sub {
            font-size: 70%;
          }
        </style>
      </head>
      <body>
        <div class="handwritten">
          ${content}
        </div>
      </body>
      </html>
    `;
  }






  //pi.html

  // API Keys Endpoint
exports.getApiKeys = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Return ONLY the API keys
    handleResponse(res, 200, {
      GEMINI_API_KEY: "AIzaSyAM1p730RTRu40S1sHghd1KD4501K6iCsI",
      ELEVENLABS_API_KEY: "sk_2fc9127e6f6e89ee237b7aeb82ad9759abe91b63d679a12d"
    });
  });
});

// Gemini API endpoint for mock interview


// notifications endpoint




