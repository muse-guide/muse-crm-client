import {AppBar, Avatar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, Stack, SvgIcon, Toolbar, Typography, useTheme} from "@mui/material";
import {Link, LinkProps, useLocation, useResolvedPath} from "react-router-dom";
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {normalizeText} from "./ComponentUtils";
import {useTranslation} from "react-i18next";
import MenuIcon from '@mui/icons-material/Menu';
import {useEffect, useState} from "react";
import {useAuthenticator} from "@aws-amplify/ui-react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {grey} from "@mui/material/colors";
import {useApplicationContext, useTokenCount} from "./hooks";
import {MuseeRegularLogo} from "./identity/Logo";

export default function Navigation({drawerWidth}: { drawerWidth: number }) {
    const theme = useTheme()
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    display: {md: 'none'},
                    backgroundColor: theme.palette.background.paper
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{mr: 1, display: {md: 'none'}}}
                    >
                        <MenuIcon color="primary"/>
                    </IconButton>
                    <MuseeRegularLogo/>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: {xs: 'block', md: 'none'},
                    '& .MuiDrawer-paper': {
                        backgroundColor: theme.palette.background.paper,
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        paddingX: 2,
                        borderRight: 0,
                        // borderColor: borderColor,
                    },
                }}
            >
                <AppDrawer/>
            </Drawer>
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    display: {xs: 'none', md: 'flex'},
                    '& .MuiDrawer-paper': {
                        overflow: 'hidden',
                        backgroundColor: theme.palette.background.paper,
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        paddingX: 2,
                        border: "0",
                        borderRight: 0,
                        // borderColor: borderColor,
                    },
                }}
                open
            >
                <AppDrawer/>
            </Drawer>
        </>
    )
}

export function AppDrawer() {
    const {t} = useTranslation();

    return (
        <>
            <List sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
            }}>
                <MuseLogo/>
                <CustomListItemButton
                    to="institution"
                    title={t("menu.institution")}
                    Icon={AccountBalanceOutlinedIcon}
                />
                <CustomListItemButton
                    to="exhibitions"
                    title={t("menu.exhibitions")}
                    Icon={CollectionsOutlinedIcon}
                />
                <CustomListItemButton
                    to="exhibits"
                    title={t("menu.exhibits")}
                    Icon={ColorLensOutlinedIcon}
                />
            </List>
            <List sx={{overflow: "hidden"}}>
                <TokenCount/>
                <CustomListItemButton
                    to="account"
                    title={t("menu.account")}
                    Icon={AccountCircleOutlinedIcon}
                />
                <SingOutButton/>
                <ProfileAvatar/>
            </List>
        </>
    );
}

const SingOutButton = () => {
    const {t} = useTranslation();
    const {signOut} = useAuthenticator((context) => [context.user]);
    return (
        <ListItem disablePadding>
            <ListItemButton
                onClick={signOut}
                sx={{
                    justifyContent: 'initial',
                    px: 3,
                    '&:hover': {
                        backgroundColor: grey[50],
                        borderRadius: 1
                    },
                    borderRadius: 1
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                        color: 'black'
                    }}
                >
                    <LogoutOutlinedIcon/>
                </ListItemIcon>
                <Typography
                    variant={"body1"}
                    noWrap
                    sx={{
                        color: grey[900],
                        fontWeight: 'normal'
                    }}
                >
                    {t("menu.signOut")}
                </Typography>
            </ListItemButton>
        </ListItem>
    )
}

const TokenCount = () => {
    const {counter} = useTokenCount()
    return (
        <ListItem
            disablePadding
            sx={{
                justifyContent: 'initial',
                px: 3,
                py: 1,
                borderRadius: 1
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
                    color: grey[900]
                }}
            >
                <AutoAwesomeIcon/>
            </ListItemIcon>
            <Typography
                variant={"body1"}
                noWrap
                sx={{
                    color: grey[900],
                    fontWeight: 'normal'
                }}
            >
                {counter}
            </Typography>
        </ListItem>
    );
}

const CustomListItemButton = ({to, title, Icon, ...props}: LinkProps & { title: string; Icon: typeof SvgIcon }) => {
    const [match, setMatch] = useState(false);

    let resolved = useResolvedPath(to);
    let location = useLocation();

    useEffect(() => {
        if (location.pathname.includes(resolved.pathname)) setMatch(true)
        else setMatch(false)
    }, [location, resolved.pathname]);

    return (
        <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to={to}
                {...props}
                sx={{
                    justifyContent: 'initial',
                    px: 3,
                    backgroundColor: match ? grey[50] : 'transparent',
                    '&:hover': {
                        backgroundColor: grey[50],
                        borderRadius: 1
                    },
                    borderRadius: 1
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: 'center',
                        color: grey[900]
                    }}
                >
                    <Icon/>
                </ListItemIcon>
                <Typography
                    variant={"body1"}
                    noWrap
                    sx={{
                        color: grey[900],
                        fontWeight: match ? '600' : 'normal'
                    }}
                >
                    {title}
                </Typography>
            </ListItemButton>
        </ListItem>
    );
};

const MuseLogo = () => {
    const theme = useTheme();
    return (
        <ListItem
            sx={{
                justifyContent: 'initial',
                paddingTop: 1,
                paddingBottom: 4,
                display: 'flex',
                alignItems: 'center',
                pl: 3,
                zIndex: 100
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: 1.5,
                    justifyContent: 'center',
                    fontSize: 38
                }}
            >
                <MuseeRegularLogo/>
            </ListItemIcon>
            <Typography
                variant={"h6"}
                noWrap
                sx={{
                    color: grey[900],
                    fontWeight: '600'
                }}
            >
                musee.cloud
            </Typography>
        </ListItem>
    )
}

const ProfileAvatar = () => {
    const {customer} = useApplicationContext();
    return (
        <Stack direction='row'
               spacing={2}
               sx={{
                   justifyContent: 'initial',
                   alignItems: 'center',
                   overflow: 'hidden',
                   px: 2,
                   paddingTop: 2,
                   paddingBottom: 3
               }}>
            <Avatar sx={{bgcolor: "white"}}>
                <Box display={"flex"} sx={{color: "black", fontSize: 42}} alignItems={"center"}>

                    <AccountCircleIcon fontSize={"inherit"} color={"inherit"}/>
                </Box>
            </Avatar>
            <Stack>
                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        color: grey[700],
                        fontWeight: '600'
                    }}
                >
                    {normalizeText(24, customer.email)}
                </Typography>
            </Stack>
        </Stack>
    )
}