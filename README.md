# Frontend Design Integration - Qari App

This directory contains the beautiful React frontend design for the Qari mobile app, now integrated with the backend API.

## Features

- **Recording Screen**: Real audio recording using MediaRecorder API with backend analysis
- **Results Display**: Shows tajweed errors, pronunciation feedback, and improvement suggestions
- **Progress Tracking**: View session history and improvement metrics
- **Qari Teaching Session**: Interactive learning with an animated teacher
- **Beautiful UI**: Modern design with Radix UI components and TailwindCSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

The `.env` file is already configured for local development:
- Backend API: `http://localhost:8000`
- Default User ID: `dev-user-001`

### 3. Start the Backend

Make sure the backend is running first:

```bash
cd ../backend
python -m app.main
```

The backend should be accessible at `http://localhost:8000`

### 4. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Integration

The frontend connects to the following backend endpoints:

- `POST /api/v1/recordings/analyze` - Analyze recitation recordings
- `POST /api/v1/recordings/analyze/quick` - Quick word-level analysis  
- `GET /api/v1/user/{user_id}/stats` - Get user statistics
- `GET /api/v1/user/{user_id}/progress` - Get progress data
- `GET /health` - Health check

## Usage

1. **Select a Surah and Ayah** from the home screen
2. **Click "Start Recording"** and recite
3. **Click "Stop Recording"** when done (max 12 seconds)
4. **Playback** your recording to review
5. **Analyze** to get AI-powered tajweed feedback
6. **Review results** including errors and suggestions

## Architecture

```
src/
├── api/
│   ├── client.ts       # Axios-based API client
│   └── types.ts        # TypeScript type definitions
├── components/
│   ├── RecordingScreen.tsx   # Main recording interface
│   ├── ResultsScreen.tsx     # Analysis results
│   ├── Home.tsx              # Home screen
│   ├── ProgressScreen.tsx    # Progress tracking
│   └── ...
├── hooks/
│   └── useAudioRecorder.ts   # Audio recording hook
└── App.tsx
```

## Development Notes

- The frontend uses browser's MediaRecorder API for audio capture
- Audio format: WebM with Opus codec (fallback to MP4)
- The backend already handles WebM format
- CORS is configured to allow all origins in development

## Troubleshooting

### Backend Connection Error

If you see "Cannot connect to the backend server":
1. Ensure backend is running on `http://localhost:8000`
2. Check the backend console for errors
3. Verify CORS settings in backend

### Microphone Permission

If microphone access fails:
1. Check browser permissions (usually top-left of address bar)
2. Use HTTPS in production (HTTP is fine for localhost)
3. Try a different browser

### Build Errors

If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

For production, update `.env`:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

Then build:
```bash
npm run build
```

The output will be in the `dist/` directory.