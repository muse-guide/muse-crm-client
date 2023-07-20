import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from "./routes/Root";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import ExhibitPage from "./routes/ExhibitPage";
import {createTheme, ThemeProvider} from "@mui/material";
import "./translation";
import ExhibitionPage from "./routes/exhibition/ExhibitionPage";
import {SnackbarProvider} from "notistack";
import {grey} from "@mui/material/colors";
import {Amplify} from 'aws-amplify';

const config = {
    Auth: {
        // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab', // (required) - Amazon Cognito Identity Pool ID
        region: 'eu-central-1', // (required) - Amazon Cognito Region
        userPoolId: 'eu-central-1_uXaNOCiBT', // (optional) - Amazon Cognito User Pool ID
        userPoolWebClientId: 'smt7ofnsbnle7ibbspl6fsfqr' // (optional) - Amazon Cognito Web Client ID (App client secret needs to be disabled)
    },
    API: {
        endpoints: [
            {
                name: "muse-app-api",
                endpoint: "https://d38c0hskj64sdw.cloudfront.net"
            }
        ]
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
            default: grey[50]
        }
    },
    typography: {
        fontFamily: ["Public Sans", "sans-serif"].join(",")
    }
});

root.render(
    <React.StrictMode>
        <React.Suspense fallback="">
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <RouterProvider router={router}/>
                </SnackbarProvider>
            </ThemeProvider>
        </React.Suspense>
    </React.StrictMode>
);