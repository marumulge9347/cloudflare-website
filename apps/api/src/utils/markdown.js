const { marked } = require("marked");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

marked.setOptions({
  gfm: true,
  breaks: true,
});

function markdownToHtml(markdown) {
  if (!markdown) return "";

  const html = marked.parse(markdown);

  return DOMPurify.sanitize(html);
}

module.exports = markdownToHtml;
