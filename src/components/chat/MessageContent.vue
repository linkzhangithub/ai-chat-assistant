<template>
  <div v-if="isMarkdown" class="markdown-body" v-html="renderedHtml"></div>
  <div v-else class="plain-text">{{ content }}</div>
</template>

<script setup>
import { computed, shallowRef, watchEffect } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

const props = defineProps({
  content: { type: String, required: true },
  role: { type: String, required: true },
});

const isMarkdown = computed(() => props.content.includes("```"));

let mdInstance = null;
function getMarkdownIt() {
  if (!mdInstance) {
    mdInstance = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const highlighted = hljs.highlight(str, {
              language: lang,
              ignoreIllegals: true,
            }).value;
            return `<pre class="code-block"><code class="hljs">${highlighted}</code></pre>`;
          } catch (__) {}
        }
        return `<pre class="code-block"><code>${mdInstance.utils.escapeHtml(str)}</code></pre>`;
      },
    });
  }
  return mdInstance;
}

const renderedHtml = shallowRef("");
watchEffect(() => {
  if (isMarkdown.value) {
    const md = getMarkdownIt();
    renderedHtml.value = md.render(props.content);
  } else {
    renderedHtml.value = "";
  }
});
</script>

<style>
.markdown-body {
  font-size: 0.95rem;
  line-height: 1.5;
  color: inherit;
}
.markdown-body pre {
  border-radius: 16px !important;
  overflow: auto !important;
}
.markdown-body .code-block {
  background: #1e1e1e !important;
  padding: 12px 16px;
  border-radius: 16px;
  overflow-x: auto;
  margin: 8px 0;
}
.markdown-body code {
  font-family: monospace;
  font-size: 0.85rem;
  background: transparent !important;
  color: #d4d4d4 !important;
}
.markdown-body .hljs {
  background: transparent;
  color: #d4d4d4;
}
.markdown-body .hljs-keyword,
.markdown-body .hljs-selector-tag,
.markdown-body .hljs-title,
.markdown-body .hljs-name,
.markdown-body .hljs-built_in,
.markdown-body .hljs-literal {
  color: #569cd6;
}
.markdown-body .hljs-string,
.markdown-body .hljs-attr,
.markdown-body .hljs-attribute {
  color: #ce9178;
}
.markdown-body .hljs-number,
.markdown-body .hljs-literal {
  color: #b5cea8;
}
.markdown-body .hljs-comment {
  color: #6a9955;
}
.markdown-body .hljs-function .hljs-title {
  color: #dcdcaa;
}
.markdown-body .hljs-params {
  color: #9cdcfe;
}
.markdown-body .hljs-variable {
  color: #9cdcfe;
}
.markdown-body .hljs-operator {
  color: #d4d4d4;
}
.markdown-body p {
  margin: 0 0 8px 0;
}
.markdown-body ul,
.markdown-body ol {
  margin: 4px 0 8px 20px;
  padding-left: 0;
}
.markdown-body ul {
  list-style-type: disc;
}
.markdown-body ol {
  list-style-type: decimal;
}
.markdown-body li {
  margin-bottom: 4px;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin: 8px 0;
  font-weight: 600;
}
.markdown-body a {
  color: #007aff;
  text-decoration: none;
}
.markdown-body a:hover {
  text-decoration: underline;
}
.plain-text {
  white-space: pre-wrap;
  color: inherit;
}
</style>
