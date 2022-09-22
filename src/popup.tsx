import React, { useEffect, ReactNode } from "react";
import { createFileName, createZip, refreshSearchableContentCache } from "./app/utils";
import { Container, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material';
import Pages from "./features/pages/Pages";
import { Page } from "./app/types";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Login from "./features/account/Login";
import AccountSetup from "./features/account/AccountSetup";
import Home from "./features/home/Home";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectthereIsSomeQueryError, updateFdpFeedbackMessage } from "./features/account/accountSlice";
import { useStoreFileMutation } from "./app/api";

const container = document.getElementById("root")!;
const root = createRoot(container);

const theme = createTheme({
  palette: {
    primary: {
      main: '#00FFAB',
      contrastText: "#0000088",
    },
    secondary: {
      main: '#808080',
    }
  }
});

interface PopupProps {
  children?: ReactNode
}

const Popup = ({ children }: PopupProps) => {

  const dispatch = useAppDispatch()
  const [upload, { isSuccess, isError, isLoading, status }] = useStoreFileMutation()
  const anyError = useAppSelector(selectthereIsSomeQueryError)
  
  useEffect(() => {
    initializeListeners()
  }, []);

  useEffect(() => {
    dispatch(updateFdpFeedbackMessage(""))
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      dispatch(updateFdpFeedbackMessage(""))
      console.log(`Error uploading this page`)
    }
  }, [isError])

  useEffect(() => {
    if (anyError)
      console.log("Error");
  }, [anyError])


  function initializeListeners() {
    console.log("initializeListeners")
    chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
      if (msg.status) {
        dispatch(updateFdpFeedbackMessage(msg.status))
      }

      if (msg.pdf) {
        try {
          storeNewPage(msg)
          return true
        } catch (e) {
          dispatch(updateFdpFeedbackMessage(""))
        }
      }
    })
  }

  async function storeNewPage(page: Page) {
    if (isLoading) {
      throw new Error("uploading")
    } else {
      storePage(page)
    }
  }

  async function storePage(page: Page) {
    let fileName = createFileName(page.title, page.url, page.text)
    page.fileName = fileName + ".zip"

    dispatch(updateFdpFeedbackMessage("Creating metadata..."))
    refreshSearchableContentCache(page)
    const json = JSON.stringify(page)

    dispatch(updateFdpFeedbackMessage("Creating zip..."))
    let zipContent = await createZip(fileName, json, page.pdf)

    dispatch(updateFdpFeedbackMessage("Uploading..."))

    upload({ content: zipContent, fileName: page.fileName })

  }

  return (
    <>
      <CssBaseline />
      <Container style={{
        minWidth: "400px",
        padding: "5px"
      }}>
        <Container>{children}</Container>
      </Container>
    </>
  );
};

const router = createMemoryRouter([
  { path: "/", element: <Home /> },
  { path: "browse", element: <Pages /> },
  { path: "login", element: <Login /> },
  { path: "initialize", element: <AccountSetup /> },
]);

root.render(
  // <React.StrictMode>

  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Popup>
        <RouterProvider router={router} />
      </Popup>
    </Provider>
  </ThemeProvider>

  // </React.StrictMode >
);

