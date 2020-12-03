/** 通用Tab切换导航 **/
import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import './index.less';

// ==================
// 类型声明
// ==================
import { History } from 'history';

const { TabPane } = Tabs;

export default function BreadCom(props) {
  /** 根据当前location动态生成对应的面包屑 **/
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const pathNow = props.menus.find(
      (item) => item.url === props.location.pathname
    );

    if (pathNow && !tabs.find((item) => item.url === pathNow.url)) {
      setTabs((tabs) => {
        return [...tabs, pathNow];
      });
    }
  }, [props.location.pathname, props.menus]);

  function onTabChange(key) {
    props.history.push(key);
  }

  function onEdit(targetKey, action) {
    if (action === 'remove') {
      const removeIndex = tabs.findIndex((item) => item.url === targetKey);
      const resTabs = [...tabs];
      resTabs.splice(removeIndex, 1);

      const lastIndex = removeIndex - 1;

      // 如果全部关闭了，就跳转到主页
      if (!resTabs.length) {
        props.history.push('/');
      } else if (targetKey === props.location.pathname) {
        // 如果关闭的是当前页，就跳转到前一页，如果已经是第1页了，就跳转到新数组到第0项
        if (lastIndex >= 0) {
          props.history.push(resTabs[lastIndex].url);
        } else {
          props.history.push(resTabs[0].url);
        }
      }

      setTabs(resTabs);
    }
  }

  return (
    <div>
      <Tabs
        className="bread-tabs-com"
        onChange={onTabChange}
        onEdit={onEdit}
        activeKey={props.location.pathname}
        type="editable-card"
        hideAdd
        key="1"
      >
        {tabs.map((item) => {
          return <TabPane tab={item.title} key={item.url}></TabPane>;
        })}
      </Tabs>
    </div>
  );
}
