const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Notion rich-text items have size limits, so split long AI responses.
const splitText = (text, size = 1900) => {
  const value = String(text || "");
  const chunks = [];

  for (let i = 0; i < value.length; i += size) {
    chunks.push({
      type: "text",
      text: {
        content: value.slice(i, i + size),
      },
    });
  }

  return chunks.length
    ? chunks
    : [{ type: "text", text: { content: "" } }];
};

const savePrompt = async ({
  prompt,
  response,
  user = "Guest",
  model = "Gemini",
}) => {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATA_SOURCE_ID) {
    console.warn("Notion variables are not configured; skipping prompt tracking.");
    return;
  }

  try {
    await notion.pages.create({
      parent: {
        type: "data_source_id",
        data_source_id: process.env.NOTION_DATA_SOURCE_ID,
      },

      properties: {
        Prompt: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: String(prompt || "Untitled prompt").slice(0, 1900),
              },
            },
          ],
        },

        "AI Response": {
          type: "rich_text",
          rich_text: splitText(response),
        },

        User: {
          type: "rich_text",
          rich_text: splitText(user),
        },

        Model: {
          type: "rich_text",
          rich_text: splitText(model),
        },

        Date: {
          type: "date",
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    console.log("Chat saved to Notion.");
  } catch (error) {
    console.error(
      "Notion save failed:",
      error.body?.message || error.message
    );
  }
};

module.exports = { savePrompt };