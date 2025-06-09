import { Layout } from 'antd';
import { useState } from 'react';
import JsonEditor from './components/JsonEditor';
import JsonViewer from './components/JsonViewer';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const [jsonInput, setJsonInput] = useState<string>('');

  const handleJsonChange = (json: string) => {
    setJsonInput(json);
  };

  return (
    <Layout className="app-container">
      <Header className="app-header">
        <h1>JSON在线解析工具</h1>
      </Header>
      <Content className="app-content">
        <div className="editor-container">
          {/* 左侧JSON输入区域 */}
          <div className="editor-section">
            <JsonEditor onJsonChange={handleJsonChange} />
          </div>
          
          {/* 右侧JSON展示区域 */}
          <div className="editor-section">
            <JsonViewer json={jsonInput} />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
