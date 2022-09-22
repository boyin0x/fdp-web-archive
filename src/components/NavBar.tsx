import { AppBar, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"
import { NavLink } from "react-router-dom"
import { useAppSelector } from "../app/hooks"
import { selectLoggedUserName } from "../features/account/accountSlice"
import Account from "../features/account/Account"
import CheckLogin from "../features/account/CheckLogin"

export default function NavBar() {

    const loggedUserName = useAppSelector(selectLoggedUserName);

    return (
        <>
            <CheckLogin />
            <AppBar position="absolute" sx={{ backgroundColor: "white" }}>
                <Toolbar sx={
                    { display: "flex", justifyContent: "space-between" }}>
                    <Box display="flex" alignItems={"center"} gap={0.5}>
                        <NavLink to="/">
                            <Box marginY={0.5}
                                component="img"
                                sx={{ height: 40, width: 40, }}
                                alt="App Logo"
                                src="./Icon-128.png"
                            />
                        </NavLink>
                        <Typography m={0.5} sx={{ fontFamily: 'Roboto Mono' }} variant="h6" >FDP-Web-Archive</Typography>
                    </Box>
                    {loggedUserName && (<Account />)}
                </Toolbar>
            </AppBar>
        </>
    )
}