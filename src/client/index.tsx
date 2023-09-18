import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import zhCN from 'antd/locale/zh_CN';
import { IndexPage } from './pages/main/page';
import { ConfigProvider } from 'antd';

const target = document.getElementById('app');
if (target) {
  ReactDOM.createRoot(target).render(
    <ConfigProvider locale={zhCN}>
      <IndexPage />
    </ConfigProvider>
  );
}
