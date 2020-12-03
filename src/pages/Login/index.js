/** 登录页 **/

// ==================
// 所需的各种插件
// ==================
import React, { useState } from 'react';
import { connect } from 'react-redux';
import tools from '@/utils/tools';
import './index.less';

// ==================
// 所需的所有组件
// ==================
import Vcode from 'react-vcode';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import CanvasBack from '@/components/CanvasBack';
import LogoImg from '@/assets/logo.png';

// ==================
// 本组件
// ==================
function LoginContainer(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // 是否正在登录中
  const [rememberPassword, setRememberPassword] = useState(false); // 是否记住密码
  const [codeValue, setCodeValue] = useState('00000'); // 当前验证码的值

  // 验证码改变时触发
  const onVcodeChange = (code) => {
    form.setFieldsValue({
      vcode: code, // 开发模式自动赋值验证码，正式环境，这里应该赋值''
    });
    setCodeValue(code);
  };

  // 记住密码按钮点击
  const onRemember = (e) => {
    setRememberPassword(e.target.checked);
  };

  // 用户提交登录
  const onSubmit = async () => {
    const values = await form.validateFields();
    message.success('登录成功');
    props.history.replace('/'); // 跳转到主页
  };

  return (
    <div className="page-login">
      <div className="canvasBox">
        <CanvasBack row={12} col={8} />
      </div>
      <div className="loginBox show">
        <Form form={form}>
          <div className="title">
            <img src={LogoImg} alt="logo" />
            <span>Authority Admin</span>
          </div>
          <div>
            <Form.Item
              name="username"
              rules={[
                { max: 12, message: '最大长度为12位字符' },
                {
                  required: true,
                  whitespace: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ fontSize: 13 }} />}
                size="large"
                id="username" // 为了获取焦点
                placeholder="admin/user"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { max: 18, message: '最大长度18个字符' },
              ]}
            >
              <Input
                prefix={<KeyOutlined style={{ fontSize: 13 }} />}
                size="large"
                type="password"
                placeholder="123456/123456"
                onPressEnter={onSubmit}
              />
            </Form.Item>
            <Form.Item>
              <Form.Item
                name="vcode"
                noStyle
                rules={[
                  () => ({
                    validator: (rule, value) => {
                      const v = tools.trim(value);
                      if (v) {
                        if (v.length > 4) {
                          return Promise.reject('验证码为4位字符');
                        } else if (
                          v.toLowerCase() !== codeValue.toLowerCase()
                        ) {
                          return Promise.reject('验证码错误');
                        } else {
                          return Promise.resolve();
                        }
                      } else {
                        return Promise.reject('请输入验证码');
                      }
                    },
                  }),
                ]}
              >
                <Input
                  style={{ width: '200px' }}
                  size="large"
                  id="vcode" // 为了获取焦点
                  placeholder="请输入验证码"
                />
              </Form.Item>
              <Vcode
                height={40}
                width={150}
                onChange={onVcodeChange}
                className="vcode"
                style={{ color: '#f00' }}
                options={{
                  lines: 16,
                }}
              />
            </Form.Item>
            <div style={{ lineHeight: '40px' }}>
              <Checkbox
                className="remember"
                checked={rememberPassword}
                onChange={onRemember}
              >
                记住密码
              </Checkbox>
              <Button
                className="submit-btn"
                size="large"
                type="primary"
                loading={loading}
                onClick={onSubmit}
              >
                {loading ? '请稍后' : '登录'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapState = (state) => ({});
const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(LoginContainer);
