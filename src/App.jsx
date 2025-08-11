import React, { createContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import MainRouter from "./router/MainRouter";
import AppTheme from "./theme/AppTheme";

import "react-toastify/dist/ReactToastify.css";
import { useGetProfileQuery } from "./features/auth/authApi";
import { disconnectSockets, initSockets } from "./features/sockets/socketService";

// Context to toggle light/dark mode
export const ColorModeContext = createContext();

const App = () => {
  const [mode, setMode] = useState("light");
const { data: profileData } = useGetProfileQuery();
  const currentUserId = profileData?.data?._id;

  useEffect(() => {
  if (currentUserId) {
    initSockets(currentUserId);
  }
  return () => disconnectSockets();
}, [currentUserId]);

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
        <CssBaseline/>
        <ToastContainer position="top-right" autoClose={3000} />
        <MainRouter />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
