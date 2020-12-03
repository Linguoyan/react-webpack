/** 根路由 **/

import React, { useCallback } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { createHashHistory as createHistory } from 'history'; // 锚点模式的history

//组件
import UserLayout from '@/layouts/UserLayout';
import BasicLayout from '@/layouts/BasicLayout';

const history = createHistory();

function RouterCom(props) {
  /** 跳转到某个路由之前触发 **/
  const onEnter = useCallback((Component, props) => {
    return <Component {...props} />;
  }, []);

  return (
    <Router history={history}>
      <Route
        render={() => {
          return (
            <Switch>
              <Route path="/user" component={UserLayout} />
              <Route path="/" render={(props) => onEnter(BasicLayout, props)} />
            </Switch>
          );
        }}
      />
    </Router>
  );
}

const mapState = (state) => ({});
const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(RouterCom);
