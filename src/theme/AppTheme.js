import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import "@fontsource/roboto";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/800.css';

const AppTheme = (mode = 'light') => createTheme({
    breakpoints: {
        values: {
            // xl: 1536,
            // lg: 1200,
            // md: 900,
            // sm: 600,
            // xs: 0,
            xs: 0,
            sm: 480,
            md: 768,
            lg: 1024,
            xl: 1368,
            xxl: 1980
        }
    },
    size: 10,
    spacing: 8,
    palette: {
        mode,
        background: {
            default: mode === 'dark' ? '#121212' : '#fff',
            paper: mode === 'dark' ? '#1e1e1e' : '#e5e0e0ff',
        },
        ...(mode === 'dark' && {
            text: {
                primary: '#260b0bff',
                secondary: '#cccccc'
            }
        }),
        primary: {
            main: colors.teal[900],
            dark: colors.teal[500],
            deem: colors.teal[200],
            light: colors.teal[50],
        },
        secondary: {
            main: colors.deepPurple[900],
            dark: colors.deepPurple[500],
            deem: colors.deepPurple[200],
            light: colors.deepPurple[50]
        },
        info: {
            main: colors.blueGrey[900],
            dark: colors.blueGrey[700],
            deem: colors.blueGrey[500],
            light: colors.blueGrey[50]
        },
        success: {
            main: colors.green[700],
            dark: colors.green[500],
            deem: colors.green[200],
            light: colors.green[50]
        },
        error: {
            main: colors.red[900],
            dark: colors.red[500],
            deem: colors.red[200],
            light: colors.red[50],
        },

        blue: '#131938',
        tintBlue: '#326EE6'
    },
    shape: {
        borderRadius: 5
    },
    typography: {
        fontFamily: "'Roboto',san-serif",
        fontSize: 25,
        htmlFontSize: 30,
        h1: {
            fontWeight: 300,
            fontSize: "6rem",
            lineHeight: 1.167,
            letterSpacing: "-0.01562em"
        },
        h2: {
            fontWeight: 300,
            fontSize: "3.75rem",
            lineHeight: 1.2,
            letterSpacing: "-0.00833em"
        },
        h3: {
            fontWeight: 400,
            fontSize: "3rem",
            lineHeight: 1.167,
            letterSpacing: "0em"
        },
        h4: {
            fontWeight: 400,
            fontSize: "1.650rem",
            lineHeight: 1.235,
            letterSpacing: "0.00735em"
        },
        h5: {
            fontWeight: 400,
            fontSize: "1.2rem",
            lineHeight: 1.334,
            letterSpacing: "0em"
        },
        h6: {
            fontWeight: 700,
            fontSize: "1.10rem",
            lineHeight: 1.6,
            letterSpacing: "0.0075em"
        },
        body1: {
            fontFamily: "Roboto",
            fontWeight: 500,
            fontSize: "0.685rem",
            lineHeight: 1.5,
            letterSpacing: "0.01038em"
        },
        body2: {
            fontFamily: "Roboto",
            fontWeight: 400,
            fontSize: "0.725rem",
            lineHeight: 1.43,
            letterSpacing: "0.01071em"
        },
        subtitle1: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.75,
            letterSpacing: "0.00938em"
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: "0.875rem",
            lineHeight: 1.57,
            letterSpacing: "0.00714em"
        },
        button: {
            fontWeight: 400,
            fontSize: "0.575rem",
            lineHeight: 2.15,
            letterSpacing: "0.02857em",
            textTransform: "uppercase",
        },
        caption: {
            fontWeight: 400,
            fontSize: "0.75rem",
            lineHeight: 1.66,
            letterSpacing: "0.03333em"

        },
        overline: {
            fontWeight: 400,
            fontSize: "0.75rem",
            lineHeight: 1.66,
            letterSpacing: "0.08333em",
            textTransform: "uppercase"
        }
    },
    mixins: {
        toolbar: {
            minHeight: 56
        }
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    outline: 'none',
                    boxShadow: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                    '&:focus-visible': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    border: '1px solid #ccc',
                    background: ' rgb(254, 254, 254)',
                    backdropFilter: 'blur(5px)'
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '4px 12px',
                    height: 10,
                    fontSize: '10px',
                    lineHeight: '10px',
                    borderBottom: '1px solid #FEFEFE',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(even)': {
                        fontSize: '10px',
                        backgroundColor: '#eee'
                    },
                    '&:last-child td, &:last-child th': {
                        fontSize: '10px',
                        border: 0,
                    },
                    borderBottom: '1px solid #FEFEFE',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    height: 30,
                },
            },
        },
        MuiTableFooter: {
            styleOverrides: {
                root: {
                    height: 10,
                    padding: 0
                },
            },
        },

        MuiTabs: {
        styleOverrides: {
            root: {
            minHeight: 28,
            height: 30,
            padding: 0,
            fontSize: '10px',
            },
            indicator: {
            height: 2, 
            }
        }
        },
        MuiTab: {
        styleOverrides: {
            root: {
            minHeight: 25,
            height: 25,
            padding: '0 8px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'none',
            border: 'none',
            outline: 'none',
            '&:focus': {
                outline: 'none',
            },
            '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
            }
            }
        }
        },

        MuiTablePagination: {
            styleOverrides: {
                root: {
                    '& .MuiIconButton-root': {
                        size: 'small',
                        fontSize: '.51rem',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        // border: 0,
                        background: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        // border: 0,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        // border: 0,
                    },
                },
                input: {
                    padding: '8px 12px',
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    padding: '3px',
                    '& svg': {
                        fontSize: '15px',
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    background: 'none',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    my: 1,
                    height: 27,
                    background: 'none',
                    '& svg': {
                        fontSize: '13px',
                    },
                },
            },
        },
    },
});



export default AppTheme