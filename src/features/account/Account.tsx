import React from "react";

import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Stack } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectLoggedUserName } from "./accountSlice";


const Account = () => {
  const dispatch = useAppDispatch();
  const loggedUserName = useAppSelector(selectLoggedUserName);

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <Box>
      <Stack direction="row" spacing={4}>
        {loggedUserName && (
          <Box>
            <Button
              color="secondary"
              variant="text"
              onClick={handleLogout}
              size="small"
              autoCapitalize="no"
              endIcon={<LogoutIcon />}
            >
              {loggedUserName}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default Account;
