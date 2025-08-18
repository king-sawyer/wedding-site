import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ToastContainer, Bounce } from "react-toastify";

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//   },
// });

const weddingTheme = createTheme({
  palette: {
    primary: {
      main: "#8A9A5B",
      dark: "#4A5D23",
      contrastText: "white",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <ThemeProvider theme={darkTheme}> */}
      <ThemeProvider theme={weddingTheme}>
        <App />
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="dark"
          transition={Bounce}
        />{" "}
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
