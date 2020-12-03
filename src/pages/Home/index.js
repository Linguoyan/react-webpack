/**
 * 首页
 */

import React from 'react';
import { connect } from 'react-redux';
import './index.less';

function Home(props) {
  return <div>this is home page</div>;
}

const mapState = (state) => ({});
const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(Home);
