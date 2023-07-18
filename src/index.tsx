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
import awsExports from './aws-exports';

const config = {
    ...awsExports, API: {
        endpoints: [
            {
                name: "muse-app-api",
                endpoint: "https://d1awsuikml4m5v.cloudfront.net"
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