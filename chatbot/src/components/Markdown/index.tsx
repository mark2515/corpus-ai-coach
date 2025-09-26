import React from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import styles from "./index.module.css";

type IProps = {
  markdownText: string;
};

/**
 * Markdown component that renders markdown text with syntax highlighting
 */

export const Markdown = (props: IProps) => {
  const renderer = new marked.Renderer();
  renderer.code = (code, language: string) => {
    const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
    const highlightedCode = hljs.highlight(validLanguage, code).value;
    return `<pre><code class="hljs ${validLanguage}" style="border-radius: 5px" >${highlightedCode}</code></pre>`;
  };
  const markdownText = props.markdownText;
  marked.setOptions({
    renderer,
    mangle: false,
    headerIds: false,
  });
  const html = marked(markdownText);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={styles.mark}
    ></div>
  );
};
