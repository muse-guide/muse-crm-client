import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from "./routes/Root";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import ExhibitPage from "./routes/exhibit/ExhibitPage";
import {createTheme, ThemeProvider} from "@mui/material";
import "./translation";
import ExhibitionPage from "./routes/exhibition/ExhibitionPage";
import {SnackbarProvider} from "notistack";
import {grey} from "@mui/material/colors";
import {Amplify} from 'aws-amplify';
import ExhibitionsPage from "./routes/exhibition/ExhibitionsPage";

const config = {
    Auth: {
        Cognito: {
            identityPoolId: 'eu-central-1:b4a2d594-4d5d-4046-b38a-d6edf2dcfb05', // (required) - Amazon Cognito Identity Pool ID
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
            }
        ]
    }
]);

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#2454b0",
            light: "rgba(221,229,248,0.69)",
            dark: "#06245e"
        },
        secondary: {
            main: "#ef9800",
            light: "#ffd7b0",
            dark: "#865d03"
        },
        background: {
            default: "rgba(0,0,0,0)"
        }
    },
    typography: {
        fontFamily: ["Public Sans", "sans-serif"].join(",")
    },
    shape: {
        borderRadius: 8,
    },
});

export const bgColor = "rgba(255,255,255,0.01)"
export const borderColor = grey[400]
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
        }
    },
    typography: {
        fontFamily: ["Public Sans", "sans-serif"].join(",")
    },
    shape: {
        borderRadius: 6,
    },
});

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