// Type definitions for EdgeJury Worker

export interface Env {
    DB: D1Database;
    KV: KVNamespace;
    AI: Ai;
    COUNCIL_SIZE: string;
    MAX_TOKENS_STAGE1: string;
    MAX_TOKENS_STAGE2: string;
    MAX_TOKENS_STAGE3: string;
    MAX_TOKENS_STAGE4: string;
}

// Database types
export interface Conversation {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    role: 'user' | 'system' | 'model' | 'chairman' | 'verifier';
    model_id: string | null;
    content: string;
    created_at: string;
}

export interface Run {
    id: string;
    conversation_id: string;
    user_message_id: string;
    council_models: string;
    chairman_model_id: string;
    stage1_status: StageStatus;
    stage2_status: StageStatus;
    stage3_status: StageStatus;
    stage4_status: StageStatus;
    stage1_results: string | null;
    stage2_results: string | null;
    stage3_results: string | null;
    stage4_results: string | null;
    tokens_in: number;
    tokens_out: number;
    neuron_cost: number;
    latency_ms: number;
    created_at: string;
}

export type StageStatus = 'pending' | 'running' | 'completed' | 'failed';

// API types
export interface ChatRequest {
    conversation_id?: string;
    message: string;
    settings?: CouncilSettings;
}

export interface CouncilSettings {
    council_size?: number;
    models?: string[];
    verification_mode?: 'off' | 'consistency' | 'evidence';
    enable_cross_review?: boolean;
    anonymize_reviews?: boolean;
}

// Stage 1: First Opinions
export interface Stage1Result {
    model_id: string;
    role: ModelRole;
    response: string;
    tokens_used: number;
    latency_ms: number;
}

export type ModelRole =
    | 'direct_answerer'
    | 'edge_case_finder'
    | 'step_by_step_explainer'
    | 'pragmatic_implementer';

// Stage 2: Cross-Review
export interface Stage2Result {
    reviewer_model_id: string;
    rankings: ModelRanking[];
    issues: Issue[];
    best_bits: BestBit[];
}

export interface ModelRanking {
    candidate: string;
    accuracy: number;
    insight: number;
    clarity: number;
}

export interface Issue {
    candidate: string;
    type: 'factual_risk' | 'missing_edge_case' | 'unclear' | 'incomplete';
    detail: string;
}

export interface BestBit {
    candidate: string;
    extract: string;
}

// Stage 3: Chairman Synthesis
export interface Stage3Result {
    final_answer: string;
    rationale: string[];
    open_questions: string[];
    disagreements: Disagreement[];
}

export interface Disagreement {
    topic: string;
    positions: { model: string; stance: string }[];
    resolution: string;
}

// Stage 4: Verification
export interface Stage4Result {
    mode: 'consistency' | 'evidence';
    claims: Claim[];
}

export interface Claim {
    text: string;
    label: 'verified' | 'consistent' | 'uncertain' | 'contradicted';
    evidence?: string;
    note?: string;
    source?: string;
}

// SSE Event types
export type SSEEventType =
    | 'stage1.start'
    | 'stage1.model_result'
    | 'stage1.complete'
    | 'stage2.start'
    | 'stage2.review_result'
    | 'stage2.complete'
    | 'stage3.start'
    | 'stage3.chairman_result'
    | 'stage3.complete'
    | 'stage4.start'
    | 'stage4.verification_result'
    | 'stage4.complete'
    | 'done'
    | 'error';

export interface SSEEvent {
    event: SSEEventType;
    data: unknown;
}

// Workers AI model identifiers
// Note: Using 'as const' and casting to work with Workers AI types
export const COUNCIL_MODELS = {
    LLAMA_3_1_8B_FAST: '@cf/meta/llama-3.1-8b-instruct-fast' as const,
    LLAMA_3_1_8B: '@cf/meta/llama-3.1-8b-instruct' as const,
    LLAMA_3_2_3B: '@cf/meta/llama-3.2-3b-instruct' as const,
    MISTRAL_7B: '@cf/mistral/mistral-7b-instruct-v0.1' as const, // Using v0.1 AWQ for reliability
    GEMMA_7B: '@cf/google/gemma-7b-it' as const,
} as const;

export type CouncilModelId = (typeof COUNCIL_MODELS)[keyof typeof COUNCIL_MODELS];

