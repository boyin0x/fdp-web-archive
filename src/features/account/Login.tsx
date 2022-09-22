import React from "react";
import { useForm } from "react-hook-form";
import { Button, Container, Grid, Link, TextField } from "@mui/material";
import { Form } from "../../components/Form";
import { Stack } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  performLogin,
  selectLoggedUserName,
  selectLoginStatus,
  selectPasswordError,
  selectUsernameError,
} from "./accountSlice";
import { Navigate } from "react-router-dom";
import NavBar from "../../components/NavBar";


export interface LoginData {
  username: string;
  password: string;
}

interface FormFields {
  username: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit
  } = useForm<FormFields>();
  
  
  const dispatch = useAppDispatch();

  const usernameError = useAppSelector(selectUsernameError)
  const passwordError = useAppSelector(selectPasswordError)
  const loginStatus = useAppSelector(selectLoginStatus);
  const loggedUsername = useAppSelector(selectLoggedUserName);
  
  const onSubmit = async ({ username, password }: FormFields) => {
    
      dispatch(performLogin({ username: username, password: password }));
      
  };


  return (
    <Container component="main">
    <NavBar/>
      <Container sx={{ paddingTop: "120px" }} maxWidth="xs">
 
        {(<Form onSubmit={handleSubmit(onSubmit)}>
          {loggedUsername}
          <Stack direction={"column"} spacing={4} justifyContent={"center"}>
          {loggedUsername && <Navigate to="/initialize"/>}
            <TextField
              label={"Username"}
              variant="outlined"
              fullWidth
              {...register("username", { required: true })}
              disabled={loginStatus === "loading"}
              error={Boolean(usernameError)}
              helperText={usernameError}
              data-testid="username"
            />
            <TextField
              label={"Password"}
              variant="outlined"
              type="password"
              fullWidth
              {...register("password", { required: true })}
              disabled={loginStatus === "loading"}
              error={Boolean(passwordError)}
              helperText={passwordError}
              data-testid="password"
            />
            <Button
              color="primary"
              variant="contained"
              type="submit"
              size="large"
              disabled={loginStatus === "loading"}
              data-testid="submit"
              sx={{
                marginTop: "50px",
              }}
            >
              {"LOGIN"}
            </Button>
            <Grid container justifyContent={"space-evenly"}>
              <Grid item>
                <Link href="#" variant="body2" color="secondary">
                  {"Forgot password?"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" color="secondary">
                  {"Don't have an account?"}
                </Link>
              </Grid>
            </Grid>
          </Stack>
        </Form>)}
      </Container>
    </Container>
  );
};

export default Login;
