import React, { useEffect } from "react";
import { Box, CircularProgress, IconButton, Link, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import { useState } from "react";
import AdmZip from "adm-zip"
import { getPageTitle } from "../../app/utils";
import { useDeleteFileMutation, useShareFileMutation, fdpDownloadFile } from "../../app/api";

export function ShareAction(props: { file: string }) {

    const [shareFile, { isLoading, isSuccess, data }] = useShareFileMutation()
    function handleShare() {
        shareFile({ fileName: props.file })
    }

    useEffect(() => {
        if (isSuccess && data) {
            alert("Use this reference to import the page in another account.\n\n" + data);
        }
    }, [isSuccess, data])

    return (
        <>
            {!isLoading && (
                <IconButton aria-label="share" color="primary" disabled={isLoading} onClick={handleShare}>
                    <ShareIcon />
                </IconButton>
            )}
            {isLoading && (<CircularProgress size={15} disableShrink />)}
        </>
    )
}




export function DownloadAction(props: { file: string }) {

    const [status, setStatus] = useState("")

    async function handleDownload() {

        setStatus("Downloading...");
        let f = await fdpDownloadFile(props.file)
        setStatus("");

        var zip = new AdmZip(Buffer.from(f.buffer))
        // console.log("zip:",zip.getEntries().map(e => e.entryName))
        let pdfEntries = zip.getEntries().filter(e => e.entryName.toLowerCase().endsWith('.pdf'))
        let pdfEntry = pdfEntries.shift()
        if (pdfEntry) {
            startFileDownload(getPageTitle(props.file), pdfEntry.getData())
        } else {
            throw new Error("zip entry does not exist")
        }
    }

    function startFileDownload(fname: string, fdata: any) {
        const url = window.URL.createObjectURL(new Blob([fdata], { type: 'application/pdf' }))
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
            "download",
            fname
        );
        document.body.appendChild(link);
        link.click();

    }



    return (<Box>
        {status.length === 0
            ? (<Link component="button"
                textAlign="left"
                color="secondary"
                // underline="hover"
                variant="body2" onClick={handleDownload}>{getPageTitle(props.file)}</Link>)
            : (<Typography textAlign="left" color="secondary" variant="body2">{`${status} ` + getPageTitle(props.file)}</Typography>)
        }
    </Box>)
}


export function DeleteAction(props: { file: string }) {

    const [deleteFile, { isLoading }] = useDeleteFileMutation()

    async function performDelete() {
        deleteFile({ fileName: props.file })
    }

    function handleDelete() {
        if (window.confirm('Are you sure you wish to delete this page?\n' + getPageTitle(props.file))) {
            performDelete()
        }
    }

    return (<>
        {!isLoading && (
            <IconButton aria-label="delete" color="primary" disabled={isLoading} onClick={handleDelete}>
                <DeleteIcon />
            </IconButton>
        )}
        {isLoading && (<CircularProgress size={15} disableShrink />)}

    </>)
}
