import React from "react";
import { Button } from "@mui/material"
import { useImportSharedFileMutation } from "../../app/api";

export default function ImportSharedFile() {

    const [importSharedFile, { isLoading }] = useImportSharedFileMutation()

    async function handleImport() {
        const reference = window.prompt("Write the shared page reference")
        if (reference && reference.length > 1) {
            importSharedFile({ reference: reference })
        }
    }

    return (
        <>

            <Button
                color="secondary"
                variant="text"
                // size="small"
                disabled={isLoading} onClick={handleImport}>{"Import shared page"}</Button>

        </>)
}


