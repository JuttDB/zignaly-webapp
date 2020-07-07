import React, { useMemo } from "react";
import { compose } from "recompose";
import "./PrivateAreaLayout.scss";
import { ThemeProvider, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { CssBaseline, Box, Hidden } from "@material-ui/core";
import themeData from "../../services/theme";
import Header from "../../components/Navigation/Header";
import MobileHeader from "../../components/Navigation/MobileHeader";
import MobileAppbar from "../../components/Navigation/MobileAppbar";
import Sidebar from "../../components/Navigation/Sidebar";
import ErrorAlert from "../../components/Alerts/ErrorAlert";
import SuccessAlert from "../../components/Alerts/SuccessAlert";
import GlobalModal from "../../components/GlobalModal";
import ConnectExchangeView from "../../components/ConnectExchangeView";
import useStoreSettingsSelector from "../../hooks/useStoreSettingsSelector";
import withPageContext from "../../pageContext/withPageContext";
import SettingsView from "../../components/SettingsView";
import Loader from "../../components/Loader";
import useStoreUILoaderSelector from "../../hooks/useStoreUILoaderSelector";
import Modal from "../../components/Modal";
import useStoreUIModalSelector from "../../hooks/useStoreUIModalSelector";
import TwoFAForm from "../../components/Forms/TwoFAForm";

/**
 * @typedef {Object} PrivateAreaLayoutProps
 * @property {Object} children
 */

/**
 * Default component props.
 *
 * @param {PrivateAreaLayoutProps} props Default component props.
 * @returns {JSX.Element} Component.
 */
const PrivateAreaLayout = (props) => {
  const { children } = props;
  const storeSettings = useStoreSettingsSelector();
  const storeModal = useStoreUIModalSelector();
  const storeLoader = useStoreUILoaderSelector();
  const options = themeData(storeSettings.darkStyle);
  const createTheme = () => createMuiTheme(options);
  const theme = useMemo(createTheme, [storeSettings.darkStyle]);

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorAlert />
        <SuccessAlert />
        {storeLoader && <Loader />}
        <Modal state={storeModal.twoFA} persist={true} size="small" onClose={() => {}}>
          <TwoFAForm />
        </Modal>
        <GlobalModal content={ConnectExchangeView} hash="exchangeAccounts" />
        <GlobalModal content={SettingsView} hash="settings" />
        <Box bgcolor="background.default" className={"app"}>
          <Hidden xsDown>
            <Header />
          </Hidden>
          <Hidden smUp>
            <MobileHeader />
            <MobileAppbar />
          </Hidden>
          <Box className={"body"} display="flex" flexDirection="row" flexWrap="nowrap">
            <Hidden xsDown>
              <Box className={"side"}>
                <Sidebar />
              </Box>
            </Hidden>
            <Box className={"appContent"}>{children}</Box>
          </Box>
        </Box>
      </ThemeProvider>
    </StylesProvider>
  );
};

export default compose(withPageContext)(PrivateAreaLayout);
