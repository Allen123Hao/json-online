import React, { useState, useRef, useEffect } from 'react';
import { Input, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import './JsonEditor.css';

const { TextArea } = Input;

interface JsonEditorProps {
  onJsonChange: (json: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ onJsonChange }) => {
  const [json, setJson] = useState<string>('');
  const [lineNumbers, setLineNumbers] = useState<string>('1');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // 更新行号
  const updateLineNumbers = (text: string) => {
    const lines = text.split('\n').length;
    const numbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    setLineNumbers(numbers);
  };

  // 处理JSON输入
  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJson(value);
    updateLineNumbers(value);
    onJsonChange(value);
  };

  // 处理复制功能
  const handleCopy = () => {
    if (json) {
      navigator.clipboard.writeText(json).then(() => {
        message.success('复制成功');
      }).catch(() => {
        message.error('复制失败');
      });
    }
  };

  // 处理示例填充
  const handleExample = () => {
    const example = '{\n  "name": "张三",\n  "age": 30,\n  "isActive": true,\n  "tags": ["开发", "前端"]\n}';
    setJson(example);
    updateLineNumbers(example);
    onJsonChange(example);
  };

  // 处理清空
  const handleClear = () => {
    setJson('');
    updateLineNumbers('');
    onJsonChange('');
  };

  // 同步滚动
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div className="json-editor">
      <div className="editor-header">
        <h2>输入JSON</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="copy-button" onClick={handleExample}>
            示例
          </button>
          <button className="copy-button" onClick={handleClear}>
            清空
          </button>
          <button className="copy-button" onClick={handleCopy}>
            <CopyOutlined /> 复制
          </button>
        </div>
      </div>
      <div className="editor-body" style={{alignItems: 'stretch'}}>
        <div className="line-numbers" ref={lineNumbersRef} style={{height: '100%', boxSizing: 'border-box'}}>
          {lineNumbers}
        </div>
        <TextArea
          ref={textareaRef}
          value={json}
          onChange={handleJsonChange}
          onScroll={handleScroll}
          placeholder="请在此输入JSON..."
          className="json-textarea"
          autoSize={false}
          style={{height: '100%', boxSizing: 'border-box', resize: 'none'}}
        />
      </div>
    </div>
  );
};

export default JsonEditor; 