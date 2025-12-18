import { Hono } from 'hono';
import { Env, Run } from '../types';

export const runsRouter = new Hono<{ Bindings: Env }>();

// GET /api/runs/:id - Get run details
runsRouter.get('/:id', async (c) => {
    const id = c.req.param('id');

    const run = await c.env.DB.prepare(
        'SELECT * FROM runs WHERE id = ?'
    ).bind(id).first<Run>();

    if (!run) {
        return c.json({ error: 'Run not found' }, 404);
    }

    // Parse JSON fields
    const response = {
        ...run,
        council_models: JSON.parse(run.council_models),
        stage1_results: run.stage1_results ? JSON.parse(run.stage1_results) : null,
        stage2_results: run.stage2_results ? JSON.parse(run.stage2_results) : null,
        stage3_results: run.stage3_results ? JSON.parse(run.stage3_results) : null,
        stage4_results: run.stage4_results ? JSON.parse(run.stage4_results) : null,
    };

    return c.json(response);
});

// GET /api/runs - List runs for a conversation
runsRouter.get('/', async (c) => {
    const conversationId = c.req.query('conversation_id');

    if (!conversationId) {
        return c.json({ error: 'conversation_id is required' }, 400);
    }

    const runs = await c.env.DB.prepare(
        'SELECT id, conversation_id, stage1_status, stage2_status, stage3_status, stage4_status, latency_ms, created_at FROM runs WHERE conversation_id = ? ORDER BY created_at DESC'
    ).bind(conversationId).all<Run>();

    return c.json({ runs: runs.results });
});
