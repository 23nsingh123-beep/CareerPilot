const geminiChatService = require('../services/geminiChatService');

exports.handleChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required and cannot be empty.' });
    }

    // Limit conversation history length
    if (messages.length > 20) {
      return res.status(400).json({ error: 'Conversation history exceeds maximum allowed length of 20 messages.' });
    }

    // Validate and sanitize each message
    for (const msg of messages) {
      if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
        return res.status(400).json({ error: 'Invalid role. Only "user" and "assistant" are allowed.' });
      }
      if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
        return res.status(400).json({ error: 'Message content must be a non-empty string.' });
      }
      if (msg.content.length > 2000) {
        return res.status(400).json({ error: 'Message content exceeds maximum allowed length of 2000 characters.' });
      }
    }

    const replyText = await geminiChatService.chatWithAssistant(messages);

    res.status(200).json({
      success: true,
      reply: replyText
    });
  } catch (error) {
    const status = error.message.includes('not configured') || error.message.includes('timeout') ? 503 : 500;
    // Don't expose internal stack traces or secrets to frontend
    res.status(status).json({ error: error.message || 'An error occurred while processing your request.' });
  }
};
