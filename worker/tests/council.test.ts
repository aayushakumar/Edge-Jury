import { describe, it, expect } from 'vitest';
import { CouncilService } from '../src/services/council';
import { COUNCIL_MODELS } from '../src/types';

describe('CouncilService', () => {
    describe('getCouncilModels', () => {
        it('returns 1 model for council size 1', () => {
            const models = CouncilService.getCouncilModels(1);
            expect(models).toHaveLength(1);
            expect(models[0]).toBe(COUNCIL_MODELS.LLAMA_3_1_8B_FAST);
        });

        it('returns 2 models for council size 2', () => {
            const models = CouncilService.getCouncilModels(2);
            expect(models).toHaveLength(2);
            expect(models).toContain(COUNCIL_MODELS.LLAMA_3_1_8B_FAST);
            expect(models).toContain(COUNCIL_MODELS.LLAMA_3_1_8B);
        });

        it('returns 3 models for council size 3 (default)', () => {
            const models = CouncilService.getCouncilModels(3);
            expect(models).toHaveLength(3);
            expect(models).toContain(COUNCIL_MODELS.LLAMA_3_1_8B_FAST);
            expect(models).toContain(COUNCIL_MODELS.LLAMA_3_1_8B);
            expect(models).toContain(COUNCIL_MODELS.LLAMA_3_2_3B);
        });

        it('returns 4 models for council size 4 (includes Mistral)', () => {
            const models = CouncilService.getCouncilModels(4);
            expect(models).toHaveLength(4);
            expect(models).toContain(COUNCIL_MODELS.MISTRAL_7B);
        });

        it('caps at available models for oversized councils', () => {
            const models = CouncilService.getCouncilModels(10);
            expect(models).toHaveLength(4); // Only 4 models in roster
        });

        it('returns empty array for council size 0', () => {
            const models = CouncilService.getCouncilModels(0);
            expect(models).toHaveLength(0);
        });
    });
});

describe('COUNCIL_MODELS', () => {
    it('contains valid model identifiers', () => {
        expect(COUNCIL_MODELS.LLAMA_3_1_8B_FAST).toMatch(/^@cf\//);
        expect(COUNCIL_MODELS.LLAMA_3_1_8B).toMatch(/^@cf\//);
        expect(COUNCIL_MODELS.MISTRAL_7B).toMatch(/^@cf\//);
    });

    it('Mistral model uses v0.1 for reliability', () => {
        expect(COUNCIL_MODELS.MISTRAL_7B).toContain('v0.1');
    });
});
