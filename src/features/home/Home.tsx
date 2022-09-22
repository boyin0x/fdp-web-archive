import { Button, Container, LinearProgress, Typography } from "@mui/material"
import { Box, Stack } from "@mui/system"
import React from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectFdpFeedbackMessage, updateFdpFeedbackMessage } from "../account/accountSlice"
import NavBar from "../../components/NavBar"

export default function Home() {
  const navigate = useNavigate()

  const handleStorePage = () => {
    // dispatch(updateFdpFeedbackMessage("Creating ..."))
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        if (tab.id) {
          dispatch(updateFdpFeedbackMessage("Generating PDF ..."))
          chrome.tabs.sendMessage(
            tab.id,
            {
              generate: "true",
            }
          );
        }
      });
  }
  const dispatch = useAppDispatch()
  const fdpFeedbackMessage = useAppSelector(selectFdpFeedbackMessage)

  function handleOptionsPage() {
    navigate("/browse")
  }

  return (
    <Container component="main">
      <NavBar />
      <Container sx={{ paddingTop: "120px" }} maxWidth="xs">
        <Box>
          <NavBar />
          <Stack direction="column" spacing={1} padding={1}>
            <Button fullWidth variant="contained" onClick={handleStorePage} disabled={fdpFeedbackMessage?.length > 0}>
              {fdpFeedbackMessage?.length < 0 ? fdpFeedbackMessage : "Save Page"}
            </Button>
            {fdpFeedbackMessage?.length > 0 && (
              (<Box m="auto">
                <Typography variant="body2">{fdpFeedbackMessage}</Typography>
              </Box>)
            )}
            {fdpFeedbackMessage.length > 0 && (<LinearProgress />)}
            <Button fullWidth color="secondary" onClick={handleOptionsPage}>{"Browse Saved Pages"}</Button>
          </Stack>
        </Box>
      </Container>
    </Container>
  )
}