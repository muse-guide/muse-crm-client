import {AppBar, Avatar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, Stack, SvgIcon, Toolbar, Typography, useTheme} from "@mui/material";
import {Link, LinkProps, useLocation, useResolvedPath} from "react-router-dom";
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {normalizeText} from "./ComponentUtils";
import {useTranslation} from "react-i18next";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import {useEffect, useState} from "react";
import {grey} from "@mui/material/colors";
import {useAuthenticator} from "@aws-amplify/ui-react";

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
                    <CloudCircleIcon fontSize="large" color="primary"/>
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
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        paddingX: 2,
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
                        backgroundColor: "rgba(221,229,248,0.2)",
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        paddingX: 2,
                        border: "0 1",
                        borderColor: grey[300]
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
                    to="exhibits"
                    title={t("menu.dashboard")}
                    Icon={DashboardOutlinedIcon}
                />
                <CustomListItemButton
                    to="exhibits"
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
                <CustomListItemButton
                    to="exhibits"
                    title={t("menu.artists")}
                    Icon={PersonOutlinedIcon}
                />
            </List>
            <List>
                <CustomListItemButton
                    to="exhibits"
                    title={t("menu.profile")}
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
                sx={{justifyContent: 'initial', px: 3}}
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
                >
                    {t("menu.signOut")}
                </Typography>
            </ListItemButton>
        </ListItem>
    )
}

const CustomListItemButton = ({to, title, Icon, ...props}: LinkProps & { title: string; Icon: typeof SvgIcon }) => {
    const [match, setMatch] = useState(false);

    let resolved = useResolvedPath(to);
    let location = useLocation();
    console.log(location.pathname)

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
                    <Icon/>
                </ListItemIcon>
                <Typography
                    variant={"body1"}
                    fontWeight={match ? 'bold' : 'normal'}
                    noWrap
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
                px: 2.5,
                zIndex: 100
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: 0,
                    mr: 1,
                    justifyContent: 'center',
                    fontSize: 38
                }}
            >
                <CloudCircleIcon color="primary" fontSize='inherit'/>
            </ListItemIcon>
            <Typography
                variant={"h6"}
                fontWeight={"bolder"}
                noWrap
                sx={{
                    color: theme.palette.primary.main
                }}
            >
                muse.cloud
            </Typography>
        </ListItem>
    )
}

const ProfileAvatar = () => {
    const theme = useTheme()
    const {user} = useAuthenticator((context) => [context.user]);
    console.log(user)
    return (
        <Stack direction='row'
               spacing={2}
               sx={{
                   justifyContent: 'initial',
                   alignItems: 'center',
                   px: 2,
                   paddingTop: 2,
                   paddingBottom: 3
               }}>
            <Avatar sx={{bgcolor: theme.palette.secondary.main}}>M</Avatar>
            <Stack>
                <Typography
                    variant="body2"
                    fontWeight='bold'
                    noWrap
                >
                    {user.attributes?.email}
                </Typography>
                <Typography
                    variant="body2"
                    fontWeight='normal'
                    noWrap
                >
                    {normalizeText(user.attributes?.email!!, 24)}
                </Typography>
            </Stack>
        </Stack>
    )
}