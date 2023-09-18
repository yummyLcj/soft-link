declare module '*antd@5.9.1/+esm' {
  export * from '@/client/resource/antd.js';
}

declare module '*@18.2.0/umd/react.production.min.js/+esm' {
  export * from '@/client/resource/react.js';
  export * as default from '@/client/resource/react.js';
}

declare module '*react-router-dom@6.16.0/+esm' {
  export * from '@/client/resource/react-router-dom.js';
  export * as default from '@/client/resource/react-router-dom.js';
}

declare module '*react-dom@18.2.0/index.min.js/+esm' {
  import * as ReactDom from '@/client/resource/react-dom.js';
  export * from '@/client/resource/react-dom.js';
  export default ReactDom;
}
