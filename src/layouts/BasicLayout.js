import React, { useCallback, useState } from 'react';
import { Layout } from 'antd';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { CacheSwitch } from 'react-router-cache-route';
import loadable from '@loadable/component';

const { Content } = Layout;

/**
 * 自定义的东西
 */
import './BasicLayout.less';
import menus from '@/config/router.config.js';

/**
 * 组件
 */
import Header from '@/components/Header';
import MenuCom from '@/components/Menu';
// import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import ErrorBoundary from '@/components/ErrorBoundary';
import Bread from '@/components/Bread';
// import BreadTab from '@/components/BreadTab'; // Tab方式的导航

/**
 * 异步加载各个路由模块
 */
const [NotFound, NoPower, Home, UserAdmin, RoleAdmin] = [
  () => import(`../pages/ErrorPages/404`),
  () => import(`../pages/ErrorPages/401`),
  () => import(`../pages/Home`),
  () => import(`../pages/UserAdmin`),
  () => import(`../pages/RoleAdmin`),
].map((item) => {
  return loadable(item, {
    fallback: <Loading />,
  });
});

function BasicLayoutCom(props) {
  const [collapsed, setCollapsed] = useState(false); // 菜单栏是否收起
  // 切换路由时触发，判断是否有权限
  const onEnter = useCallback((Component, props) => {
    return <Component {...props} />;
  }, []);

  return (
    <Layout className="page-basic">
      <MenuCom
        data={menus}
        collapsed={collapsed}
        location={props.location}
        history={props.history}
      />
      <Layout>
        <Header
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        {/* 普通面包屑导航 */}
        <Bread menus={menus} location={props.location} />
        {/* Tab方式的导航 */}
        {/* <BreadTab
          menus={menus}
          location={props.location}
          history={props.history}
        /> */}
        <Content className="content">
          <ErrorBoundary location={props.location}>
            <CacheSwitch>
              <Redirect exact from="/" to="/home" />
              <Route
                exact
                path="/home"
                render={(props) => onEnter(Home, props)}
              />
              <Route
                exact
                path="/system/useradmin"
                render={(props) => onEnter(UserAdmin, props)}
              />
              <Route
                exact
                path="/system/roleadmin"
                render={(props) => onEnter(RoleAdmin, props)}
              />
              {/*<!-- 使用CacheRoute可以缓存该页面，类似Keep-alive -->*/}
              <Route exact path="/nopower" component={NoPower} />
              <Route component={NotFound} />
            </CacheSwitch>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  );
}

const mapState = (state) => ({});
const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(BasicLayoutCom);
