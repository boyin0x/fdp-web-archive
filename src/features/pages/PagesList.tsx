import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DeleteAction, DownloadAction, ShareAction } from "./pagesListActions";
import { useGetPageNamesQuery, useLazySearchPagesQuery } from "../../app/api";
import { useSelector } from "react-redux";
import { selectFdpFeedbackMessage, selectthereIsSomeQueryPending } from "../account/accountSlice";
import { useAppSelector } from "../../app/hooks";
import { getStorageUserData } from "../../app/utils";

export default function PagesList() {

    const [searchText, setSearchText] = useState("")
    const { isLoading, isSuccess, data } = useGetPageNamesQuery({})
    const fdpFeedbackMessage = useSelector(selectFdpFeedbackMessage)
    const [trigger, result] = useLazySearchPagesQuery()
    const thereIsSomeQueryPending = useAppSelector(selectthereIsSomeQueryPending)

    useEffect(() => {
        isSuccess && data && setLastDataAvailable(data)
    }, [data, isSuccess])

    useEffect(() => {
        const pageNames = data as string[]
        pageNames && trigger({ search: searchText.toLowerCase(), pageNames: pageNames })
    }, [searchText, data, isLoading, trigger])

    const getRows = (): string[] => {
        if (result.data && result.data.length > 0) {
            return result.data
        }
        if (searchText.length === 0 && data) {
            return data || lastDataAvailable
        }

        return []
    }

    const [lastDataAvailable, setLastDataAvailable] = useState<string[]>()

    useEffect(() => {
        loadLastDataAvailable()
    }, [])

    async function loadLastDataAvailable() {
        let localPages = await getStorageUserData("localPages")
        let loacalPagesArr = JSON.parse(localPages || "[]")
        if (loacalPagesArr as string[] && loacalPagesArr.length > 0) {
            setLastDataAvailable(loacalPagesArr)
        }
    }

    const rows = getRows()

    function handleSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
        // console.log("searchText");
        setSearchText(e.target.value)
    }

    return (
        <>
            <Stack direction="column" spacing={10} justifyContent={"space-between"}>
                <Box>
                    {(<Box>
                        <Typography variant="body2">
                            {fdpFeedbackMessage.length > 0 ? fdpFeedbackMessage : (isLoading ? "Loading pages..." : "")}
                        </Typography>
                    </Box>)}
                    {(thereIsSomeQueryPending || fdpFeedbackMessage.length > 0) && (<LinearProgress />)}
                    <TextField
                        fullWidth
                        label="Search stored pages"
                        type="search"
                        variant="filled"
                        onChange={handleSearchTextChange}
                    />
                </Box>
            </Stack>
            <SavedPagesTable rows={rows} />
            {rows.length < 3 && (<Box sx={{ height: "20px" }} />)}
        </>
    )
}






interface SavedPagesTableProps {
    rows: string[];
}

function SavedPagesTable(props: SavedPagesTableProps) {

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="pages table">
                <TableBody>
                    {props.rows.map((row) => (
                        <TableRow key={row}>
                            <TableCell component="th" scope="row">
                                <DownloadAction file={row} />
                            </TableCell>
                            <TableCell style={{ width: 10 }} align="right">
                                <ShareAction file={row} />
                            </TableCell>
                            <TableCell style={{ width: 10 }} align="right">
                                <DeleteAction file={row} />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
                <TableFooter>
                    <TableRow>
                        <></>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

