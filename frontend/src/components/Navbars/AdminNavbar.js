import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button, Modal } from "antd";
import { UserOutlined } from '@ant-design/icons';
import {
  Navbar,
  Container
} from "reactstrap";
import {
  LoginSocialGoogle,
  LoginSocialFacebook
} from 'reactjs-social-login';
import {
  FacebookLoginButton,
  GoogleLoginButton
} from 'react-social-login-buttons';

const AdminNavbar = (props) => {

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [provider, setProvider] = useState('')
  const [profile, setProfile] = useState(null)

  const onLoginStart = useCallback(() => {
    alert('login start')
  }, [])

  const onLogoutSuccess = useCallback(() => {
    setProfile(null)
    setProvider('')
    alert('logout success')
  }, [])

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

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Button shape="round" size={"large"} onClick={showModal}><UserOutlined style={{display: `inline-flex`}} />SignIn/SignUp</Button>
        </Container>
      </Navbar>
      <Modal
        title="Sign In"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <LoginSocialFacebook
          isOnlyGetToken
          appId={process.env.REACT_APP_FB_APP_ID || ''}
          onLoginStart={onLoginStart}
          onResolve={({ provider, data }) => {
            setProvider(provider)
            setProfile(data)
          }}
          onReject={(err) => {
            console.log(err)
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>

        <LoginSocialGoogle
          isOnlyGetToken
          client_id={process.env.REACT_APP_GG_APP_ID || ''}
          onLoginStart={onLoginStart}
          onResolve={({ provider, data }) => {
            setProvider(provider)
            setProfile(data)
          }}
          onReject={(err) => {
            console.log(err)
          }}
        >
          <GoogleLoginButton />
        </LoginSocialGoogle>
      </Modal>
    </>
  );
};

export default AdminNavbar;
