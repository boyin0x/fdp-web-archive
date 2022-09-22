import React from "react";
import { Button, Container, Stack } from "@mui/material";

import PagesList from "./PagesList";
import ImportSharedFile from "./ImportSharedFile";
import NavBar from "../../components/NavBar";
import { useAppDispatch } from "../../app/hooks";
import { updateFdpFeedbackMessage } from "../account/accountSlice";
const Pages = () => {

  const dispatch = useAppDispatch()



  const handleStorePage = () => {
    // dispatch(updateFdpFeedbackMessage("Creating ..."))
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        dispatch(updateFdpFeedbackMessage("Generating PDF..."))
        chrome.tabs.sendMessage(
          tab.id,
          {
            generate: "true",
          }
        );
      }
    });
  }


  return (
    <Container component="main" sx={{ minHeight: "500px" }}>
      <NavBar />
      <Stack sx={{ paddingTop: "120px" }} direction="column" spacing={2} >
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <ImportSharedFile />
            <Button variant="contained" sx={{ width: "150px" }} onClick={handleStorePage}>Save Page</Button>
          </Stack>
          <PagesList />
        </Stack>
      </Stack>
    </Container >
  );
};

export default Pages

