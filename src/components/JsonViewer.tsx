import React, { useRef, useState, useEffect } from 'react';
import { message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import JSON5 from 'json5';
import './JsonViewer.css';

// 注册JSON语言
SyntaxHighlighter.registerLanguage('json', json);

interface JsonViewerProps {
  json: string;
}

interface JsonError {
  message: string;
  line: number;
  column: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ json }) => {
  const lineRef = useRef<HTMLPreElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCompressed, setIsCompressed] = useState(false);
  const [error, setError] = useState<JsonError | null>(null);
  const [formattedJson, setFormattedJson] = useState('');

  useEffect(() => {
    if (!json.trim()) {
      setError(null);
      setFormattedJson('');
      return;
    }
    try {
      const parsed = JSON5.parse(json);
      setError(null);
      setFormattedJson(
        isCompressed ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
      );
    } catch (err: any) {
      const errorInfo: JsonError = {
        message: err.message,
        line: err.lineNumber || 0,
        column: err.columnNumber || 0
      };
      setError(errorInfo);
      setFormattedJson(`Invalid JSON: ${errorInfo.message} (行 ${errorInfo.line}, 列 ${errorInfo.column})`);
    }
  }, [json, isCompressed]);

  // 处理复制功能
  const handleCopy = () => {
    if (formattedJson && !formattedJson.startsWith('Invalid JSON')) {
      navigator.clipboard.writeText(formattedJson).then(() => {
        message.success('复制成功');
      }).catch(() => {
        message.error('复制失败');
      });
    }
  };

  // 处理压缩/格式化切换
  const handleToggleCompress = () => {
    setIsCompressed((prev) => !prev);
  };

  // 生成行号
  const generateLineNumbers = (text: string) => {
    const lines = text.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  };

  // 滚动同步
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (lineRef.current) {
      lineRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="json-viewer">
      <div className="viewer-header">
        <h2>格式化JSON</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="copy-button"
            onClick={handleToggleCompress}
            disabled={!formattedJson || formattedJson.startsWith('Invalid JSON')}
          >
            {isCompressed ? '格式化' : '压缩'}
          </button>
          <button 
            className="copy-button" 
            onClick={handleCopy}
            disabled={!formattedJson || formattedJson.startsWith('Invalid JSON')}
          >
            <CopyOutlined /> 复制
          </button>
        </div>
      </div>
      <div className="viewer-body">
        <div className="syntax-highlighter-wrapper">
          <pre
            className="line-numbers-viewer"
            ref={lineRef}
          >
            {formattedJson ? generateLineNumbers(formattedJson) : '1'}
          </pre>
          <div
            className="syntax-content-viewer"
            ref={contentRef}
            onScroll={handleScroll}
          >
            {formattedJson ? (
              <SyntaxHighlighter
                language="json"
                style={vs}
                customStyle={{
                  margin: 0,
                  background: '#fff',
                  fontSize: 14,
                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, source-code-pro, monospace',
                  lineHeight: 1.5,
                  padding: 0,
                  minHeight: '100%',
                }}
                showLineNumbers={false}
              >
                {formattedJson}
              </SyntaxHighlighter>
            ) : (
              <div className="empty-state">请输入JSON进行格式化</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer; 