import React from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import TwoFAForm from "../../components/Forms/TwoFAForm";
import Modal from "../../components/Modal";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/Login/LoginTabs";
import { Helmet } from "react-helmet";
import translations from "../../i18n/translations";
import { IntlProvider } from "react-intl";
import LoginHeader from "../../components/Login/LoginHeader";
import LoginForm from "../../components/Forms/LoginForm";

const LoginPage = () => {
  const show2FA = false;

  return (
    <IntlProvider locale="en" messages={translations.en}>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box className="loginPage">
        <Modal onClose={() => {}} persist={true} size="small" state={show2FA}>
          <TwoFAForm />
        </Modal>
        <LoginHeader>
          <LoginTabs>
            <LoginForm />
          </LoginTabs>
        </LoginHeader>
        <Testimonials />
      </Box>
    </IntlProvider>
  );
};

export default LoginPage;
