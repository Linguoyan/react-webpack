/** 通用动态面包屑 **/
import React, { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import './index.less';

export default function BreadCom(props) {
  /** 根据当前location动态生成对应的面包屑 **/
  const breads = useMemo(() => {
    const paths = props.location.pathname;
    const breads = [];

    let parentId = null;
    do {
      const pathObj = props.menus.find(
        (v) => v.id === parentId || v.url === paths
      );

      if (pathObj) {
        breads.push(
          <Breadcrumb.Item key={pathObj.id}>{pathObj.title}</Breadcrumb.Item>
        );
        parentId = pathObj.parent;
      } else {
        parentId = null;
      }
    } while (parentId);

    breads.reverse();
    return breads;
  }, [props.location.pathname, props.menus]);

  return (
    <div className="bread">
      <EnvironmentOutlined className="icon" />
      <Breadcrumb>{breads}</Breadcrumb>
    </div>
  );
}
