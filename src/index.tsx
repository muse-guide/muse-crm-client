import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from "./routes/Root";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import ExhibitPage from "./routes/exhibit/ExhibitPage";
import {createTheme, outlinedInputClasses, ThemeProvider} from "@mui/material";
import "./translation";
import ExhibitionPage from "./routes/exhibition/ExhibitionPage";
import {SnackbarProvider} from "notistack";
import {grey} from "@mui/material/colors";
import {Amplify} from 'aws-amplify';
import ExhibitionsPage from "./routes/exhibition/ExhibitionsPage";
import ExhibitsPage from './routes/exhibit/ExhibitsPage';
import AccountPage from "./routes/account/AccountPage";
import { AccountSettings } from '@aws-amplify/ui-react';
import InstitutionEditPage from "./routes/institution/InstitutionEditPage";
import InstitutionPage from "./routes/institution/InstitutionPage";

const config = {
    Auth: {
        Cognito: {
            userPoolId: 'eu-central-1_YhPb8TNLP', // (optional) - Amazon Cognito User Pool ID
            userPoolClientId: '60vli1o6ticnsvj89i5e1sj9lb', // (optional) - Amazon Cognito Web Client ID (App client secret needs to be disabled)
            region: 'eu-central-1',
        }
    },
    Storage: {
        S3: {
            region: 'eu-central-1',
            bucket: 'crm-dev-asset-bucket'
        }
    }
}

Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "exhibits",
                element: <ExhibitsPage/>
            },
            {
                path: "exhibits/new",
                element: <ExhibitPage/>
            },
            {
                path: "exhibits/:exhibitId",
                element: <ExhibitPage/>
            },
            {
                path: "exhibitions",
                element: <ExhibitionsPage/>
            },
            {
                path: "exhibitions/new",
                element: <ExhibitionPage/>
            },
            {
                path: "exhibitions/:exhibitionId",
                element: <ExhibitionPage/>
            },
            {
                path: "account",
                element: <AccountPage/>
            },
            {
                path: "institution",
                element: <InstitutionPage/>
            },
            {
                path: "institution/edit",
                element: <InstitutionEditPage/>
            },
        ]
    }
]);

// export const borderColor = grey[400]
export const borderColor = "#D0D5DD"
// export const mainBackgroundColor = "#FCFCFD"
export const mainBackgroundColor = "white"

const darkTheme = createTheme({
        palette: {
            mode: "light",
            primary: {
                main: "#000000"
            },
            secondary: {
                main: "rgba(0,0,0,0.46)",
                light: "rgba(145,145,145,0.1)",
            },
            background: {
                default: "rgba(0,0,0,0)"
            },
            success: {
                main: "#32D583",
                light: "#ECFDF3"
            },
            error: {
                main: "#F97066",
                light: "#FEF3F2"
            },
            warning: {
                main: "#FDB022",
                light: "#ffc886",
            },
            info: {
                main: "#36BFFA",
                light: "#E0F2FE",
            },
            grey: {
                50: "#FCFCFD",
            }
        },
        typography: {
            fontFamily: ["Inter", "sans-serif"].join(","),
            body1: {
                color: grey[700],
                fontSize: "16px"
            },
            body2: {
                color: grey[700],
                fontSize: "14px"
            },
            subtitle1: {
                color: grey[700],
                fontSize: "12px"
            },
            subtitle2: {
                color: grey[700],
                fontSize: "10px"
            },
            h6: {
                color: grey[900],
                fontWeight: '600',
            },
            h5: {
                color: "black"
            },
            h4: {
                color: grey[900],
                fontWeight: '600',
                fontSize: '30px'

            },
            h3: {
                color: grey[900],
            },
            button: {
                textTransform: "none",
                color: grey[700],
                fontWeight: '500',
            }
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiTextField: {
                styleOverrides: {
                    root: ({theme}) => ({
                        '--TextField-brandBorderColor': borderColor,
                        '--TextField-brandBorderHoverColor': grey[600],
                        '--TextField-brandBorderFocusedColor': grey[700],
                        '& label.Mui-focused': {
                            color: 'var(--TextField-brandBorderFocusedColor)',
                        },
                        "& .MuiOutlinedInput-root": {
                            // backgroundColor: mainBackgroundColor,
                            backgroundColor: "white",
                        },
                    }),
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: 'var(--TextField-brandBorderColor)',
                    },
                    root: {
                        [`&:hover .${outlinedInputClasses.notchedOutline}`]:
                            {
                                borderColor: 'var(--TextField-brandBorderHoverColor)',
                            },
                        [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]:
                            {
                                borderColor: 'var(--TextField-brandBorderFocusedColor)',
                            },
                    },
                },
            },
            MuiTableHead: {
                styleOverrides: {
                    root: ({theme}) => ({
                        // backgroundColor: theme.palette.secondary.light,
                    }),
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: ({theme}) => ({
                        borderColor: borderColor,
                        border: `1px solid ${borderColor}`,
                        elevation: 0,
                    }),
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderColor: grey[500],
                        fontWeight: '500',
                    }
                }
            },
        }
    })
;

root.render(
    <React.StrictMode>
        <React.Suspense fallback="">
            <ThemeProvider theme={darkTheme}>
                <SnackbarProvider>
                    <RouterProvider router={router}/>
                </SnackbarProvider>
            </ThemeProvider>
        </React.Suspense>
    </React.StrictMode>
);