import { Typography, Input, Tree, TreeProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import * as React from 'react';
import { useMemo, useState } from 'react';

const { Search } = Input;

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
  let parentKey: React.Key;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey!;
};

const flatTreeData = (treeData: DataNode[]) => {
  let flatedTreeData: any[] = [];
  treeData.forEach(({ children, ...node }) => {
    flatedTreeData.push(node as any);
    if (children?.length) {
      flatedTreeData = flatedTreeData.concat(flatTreeData(children));
    }
  });
  return flatedTreeData;
};

export const SearchTree: React.FC<TreeProps> = ({ treeData, ...props }: any) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const flatedTreeData = useMemo(() => flatTreeData(treeData), [treeData]);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const newExpandedKeys = flatedTreeData
      .map((item: any) => {
        if ((item.title as string).indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys as React.Key[]);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const _treeData = useMemo(() => {
    const loop = (data: DataNode[]): DataNode[] =>
      data.map((item) => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <Typography.Text type="danger">{searchValue}</Typography.Text>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return { ...item, title, key: item.key, children: loop(item.children) };
        }

        return {
          ...item,
          title,
          key: item.key,
        };
      });

    return loop(treeData);
  }, [searchValue]);

  return (
    <div>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Tree.DirectoryTree
        {...props}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={_treeData}
      />
    </div>
  );
};
