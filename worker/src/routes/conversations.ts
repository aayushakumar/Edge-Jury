import { Hono } from 'hono';
import { Env, Conversation, Message } from '../types';
import { generateId } from '../utils/id';

export const conversationsRouter = new Hono<{ Bindings: Env }>();

// GET /api/conversations - List all conversations
conversationsRouter.get('/', async (c) => {
    const result = await c.env.DB.prepare(
        'SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 50'
    ).all<Conversation>();

    return c.json({ conversations: result.results });
});

// POST /api/conversations - Create new conversation
conversationsRouter.post('/', async (c) => {
    const body = await c.req.json<{ title?: string }>();
    const id = generateId();
    const title = body.title || 'New Conversation';

    await c.env.DB.prepare(
        'INSERT INTO conversations (id, title) VALUES (?, ?)'
    ).bind(id, title).run();

    return c.json({ id, title }, 201);
});

// GET /api/conversations/:id - Get conversation with messages
conversationsRouter.get('/:id', async (c) => {
    const id = c.req.param('id');

    const conversation = await c.env.DB.prepare(
        'SELECT * FROM conversations WHERE id = ?'
    ).bind(id).first<Conversation>();

    if (!conversation) {
        return c.json({ error: 'Conversation not found' }, 404);
    }

    const messages = await c.env.DB.prepare(
        'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
    ).bind(id).all<Message>();

    return c.json({
        conversation,
        messages: messages.results,
    });
});

// DELETE /api/conversations/:id - Delete conversation
conversationsRouter.delete('/:id', async (c) => {
    const id = c.req.param('id');

    await c.env.DB.prepare(
        'DELETE FROM conversations WHERE id = ?'
    ).bind(id).run();

    return c.json({ success: true });
});
