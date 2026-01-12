# Whizan.AI

**Empowering Education with Technology**

Whizan.AI is a comprehensive AI-powered educational platform designed to help students study smarter, not harder. It provides an all-in-one solution for assignments, mock tests, resume building, and various learning tools.

## 🚀 Features

### 📚 Core Learning Features

#### **Authentication & User Management**
- **Authentication** (`auth.html`) - Secure user login and registration
- **After Login** (`afterlogin.html`) - Post-authentication dashboard with AI chatbot integration
- **Profile** (`profile.html`) - User profile management
- **Achievements** (`achievements.html`) - Track and display user achievements
- **User Persona** (`user_persona.html`) - Personalized user experience

#### **Dashboard & Navigation**
- **Dashboard** (`dashboard.html`) - Main learning dashboard with lecture videos and progress tracking
- **Main Index** (`index.html`, `index1.html`) - Landing pages and welcome screens

#### **Course Management**
- **Courses** (`course.html`) - Browse and enroll in courses
- **Course User** (`courseuser.html`) - User-specific course interface
- **Study Material** (`studymaterial.html`, `material.html`) - Access study materials and resources

#### **Assessment & Testing**
- **Mock Test** (`test.html`) - Practice tests and assessments
- **Quiz** (`quiz.html`) - Interactive quiz system
- **Viva** (`viva.html`) - Oral examination practice
- **Mock Interview** (`interview.html`) - Interview preparation and practice
- **DSA** (`dsa.html`) - Data Structures and Algorithms practice

#### **Assignment & Academic Tools**
- **Assignment** (`assignment.html`) - Assignment creation and management
- **Cheat Sheet** (`cheat.html`) - Quick reference sheets generator
- **College** (`college.html`) - College-specific resources and information

#### **Career & Professional Development**
- **Resume Builder** (`resume.html`) - ATS-friendly resume creation tool
- **Public Resume** (`public-resume.html`) - Shareable resume interface
- **Jobs** (`jobs.html`) - Job listings and opportunities
- **Hackathon** (`hackathon.html`) - Hackathon information and resources

#### **AI-Powered Features**
- **AI Chat** (`chat.html`) - Intelligent chatbot assistant powered by Gemini AI
- **Text Humanizer** (`humaniser.html`) - Transform AI-generated text into natural, human-like writing
- **Roast** (`roast.html`) - AI-powered feedback and critique tool

#### **Content & Community**
- **Blogs** (`blogs.html`) - Educational blog posts and articles
- **Music** (`music.html`) - Background music for focused studying
- **Health** (`health.html`) - Health and wellness resources for students

#### **Specialized Tools**
- **PI** (`pi.html`) - Personal Information and profile management tool

### 📱 Android-Specific Features

The platform includes a dedicated Android version (`android/` directory) with mobile-optimized interfaces for all core features, plus additional mobile-specific tools:

#### **Mobile Games**
- **2048 Game** (`android/games/2028.html`) - Classic 2048 puzzle game
- **Sudoku** (`android/games/sudoku.html`) - Sudoku puzzle game

#### **Developer Tools** (`android/tools/`)
- **API Response** (`apiresponce.html`) - Test and visualize API responses
- **Base64 Encoder/Decoder** (`base64.html`) - Base64 encoding and decoding tool
- **Code Image Generator** (`codeimage.html`) - Convert code snippets to images
- **Developer Tools** (`developer.html`) - Comprehensive developer utilities
- **Code Editor** (`editor.html`) - Online code editor with syntax highlighting
- **Format Converter** (`formatconverter.html`) - Convert between various file formats
- **GitHub Integration** (`github.html`) - GitHub repository management
- **Hash Generator** (`hash.html`) - Generate various hash values (MD5, SHA, etc.)
- **HTML Preview** (`htmlpreview.html`) - Live HTML preview tool
- **Image to PDF** (`imagetopdf.html`) - Convert images to PDF documents
- **MP3 Tools** (`mp3.html`) - Audio file manipulation tools
- **PDF Compressor** (`pdfcompressor.html`) - Compress PDF files
- **Terminal** (`terminal.html`) - Web-based terminal emulator
- **Tools Choice** (`toolschoise.html`) - Tool selection interface

### 🔧 Technical Features

#### **Progressive Web App (PWA)**
- **Service Worker** (`service-worker.js`) - Offline functionality and caching
- **Manifest** (`manifest.json`) - PWA configuration
- **Firebase Integration** - Real-time database and messaging
  - `firebase-messaging-sw.js` - Push notifications
  - `firebase.json` - Firebase configuration
  - `firestore.rules` - Database security rules
  - `firestore.indexes.json` - Database indexes

#### **Backend & Functions**
- **Cloud Functions** (`functions/`) - Serverless backend functions
  - `index.js` - Main function definitions
  - Firebase Cloud Functions integration

#### **Additional Utilities**
- **Fluid Cursor** (`fluid-cursor.js`) - Custom cursor effects
- **Python Backend** (`app.py`) - Flask/Python backend server
- **Sitemap** (`sitemap.xml`) - SEO sitemap
- **Robots.txt** (`robots.txt`) - Search engine crawler instructions

### 👨‍💼 Administrative Features
- **Admin Panel** (`admin.html`, `admin1.html`) - Administrative dashboard and controls

### 📄 Preview Pages
Preview pages (`preview/`) for various features:
- Assignment Preview
- Cheat Sheet Preview
- Course Preview
- Emotional Support Preview
- Library Preview
- Mock Interview Preview
- Mock Test Preview
- Resume Builder Preview

### 📋 Legal & Support Pages
- **Contact** (`preview/subject/contact.html`)
- **Privacy Policy** (`preview/subject/privacy.html`)
- **Terms of Service** (`preview/subject/terms.html`)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: Node.js, Firebase Cloud Functions, Python (Flask)
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini AI (Gemini Pro, Gemini Flash)
- **PWA**: Service Workers, Web App Manifest
- **Video**: Plyr.js for video playback
- **Code Editor**: Monaco Editor
- **Charts**: Chart.js

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Ayushkumar0602/Whizan-ai.git
cd Whizan-ai
```

2. Install dependencies:
```bash
npm install
cd functions
npm install
```

3. Configure Firebase:
   - Set up Firebase project
   - Update `firebase.json` with your project configuration
   - Configure `firestore.rules` and `firestore.indexes.json`

4. Set up environment variables:
   - Add your Firebase configuration
   - Add API keys (Gemini AI, etc.)

5. Deploy:
```bash
firebase deploy
```

## 🚀 Usage

1. Open `index.html` in a web browser or deploy to a web server
2. Register/Login through the authentication system
3. Explore various features from the dashboard
4. Use AI-powered tools for assignments, resume building, and learning

## 📱 Mobile Support

The platform includes a dedicated Android version with mobile-optimized interfaces. Access mobile features through the `android/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Ayush Kumar**
- GitHub: [@Ayushkumar0602](https://github.com/Ayushkumar0602)

## 🙏 Acknowledgments

- Google Gemini AI for AI capabilities
- Firebase for backend infrastructure
- All open-source libraries and frameworks used

---

**Note**: This is an educational platform designed to help students excel in their academic journey. Use responsibly and ethically.
