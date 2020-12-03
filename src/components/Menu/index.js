/**
 * 左侧导航
 * -----------------------
 * 第三方库
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { cloneDeep } from 'lodash'; //javascript 实用工具库

/**
 * 自定义的东西
 */
import './index.less';
import ImgLogo from '@/assets/logo.png';
import Icon from '@/components/Icon';

const { Sider } = Layout;
const { SubMenu } = Menu;

function MenuCom(props) {
  const {
    data, //所有菜单数据
    collapsed, // 菜单咱开还是收起
    history, //历史记录
    location, // 组件当前所在的路由位置，不从history中获取，因为history是可变的
  } = props;

  const [chosedKey, setChosedKey] = useState([]); // 当前选中
  const [openKeys, setOpenKeys] = useState([]); // 当前需要被展开的项

  useEffect(() => {
    const paths = location.pathname.split('/').filter((item) => !!item);
    setChosedKey([location.pathname]); //设置当前选中的menu
    setOpenKeys(paths.map((item) => `/${item}`));
  }, [location]);

  // 菜单被选择
  const onSelect = useCallback(
    (e) => {
      history.push(e.key);
    },
    [history]
  );

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback((one, data) => {
    let kids;
    if (!one) {
      // 第1次递归
      kids = data.filter((item) => !item.parent);
    } else {
      kids = data.filter((item) => item.parent === one.id);
    }
    kids.forEach((item) => (item.children = dataToJson(item, data)));
    return kids.length ? kids : null;
  }, []);

  // 构建树结构
  const makeTreeDom = useCallback((data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.url}
            title={
              !item.parent && item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              ) : (
                item.title
              )
            }
          >
            {makeTreeDom(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.url}>
            {!item.parent && item.icon ? <Icon type={item.icon} /> : null}
            <span>{item.title}</span>
          </Menu.Item>
        );
      }
    });
  }, []);

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom = useMemo(() => {
    const d = cloneDeep(data);
    // 按照sort排序, 从小到大
    d.sort((a, b) => {
      return a.sorts - b.sorts;
    });
    const sourceData = dataToJson(null, d) || [];
    const treeDom = makeTreeDom(sourceData);
    return treeDom;
  }, [data, dataToJson, makeTreeDom]);

  return (
    <Sider
      width={256}
      className="sider"
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <div className={collapsed ? 'menuLogo hide' : 'menuLogo'}>
        <Link to="/">
          <img src={ImgLogo} />
          <div>React</div>
        </Link>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={chosedKey}
        {...(collapsed ? {} : { openKeys })}
        onOpenChange={(keys) => setOpenKeys(keys)}
        onSelect={onSelect}
      >
        {treeDom}
      </Menu>
    </Sider>
  );
}

export default MenuCom;
