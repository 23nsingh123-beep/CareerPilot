const geminiChatService = require("../services/geminiChatService");
const { savePrompt } = require("../services/notionService");

exports.handleChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Messages array is required and cannot be empty.",
      });
    }

    if (messages.length > 20) {
      return res.status(400).json({
        error:
          "Conversation history exceeds maximum allowed length of 20 messages.",
      });
    }

    for (const msg of messages) {
      if (!msg.role || !["user", "assistant"].includes(msg.role)) {
        return res.status(400).json({
          error:
            'Invalid role. Only "user" and "assistant" are allowed.',
        });
      }

      if (
        typeof msg.content !== "string" ||
        msg.content.trim().length === 0
      ) {
        return res.status(400).json({
          error: "Message content must be a non-empty string.",
        });
      }

      const maxLength = msg.role === "user" ? 2000 : 10000;

      if (msg.content.length > maxLength) {
        return res.status(400).json({
          error: `${msg.role} message exceeds maximum allowed length of ${maxLength} characters.`,
        });
      }
    }
console.log("Conversation:");

messages.forEach((msg, index) => {
  console.log(
    index,
    msg.role,
    msg.content.length
  );
});
    const replyText =
      await geminiChatService.chatWithAssistant(messages);

    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user");

    savePrompt({
      prompt: latestUserMessage?.content || "Unknown prompt",
      response: replyText,
      user: "Landing Page Visitor",
      model: process.env.GEMINI_MODEL || "Gemini",
    }).catch((error) => {
      console.error("Background Notion error:", error.message);
    });

    return res.status(200).json({
      success: true,
      reply: replyText,
    });
  } catch (error) {
    const status =
      error.message.includes("not configured") ||
      error.message.includes("timeout")
        ? 503
        : 500;

    return res.status(status).json({
      error:
        error.message ||
        "An error occurred while processing your request.",
    });
  }
};