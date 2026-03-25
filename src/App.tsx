/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Trash2, FileText, Download } from 'lucide-react';
import generatePDF from 'react-to-pdf';

const DEFAULT_MARKDOWN = `# Welcome to the Live Markdown Editor

This is a live editor. Type on the left and see the **Rendered** output on the right.

## Features
- **Bold text** and *italic text*
- Unordered lists
  - Nested item 1
  - Nested item 2

### Code Example
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Data Table
| Column 1 | Column 2 |
| -------- | -------- |
| Row 1    | Data     |
| Row 2    | Data     |

> This is a blockquote.
> It can span multiple lines.

[Visit Example.com](https://example.com)

---
📱 Responsive design adapts to your screen size.`;

export default function App() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [convertNewlines, setConvertNewlines] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setMarkdown('');
  };

  const handleLoadSample = () => {
    setMarkdown(DEFAULT_MARKDOWN);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] font-sans selection:bg-[#e0e0e0]">
      {/* Header */}
      <header className="border-b border-[#e5e5e5] bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Markdown Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-black border border-black px-3 py-1.5 rounded hover:bg-black hover:text-white transition-all"
            >
              Load Sample
            </button>
            <div className="hidden md:flex items-center gap-4 text-xs font-medium text-[#666] uppercase tracking-widest ml-4">
              <span>Live Preview</span>
              <span className="w-1 h-1 bg-[#ccc] rounded-full"></span>
              <span>📱 Responsive</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-14rem)] min-h-[600px]">
          {/* Input Section */}
          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 px-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999]">
                  Markdown Input
                </label>
                <button
                  onClick={handleClear}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999] hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#999] mt-1">
                <span className="font-mono">{markdown.length} characters</span>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-black transition-colors">
                  <input 
                    type="checkbox" 
                    checked={convertNewlines} 
                    onChange={e => setConvertNewlines(e.target.checked)}
                    className="accent-black"
                  />
                  Convert \n to line breaks
                </label>
              </div>
            </div>
            <div className="flex-1 relative group">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type your markdown here..."
                className="w-full h-full p-4 bg-white border border-[#e5e5e5] rounded-xl focus:outline-none focus:ring-1 focus:ring-black/5 focus:border-black transition-all resize-none font-mono text-sm leading-relaxed"
              />
            </div>
          </section>

          {/* Output Section */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999]">
                Output
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => generatePDF(targetRef, { filename: 'markdown-output.pdf' })}
                  disabled={!markdown}
                  className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#999] hover:text-black transition-all flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Download className="w-3 h-3" />
                  PDF
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!markdown}
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-1 ${
                    isCopied ? 'text-green-600' : 'text-[#999] hover:text-black'
                  } disabled:opacity-30 disabled:cursor-not-allowed`}
                >
                  {isCopied ? (
                    <>Copied!</>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Source
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="w-full h-full bg-white border border-[#e5e5e5] rounded-xl overflow-auto text-[#333]">
                {markdown ? (
                  <div ref={targetRef} className="p-10 bg-white min-h-full flow-root">
                    <div className="markdown-body max-w-3xl mx-auto">
                      <Markdown
                      remarkPlugins={[remarkGfm, ...(convertNewlines ? [remarkBreaks] : [])]}
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus as any}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md !mt-4 !mb-4"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code style={{ backgroundColor: '#f3f4f6', color: '#ef4444' }} className="px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {markdown}
                    </Markdown>
                    </div>
                  </div>
                ) : (
                  <span className="text-[#bbb] italic text-sm p-6 block">Preview will appear here...</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
