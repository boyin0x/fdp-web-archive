import { CircularProgress, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectInitializeStatus } from "./accountSlice";
import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

export default function AccountSetup() {
  const initializeStatus = useAppSelector(selectInitializeStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (initializeStatus === "done") {
      navigate("/browse");
    }
  }, [initializeStatus, navigate]);

  return (
    <Container component="main">
      <NavBar />
      <Container sx={{ paddingTop: "120px" }} maxWidth="xs">
        <Box display="flex" flexDirection="column" gap={2}>
          <Box m="auto">
            <Typography variant="body2">Setting up your storage ...</Typography>
          </Box>
          <Box m="auto">
            <CircularProgress />
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
