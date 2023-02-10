import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, Form, Input, Checkbox, Tabs, message, Row, Col } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Navbar,
  Container
} from "reactstrap";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const AdminNavbar = (props) => {

  const [open, setOpen] = useState(false);
  const [signin, setSignin] = useState(localStorage.getItem('signin') ? true : false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [first, setFirst] = useState(true);

  if(props.modalState) {
    setTimeout(function() {
      if (first && !localStorage.getItem('signin')) {
        setFirst(false)
        setOpen(true)
      }
    }, 5000)
  }

  const showModal = () => {
    setOpen(true);
  }

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const onFinish = (value) => {
    console.log(value)
    if (value.email) {
      axios
        .post(baseURL + "/user/signin", {
          email: value.email,
          password: value.password,
          remember: value.remember ? 1 : 0
        })
        .then((res) => {
          if (res.data.success) {
            messageApi.open({
              type: 'success',
              content: 'Sign in successed.',
            });
            localStorage.setItem('signin', true);
            setSignin(true);
            setOpen(false);
          } else {
            messageApi.open({
              type: 'error',
              content: res.data.error,
            });
          }
        })
        .catch((err) => {
          messageApi.open({
            type: 'error',
            content: 'Error occured.',
          });
        });
    }
    else {
      axios
        .post(baseURL + "/user/signup", {
          email: value.registeremail,
          password: value.registerpassword,
          remember: 0
        })
        .then((res) => {
          if (res.data.success) {
            messageApi.open({
              type: 'success',
              content: 'Sign up successed.',
            });
            setOpen(false);
          } else {
            messageApi.open({
              type: 'error',
              content: res.data.error,
            });
          }
        })
        .catch((err) => {
          messageApi.open({
            type: 'error',
            content: 'Error occured.',
          });
        });
    }
  }

  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      key: '1',
      label: `SignIn`,
      children:
        (<Form
          style={{ marginTop: "30px" }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Useremail" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }} className="login-form-button">
              Sign In
            </Button>
          </Form.Item>
          <hr />
        </Form>
        ),
    },
    {
      key: '2',
      label: `SignUp`,
      children:
        (<Form
          style={{ marginTop: "30px" }}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="registeremail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Useremail" />
          </Form.Item>
          <Form.Item
            name="registerpassword"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['registerpassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('registerpassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }} className="login-form-button">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        ),
    }
  ];

  return (
    <>
      {contextHolder}
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <div style={{width:'-webkit-fill-available'}}>
          <Row className="content-input">
            <Col xs={24} sm={12} md={12} className="small-header">
              <Link
                className="h4 mb-0 text-white text-uppercase"
                to="/"
              >
                {props.brandText}
              </Link>
            </Col>
            <Col xs={24} sm={12} md={12} className="small-header-button">
              {!signin ? <Button shape="round" onClick={showModal}><UserOutlined style={{ display: `inline-flex` }} />SignIn/SignUp</Button> : <UserOutlined />}
            </Col>
          </Row>
        </div>
      </Navbar>
      <Modal
        title="Sign In"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </Modal>
    </>
  );
};

export default AdminNavbar;
