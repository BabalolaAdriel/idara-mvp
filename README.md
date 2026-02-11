# Idara MVP — AI-Powered Lecture Companion

**Never miss a moment. Record, transcribe, and transform your lectures.**

Idara is an AI-powered safety net for students that records lectures, transcribes them in real-time, and transforms them into structured study materials with optional video animations. Built for the Gemini Day Hackathon.

![Idara Banner](https://via.placeholder.com/1200x400/2563eb/ffffff?text=Idara+MVP)

## 🎯 Problem & Solution

**Problem:** Students miss critical lecture content due to momentary lapses in attention, fatigue, or connectivity issues.

**Solution:** AI-powered safety net that records, transcribes, and transforms lectures into structured study materials.

**Target User:** University/college students aged 18-25 attending 1-3 hour lectures daily, often in low-connectivity environments.

## ✨ Features

### 🎙️ Component 1: Offline Listen & Transcribe
- **Continuous Audio Recording** with pause/resume functionality
- **Real-time Local Transcription** using Whisper-tiny (WASM)
- **Auto-save** every 30 seconds for data safety
- **Waveform Visualization** for audio monitoring
- **Confidence Indicators** for transcription quality
- Works completely offline!

### 📝 Component 2: Online Note Generation
- **Batch Processing** of saved transcripts
- **Live Mode**: Record + generate simultaneously
- **Structured Output** with 7 comprehensive sections:
  - 📋 Executive Summary
  - 🎯 Key Concepts
  - 📐 Formulas & Equations
  - 📖 Definitions & Terminology
  - ❓ Practice Questions (Basic, Intermediate, Advanced)
  - ⚡ Quick Review Points
  - 💡 Study Tips
- Copy, export, and print functionality
- Search and filter saved lectures

### 🎬 Component 3: Veo 3 Video Animation
- **Auto-extract** top 3-5 visual concepts from notes
- **Manual Concept Selection** for customization
- **Multiple Style Options**:
  - Educational Whiteboard
  - 3D Animation
  - Infographic
- Individual or concatenated downloads
- Durations: 15s, 30s, 60s

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** Zustand (with persist middleware)
- **Routing:** React Router v6
- **Audio:** MediaRecorder API, WebM (Opus codec)
- **Offline Transcription:** Whisper.cpp (WebAssembly) - whisper-tiny.en (39MB)
- **APIs:** 
  - Gemini 1.5 Flash (note generation)
  - Veo 3 (video generation)
- **Storage:** IndexedDB via Dexie.js
- **Markdown Rendering:** React Markdown

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with microphone access
- Google AI API keys (Gemini & Veo)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/BabalolaAdriel/idara-mvp.git
cd idara-mvp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_VEO_API_KEY=your_veo_api_key_here
VITE_APP_NAME=Idara
VITE_APP_ENV=development
```

4. **Download Whisper Model (Optional)**
For real offline transcription, download the Whisper model:
- Visit: https://huggingface.co/ggerganov/whisper.cpp
- Download: `whisper-tiny.en.bin` (39MB)
- Place in: `public/models/whisper-tiny.en.bin`

Note: The app works without the model (simulated transcription for demo).

5. **Start development server**
```bash
npm run dev
```

6. **Open in browser**
Navigate to `http://localhost:3000`

## 🚀 Usage

### Recording a Lecture

1. Go to **Record** page
2. Grant microphone permissions
3. Enter lecture title (optional)
4. Click the **red microphone button** to start recording
5. Use **pause/resume** as needed
6. Click **stop** when finished
7. Your lecture is automatically saved!

### Generating Study Notes

1. Go to **Library** and select a lecture
2. Navigate to the **Study Notes** tab
3. Click **Generate Notes**
4. Wait for AI processing (20-30 seconds)
5. Review structured notes with 7 sections
6. Copy, export, or print as needed

### Creating Video Animations

1. Generate study notes first (required)
2. Navigate to **Video Animation** tab
3. Select 3-5 concepts to visualize
4. Choose animation style and duration
5. Click **Generate Videos**
6. Preview and download completed videos

## 📁 Project Structure

```
idara-mvp/
├── public/
│   ├── models/              # Whisper WASM models
│   ├── icons/               # App icons
│   └── manifest.json        # PWA manifest
├── src/
│   ├── components/          # React components
│   │   ├── Layout/          # Header, Sidebar, Footer
│   │   ├── AudioRecorder.jsx
│   │   ├── WaveformVisualizer.jsx
│   │   ├── TranscriptViewer.jsx
│   │   ├── LectureList.jsx
│   │   ├── NoteGenerator.jsx
│   │   ├── NoteSection.jsx
│   │   ├── VideoAnimator.jsx
│   │   └── ConceptSelector.jsx
│   ├── services/            # Business logic
│   │   ├── audioRecorder.js
│   │   ├── whisperService.js
│   │   ├── geminiService.js
│   │   ├── veoService.js
│   │   ├── storageService.js
│   │   └── networkMonitor.js
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── store/               # Zustand state management
│   ├── utils/               # Helper functions
│   ├── styles/              # Global styles
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env.example
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔑 API Configuration

### Getting Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or select a project
3. Generate API key
4. Add to `.env` as `VITE_GEMINI_API_KEY`

### Getting Veo API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Enable Veo 3 API access
3. Generate API key
4. Add to `.env` as `VITE_VEO_API_KEY`

## 🏗️ Build & Deploy

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Important:** Remember to add environment variables in your hosting platform's dashboard.

## 🎮 Demo Script

1. **Introduction** (1 min)
   - Show landing page
   - Explain the problem Idara solves

2. **Recording Demo** (3 min)
   - Navigate to Record page
   - Start recording
   - Show waveform visualization
   - Demonstrate pause/resume
   - Show live transcription
   - Stop and save

3. **Note Generation** (2 min)
   - Open saved lecture
   - Generate study notes
   - Show 7 structured sections
   - Demonstrate copy/export

4. **Video Animation** (2 min)
   - Show concept extraction
   - Select 3 concepts
   - Generate videos
   - Preview result

5. **Library & Search** (1 min)
   - Show lecture library
   - Demonstrate search and filters
   - Show stats

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions (Settings → Privacy → Microphone)
- Use HTTPS in production (required for microphone access)
- Try a different browser

### Transcription Not Working
- Download the Whisper model to `public/models/`
- Check browser console for errors
- For now, app uses simulated transcription

### API Errors
- Verify API keys are correct in `.env`
- Check API quotas in Google Cloud Console
- Ensure you're online for API calls

### Storage Full
- Go to Settings → Clear All Data
- Export lectures before clearing
- Maximum 10 lectures stored locally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built for the Gemini Day Hackathon by BabalolaAdriel.

## 🙏 Acknowledgments

- Google AI for Gemini 1.5 Flash and Veo 3 APIs
- Whisper.cpp for local transcription
- React and Vite communities
- All open-source contributors

## 📬 Contact

- GitHub: [@BabalolaAdriel](https://github.com/BabalolaAdriel)
- Project Link: [https://github.com/BabalolaAdriel/idara-mvp](https://github.com/BabalolaAdriel/idara-mvp)

---

**Made with ❤️ for students everywhere**