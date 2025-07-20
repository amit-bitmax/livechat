import React, { createContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import MainRouter from "./router/MainRouter";
import AppTheme from "./theme/AppTheme";

import "react-toastify/dist/ReactToastify.css";

// Context to toggle light/dark mode
export const ColorModeContext = createContext();

const App = () => {
  const [mode, setMode] = useState("light");

  // Memoized toggle function
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  const theme = useMemo(() => AppTheme(mode), [mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <ToastContainer position="top-right" autoClose={3000} />
        <MainRouter />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
