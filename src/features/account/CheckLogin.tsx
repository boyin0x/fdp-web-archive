import React, { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { checkLogin, selectLoginStatus } from "./accountSlice";

export default function CheckLogin() {
    const dispatch = useAppDispatch()
    const loginStatus = useAppSelector(selectLoginStatus);
    const location = useLocation()
    
    useEffect(()=> {
        dispatch(checkLogin())
    }, [dispatch])
    
    if (location.pathname !== "/login" && (loginStatus === "logout" || loginStatus === "failed")) {
        return <Navigate to="/login" />;
    } else {
        return (<></>)
    }
}