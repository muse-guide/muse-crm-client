import {Outlet} from "react-router-dom";
import {Box, CssBaseline} from "@mui/material";
import React from "react";
import Navigation from "../components/navigation";
import {withAuthenticator} from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

const Root = () => {
    const drawerWidth = 320;

    return (
        <Box display='flex' overflow={"clip"}>
            <CssBaseline/>
            <Navigation drawerWidth={drawerWidth}/>
            <Box component="main"
                 display='flex'
                 flexGrow={1}
                 minWidth="600px"
                 sx={{
                     marginLeft: {
                         md: `${drawerWidth}px`
                     },
                     marginTop: {
                         xs: 10,
                         md: 3
                     },
                     paddingLeft: {
                         xs: 3,
                         md: 4,
                     },
                     paddingRight: {
                         xs: 3,
                         md: 12,
                     },
                     backgroundColor: "white"
                 }}
            >
                <Outlet/>
            </Box>
        </Box>
    );
};

export default withAuthenticator(Root);
