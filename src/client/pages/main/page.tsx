import { Button, Input, List, message, Modal, Space, Typography } from 'antd';
import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import '../../utils/db';
import { add, getAll } from '../../utils/db';
import { SearchTree } from '../../component/search-tree';

const { confirm } = Modal;

const fetchDirection = (path: string) =>
  window
    .fetch(`/api/get-directories-by-path?path=${path}`)
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.success) {
        message.error(responseData.message);
        return;
      }
      return responseData.allDirectory;
    });

/** 关联文件夹 */
const useRelevanceDirectory = () => {
  const inputRef = useRef<any>();
  return () => {
    return confirm({
      title: '关联文档夹',
      content: <Input placeholder="请填写需要关联的文件夹的路径（最多5层）" ref={inputRef} />,
      icon: null,
      async onOk() {
        const directoryPath = inputRef.current.input.value;
        await add('directory', { path: directoryPath });
        return fetchDirection(directoryPath);
      },
    });
  };
};

const renderTreeItem = (nodeData: any) => {
  if (!nodeData.isSymbolicLink) {
    return nodeData.title;
  }
  return (
    <Typography.Text type="secondary">
      {nodeData.title} --&gt; {nodeData.symbolicLinkPath}
    </Typography.Text>
  );
};

export const IndexPage: React.FC = () => {
  const [list, setList] = useState<Array<{ path: string; allDirectory: any }>>([]);
  const relevanceDirectory = useRelevanceDirectory();

  useLayoutEffect(() => {
    getAll('directory').then((list: any[]) => {
      list.forEach(({ path }: any) => {
        fetchDirection(path).then((res: any) => {
          if (!res) {
            return;
          }
          setList((prev) => {
            return [...prev, res];
          });
        });
      });
    });
  }, []);

  const onDrop = (index: number, info: any) => {
    Modal.confirm({
      title: '你确定要软链？',
      onOk: () => {
        const homePath = list[index].path;
        window
          .fetch(`/api/link-path?from=${info.dragNode.key}&to=${info.node.key}&home=${homePath}`)
          .then((response) => response.json())
          .then((res) => {
            if (!res.success) {
              message.error(res.message);
              return;
            }
            setList((prev) => {
              prev[index] = res;
              return [...prev];
            });
          });
      },
    });
  };

  return (
    <Space direction="vertical" size="large">
      <Button onClick={relevanceDirectory}>关联文件夹</Button>
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item, index) => (
          <SearchTree
            draggable={{ icon: false }}
            showLine
            treeData={item.allDirectory || []}
            onDrop={onDrop.bind(this, index)}
            titleRender={renderTreeItem}
          />
        )}
      />
    </Space>
  );
};
