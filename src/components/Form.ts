import { styled } from "@mui/system";

export const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  maxWidth: "500px",
  marginTop: "30px",
  "& > .MuiFormControl-root": {
    margin: "20px 0",
  },
});


