import React from 'react';
import { Button } from 'antd';
import Img from '@/assets/error.gif';
import './index.less';

function Four01(props) {
  const gotoHome = () => {
    props.history.replace('/');
  };

  return (
    <div className="page-error">
      <div>
        <div className="title">401</div>
        <div className="info">你没有访问该页面的权限</div>
        <div className="info">请联系你的管理员</div>
        <Button className="backBtn" type="primary" ghost onClick={gotoHome}>
          返回首页
        </Button>
      </div>
      <img src={Img + `?${new Date().getTime()}`} />
    </div>
  );
}

export default Four01;
