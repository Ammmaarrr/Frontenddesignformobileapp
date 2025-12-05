/**
 * API Client
 * HTTP client for communicating with the Qari backend API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
    RecitationAnalysisResponse,
    UserStatsResponse,
    ProgressDataResponse,
    QuickAnalysisResponse,
    ErrorResponse,
} from './types';

// Get API base URL from environment variable, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

class QariApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Response interceptor for error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError<ErrorResponse>) => {
                console.error('API Error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    /**
     * Analyze a recitation recording
     */
    async analyzeRecording(
        userId: string,
        audioFile: File,
        surah?: number,
        ayah?: number,
        mode: 'short' | 'long' = 'short'
    ): Promise<RecitationAnalysisResponse> {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('audio_file', audioFile);
        formData.append('mode', mode);

        if (surah !== undefined) {
            formData.append('surah', surah.toString());
        }
        if (ayah !== undefined) {
            formData.append('ayah', ayah.toString());
        }

        const response = await this.client.post<RecitationAnalysisResponse>(
            '/api/v1/recordings/analyze',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    }

    /**
     * Quick analysis for repetition loop
     */
    async quickAnalyze(
        userId: string,
        surah: number,
        ayah: number,
        targetWordIndex: number,
        errorType: string,
        audioFile: File
    ): Promise<QuickAnalysisResponse> {
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('surah', surah.toString());
        formData.append('ayah', ayah.toString());
        formData.append('target_word_index', targetWordIndex.toString());
        formData.append('error_type', errorType);
        formData.append('audio_file', audioFile);

        const response = await this.client.post<QuickAnalysisResponse>(
            '/api/v1/recordings/analyze/quick',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    }

    /**
     * Get user statistics
     */
    async getUserStats(userId: string): Promise<UserStatsResponse> {
        const response = await this.client.get<UserStatsResponse>(
            `/api/v1/user/${userId}/stats`
        );
        return response.data;
    }

    /**
     * Get user progress data
     */
    async getUserProgress(userId: string): Promise<ProgressDataResponse> {
        const response = await this.client.get<ProgressDataResponse>(
            `/api/v1/user/${userId}/progress`
        );
        return response.data;
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string }> {
        const response = await this.client.get('/health');
        return response.data;
    }

    /**
     * Check if API is reachable
     */
    async isApiAvailable(): Promise<boolean> {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            console.error('API not available:', error);
            return false;
        }
    }
}

// Export singleton instance
export const apiClient = new QariApiClient();
export default apiClient;
