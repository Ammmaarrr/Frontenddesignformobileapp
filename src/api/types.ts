/**
 * API Type Definitions
 * TypeScript interfaces matching backend response schemas
 */

// Recitation Analysis Types
export interface RecitationAnalysisRequest {
    user_id: string;
    surah?: number;
    ayah?: number;
    mode: 'short' | 'long';
    audio_file: File;
}

export interface MatchedAyah {
    surah: number;
    ayah: number;
    confidence: number;
    text?: string;
}

export interface TajweedError {
    type: string;
    letter?: string;
    expected?: string;
    detected?: string;
    start_time: number;
    end_time: number;
    confidence: number;
    suggestion: string;
    correction_audio_url?: string;
}

export interface RecitationAnalysisResponse {
    request_id: string;
    matched_ayah: MatchedAyah;
    errors: TajweedError[];
    overall_score: number;
    recommendation: string;
    processing_time_seconds: number;
}

// User Stats Types
export interface UserStatsResponse {
    user_id: string;
    total_sessions: number;
    average_accuracy: number;
    current_streak_days: number;
    total_ayahs_practiced: number;
    last_session_date?: string;
}

// Progress Types
export interface SessionHistory {
    session_id: string;
    date: string;
    surah: number;
    ayah: number;
    score: number;
    errors_count: number;
}

export interface AyahProgress {
    surah: number;
    ayah: number;
    attempts: number;
    best_score: number;
    last_practiced: string;
    mastery_level: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
}

export interface ProgressDataResponse {
    user_id: string;
    session_history: SessionHistory[];
    ayah_progress: AyahProgress[];
    improvement_trend: {
        date: string;
        average_score: number;
    }[];
}

// Error Response
export interface ErrorResponse {
    detail: string;
    status_code: number;
}

// Quick Analysis Types
export interface QuickAnalysisRequest {
    user_id: string;
    surah: number;
    ayah: number;
    target_word_index: number;
    error_type: string;
    audio_file: File;
}

export interface QuickAnalysisResponse {
    passed: boolean;
    confidence: number;
    feedback: string;
    target_word: string;
    detected: string | null;
}
