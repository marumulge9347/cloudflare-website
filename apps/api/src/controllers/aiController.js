const {
  generateArticle,
  generateSEO,
  improveContent,
} = require("../services/aiService");

async function generateArticleController(req, res, next) {
  try {
    const {
      topic,
      tone = "professional",
      length = "medium",
      keywords = [],
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Article topic is required",
      });
    }

    const content = await generateArticle({
      topic: topic.trim(),
      tone,
      length,
      keywords: Array.isArray(keywords) ? keywords : [],
    });

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    next(error);
  }
}

async function generateSEOController(req, res, next) {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Article title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Article content is required",
      });
    }

    const seo = await generateSEO({
      title: title.trim(),
      content: content.trim(),
    });

    res.json({
      success: true,
      seo,
    });
  } catch (error) {
    next(error);
  }
}

async function improveContentController(req, res, next) {
  try {
    const { content, instruction } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const improvedContent = await improveContent({
      content,
      instruction,
    });

    res.json({
      success: true,
      content: improvedContent,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  generateArticleController,
  generateSEOController,
  improveContentController,
};
