// API Service for Qari App
// Connects to FastAPI backend at localhost:8000

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AnalysisError {
  type: string;
  letter?: string;
  expected?: string;
  detected?: string;
  start_time: number;
  end_time: number;
  confidence: number;
  suggestion: string;
  correction_audio_url: string;
}

export interface MatchedAyah {
  surah: number;
  ayah: number;
  confidence: number;
}

export interface RecitationResult {
  matched_ayah: MatchedAyah;
  errors: AnalysisError[];
  overall_score: number;
  recommendation: string;
}

export interface CorrectionItem {
  id: string;
  error_type: string;
  description: string;
  audio_url: string;
}

export interface HealthResponse {
  status: string;
  version?: string;
}

export interface FeedbackRequest {
  session_id: string;
  error_id: string;
  feedback_type: 'helpful' | 'not_helpful' | 'incorrect';
  comment?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check API health status
   */
  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error('API health check failed');
    }
    return response.json();
  }

  /**
   * Analyze a recitation audio file
   */
  async analyzeRecitation(
    audioBlob: Blob,
    surah: number,
    ayah: number
  ): Promise<RecitationResult> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('surah', surah.toString());
    formData.append('ayah', ayah.toString());

    const response = await fetch(`${this.baseUrl}/api/v1/recordings/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to analyze recitation');
    }

    return response.json();
  }

  /**
   * Get list of available corrections
   */
  async getCorrections(): Promise<CorrectionItem[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/corrections`);
    if (!response.ok) {
      throw new Error('Failed to fetch corrections');
    }
    return response.json();
  }

  /**
   * Get correction audio by error type
   */
  async getCorrectionAudio(errorType: string): Promise<CorrectionItem | null> {
    const response = await fetch(`${this.baseUrl}/api/v1/corrections/${errorType}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch correction');
    }
    return response.json();
  }

  /**
   * Submit feedback for an error correction
   */
  async submitFeedback(feedback: FeedbackRequest): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    return response.json();
  }

  /**
   * Get a specific verse text (future endpoint)
   */
  async getVerseText(surah: number, ayah: number): Promise<string> {
    // This would connect to a Quran text API
    // For now, return placeholder
    return `سورة ${surah} - آية ${ayah}`;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export { ApiService };
