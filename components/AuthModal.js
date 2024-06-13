import Modal from 'react-bootstrap/Modal';
import { useModal } from '../context/modal';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { PAGES } from '../utils/constants';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';

const AuthModal = ({ show, setShow }) => {
  const { isModalOpen, toggleModal } = useModal();
  const { loginApi, signUpApi } = useApiCall();

  const [activeTab, setActivetab] = useState('login');
  const [buttonConfig, setButtonConfig] = useState({
    login: {
      isLoading: false,
    },
    signup: {
      isLoading: false,
    },
  });

  const router = useRouter();

  const diviverOptionalForm = () => {
    return (
      <div class="row mt-3 mb-3">
        <div class="col-5">
          <hr />
        </div>
        <div class="col-2 text-center">
          <span class="px-3 bg-white text-muted">or</span>
        </div>
        <div class="col-5">
          <hr />
        </div>
      </div>
    );
  };

  const googleLoginButton = () => {
    return (
      <button type="button" class="btn btn-outline-primary">
        Continue with Google
      </button>
    );
  };

  const handleSelect = (key) => {
    setActivetab(key);
  };

  const onSubmitLogin = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      login: {
        ...buttonConfig.login,
        isLoading: true,
      },
    });

    const data = await loginApi({
      email: document.getElementById('input-login-email').value,
      password: document.getElementById('input-login-password').value,
    });

    if (data?.id) {
      toggleModal('auth');
      router.push(PAGES.profile.directory);
    } else {
      setTimeout(() => {
        toast(
          (t) => (
            <span>
              If you joined us before Jun 1, 2024,{' '}
              <b>please reset your password</b> to maintain access after our
              recent security upgrade.{' '}
              <div class="mt-2 text-end">
                <GlobalButton
                  btnType="button"
                  btnClass="btn btn-primary btn-sm flex-grow-1"
                  btnTitle="Reset Password"
                  btnOnClick={() => {
                    toggleModal('forgotPassword');
                    toast.dismiss(t.id);
                  }}
                />
              </div>
            </span>
          ),
          {
            duration: 15000,
          }
        );
      }, 2000);
    }

    setButtonConfig({
      ...buttonConfig,
      login: {
        ...buttonConfig.login,
        isLoading: false,
      },
    });
  };

  const onSubmitSignup = async (event) => {
    event.preventDefault();

    setButtonConfig({
      ...buttonConfig,
      signup: {
        ...buttonConfig.signup,
        isLoading: true,
      },
    });

    const password = document.getElementById('input-signup-password').value;
    const repeatPassword = document.getElementById(
      'input-signup-repeat-password'
    ).value;

    if (password == repeatPassword) {
      const result = await signUpApi({
        username: document.getElementById('input-signup-username').value,
        email: document.getElementById('input-signup-email').value,
        password: document.getElementById('input-signup-password').value,
      });

      if (result?.user) {
        document.getElementById('input-signup-username').value = '';
        document.getElementById('input-signup-email').value = '';
        document.getElementById('input-signup-password').value = '';
        document.getElementById('input-signup-repeat-password').value = '';

        // setTimeout(() => {
        //   toast.success('Switching to login tab...');
        //   setTimeout(() => {
        //     handleSelect('login');
        //   }, 2500);
        // }, 3500);
      }
    } else {
      toast.error('Password and repeat password does not match!');
    }

    setButtonConfig({
      ...buttonConfig,
      signup: {
        ...buttonConfig.signup,
        isLoading: false,
      },
    });
  };

  return (
    <>
      <Modal
        show={isModalOpen.auth}
        onHide={() => {
          toggleModal('auth');
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <a class="navbar-brand" href="/">
              <Image
                src="/images/gikijo-logo.png"
                alt="image"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 100, height: 'auto' }}
                class="d-inline-block align-text-top"
              />
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            defaultActiveKey="login"
            activeKey={activeTab}
            transition={false}
            className="mb-3"
            onSelect={(key) => handleSelect(key)}
          >
            <Tab eventKey="login" title="Login">
              <form onSubmit={onSubmitLogin}>
                <div class="mb-3">
                  <label htmlFor="input-login-email" class="form-label">
                    Username
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="input-login-email"
                    required
                  />
                </div>
                <div class="mb-5">
                  <label htmlFor="input-login-password" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    class="form-control mb-1"
                    id="input-login-password"
                    required
                  />
                  <div class="d-flex justify-content-end">
                    <span
                      class="small text-primary clickable"
                      onClick={() => {
                        toggleModal('forgotPassword');
                      }}
                    >
                      Forgot Password?
                    </span>
                  </div>
                </div>
                <div class="d-grid gap-2">
                  <GlobalButton
                    btnType="submit"
                    btnClass="btn btn-primary"
                    btnTitle="Login"
                    btnLoading={buttonConfig.login.isLoading}
                  />
                </div>
                {diviverOptionalForm()}
                <div class="d-grid gap-2 mb-3">{googleLoginButton()}</div>
              </form>
              <p class="text-center mt-4">
                <span>Don't have an account? </span>
                <strong
                  class="text-primary clickable"
                  onClick={() => handleSelect('signup')}
                >
                  {PAGES.signup.name}
                </strong>
              </p>
            </Tab>
            <Tab eventKey="signup" title={PAGES.signup.name}>
              <form onSubmit={onSubmitSignup}>
                <div class="mb-3">
                  <label htmlFor="input-signup-username" class="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="input-signup-username"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="input-signup-email" class="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="input-signup-email"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="input-signup-password" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="input-signup-password"
                    required
                  />
                </div>
                <div class="mb-5">
                  <label
                    htmlFor="input-signup-repeat-password"
                    class="form-label"
                  >
                    Repeat Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    id="input-signup-repeat-password"
                    required
                  />
                </div>
                <div class="d-grid gap-2">
                  <GlobalButton
                    btnType="submit"
                    btnClass="btn btn-primary"
                    btnTitle={PAGES.signup.name}
                    btnLoading={buttonConfig.signup.isLoading}
                  />
                </div>
                {diviverOptionalForm()}
                <div class="d-grid gap-2 mb-3">{googleLoginButton()}</div>
                <p class="text-center text-muted">
                  <small>
                    By clicking on the "{PAGES.signup.name}" or "Continue with
                    Google" button, you are acknowledging and accepting our{' '}
                    <Link href="terms">Terms and Conditions.</Link>
                  </small>
                </p>
              </form>
              <p class="text-center mt-4">
                <span>Already have an account? </span>
                <strong
                  class="text-primary clickable"
                  onClick={() => handleSelect('login')}
                >
                  Login
                </strong>
              </p>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthModal;
