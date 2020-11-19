/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu. Also renders a drawer menu
 * in small screens instead of Navigation bar
 *
 */

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import ids from "./ids";
import constants from "../../constants";
import { useConfig } from "contexts/config";
import GlobalSearchField from "../search/GlobalSearchField";
import NavigationConstants from "common/NavigationConstants";
import Notifications from "./Notifications";
import CustomIntercom from "./CustomIntercom";
import { useUserProfile } from "contexts/userProfile";
import withErrorAnnouncer from "../utils/error/withErrorAnnouncer";
import searchConstants from "components/search/constants";
import { usePreferences } from "contexts/userPreferences";
import Bag from "components/Bag";
import {
    getUserProfile,
    useBootStrap,
    USER_PROFILE_QUERY_KEY,
} from "serviceFacades/users";

import { build, CyVerseAnnouncer } from "@cyverse-de/ui-lib";

import {
    AppBar,
    Avatar,
    Divider,
    Drawer,
    Hidden,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import UserMenu from "./UserMenu";

const ENTITLEMENT = "entitlement";
const drawerWidth = 235;
const miniDrawerWidth = 65;
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
    },
    appBar: {
        backgroundColor: theme.palette.primary,
        zIndex: theme.zIndex.drawer + 1,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: miniDrawerWidth,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: `calc(100% - ${miniDrawerWidth + 1}px)`,
        },
    },
    appBarShift: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    drawerIcon: {
        flexShrink: 0,
        marginRight: theme.spacing(3.5),
        width: 32,
    },
    userIcon: {
        cursor: "pointer",
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
        width: theme.spacing(5),
        height: theme.spacing(5),
        marginLeft: theme.spacing(1),
        "&:hover": {
            textDecoration: "underline",
            textDecorationColor: theme.palette.success.contrastText,
        },
    },
    accountIcon: {
        cursor: "pointer",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    icon: {
        color: theme.palette.info.contrastText,
    },
    appBarIcon: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(2),
        },
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.2),
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
        width: drawerWidth,
        [theme.breakpoints.up("sm")]: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    drawerClose: {
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
            width: miniDrawerWidth,
        },
    },
    content: {
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: `calc(100% - ${miniDrawerWidth + 1}px)`,
            marginLeft: miniDrawerWidth,
            padding: theme.spacing(1),
        },
    },
    contentShift: {
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
    profile: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            textDecorationColor: theme.palette.info.contrastText,
        },
    },
    listItem: {
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            backgroundColor: theme.palette.primary.main,
        },
        color: theme.palette.info.contrastText,
    },
    listItemActive: {
        cursor: "pointer",
        textDecoration: "underline",
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.main,
    },
    menuIcon: {
        color: theme.palette.primary.contrastText,
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(0.5),
            color: theme.palette.info.contrastText,
        },
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

const BagMenu = () => {
    const classes = useStyles();

    return <Bag menuIconClass={classes.menuIcon} />;
};

function CyverseAppBar(props) {
    const classes = useStyles();
    const theme = useTheme();
    const router = useRouter();

    const ref = useRef();
    const [config, setConfig] = useConfig();
    const { t } = useTranslation(["common"]);

    const searchTerm = router?.query?.searchTerm || "";
    let filter = searchConstants.ALL;

    const {
        children,
        activeView,
        setAppBarRef,
        intercomUnreadCount,
        clientConfig,
        showErrorAnnouncer,
    } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const [avatarLetter, setAvatarLetter] = useState("");
    const [open, setOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);
    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [profileRefetchInterval, setProfileRefetchInterval] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const setPreferences = usePreferences()[1];

    if (activeView === NavigationConstants.APPS) {
        filter = searchConstants.APPS;
    } else if (activeView === NavigationConstants.ANALYSES) {
        filter = searchConstants.ANALYSES;
    } else if (activeView === NavigationConstants.DATA) {
        filter = searchConstants.DATA;
    } else {
        filter = searchConstants.ALL;
    }

    function updateUserProfile(profile) {
        if (
            (profile === null && userProfile !== null) ||
            (profile !== null && userProfile === null)
        ) {
            setUserProfile(profile);
        }
    }

    useQuery({
        queryKey: USER_PROFILE_QUERY_KEY,
        queryFn: getUserProfile,
        config: {
            enabled: profileRefetchInterval != null,
            onSuccess: updateUserProfile,
            refetchInterval: profileRefetchInterval,
        },
    });

    useEffect(() => {
        if (clientConfig) {
            setConfig(clientConfig);
            setProfileRefetchInterval(clientConfig.sessions.poll_interval_ms);
        }
    }, [clientConfig, setConfig]);

    useEffect(() => {
        if (bootstrapError) {
            const errorString = JSON.stringify(bootstrapError);
            setBootstrapError(null);
            router.push(
                `/${NavigationConstants.ERROR}?errorInfo=` + errorString
            );
        }
    }, [bootstrapError, router]);

    useEffect(() => {
        setAppBarRef(ref);
    }, [ref, setAppBarRef]);

    useEffect(() => {
        if (userProfile) {
            setBootstrapQueryEnabled(true);
        }
    }, [userProfile]);

    useBootStrap(
        bootstrapQueryEnabled,
        (respData) => {
            setPreferences(respData.preferences);
        },
        setBootstrapError
    );

    React.useEffect(() => {
        if (userProfile?.id) {
            setAvatarLetter(userProfile.id.charAt(0).toUpperCase());
            const adminGroups = config?.admin.groups;
            const groupAttribute =
                config?.admin.group_attribute_name || ENTITLEMENT;
            const userGroupMemberships = userProfile.attributes[groupAttribute];
            const adminMemberships = [];
            if (adminGroups && userGroupMemberships) {
                const adminGroupArray = adminGroups.split(",");
                adminGroupArray.forEach((adminGroup) => {
                    const found = userGroupMemberships.find(
                        (userGroup) => adminGroup === userGroup
                    );
                    if (found) {
                        adminMemberships.push(found);
                    }
                });
                setAdminUser(adminMemberships.length > 0);
            }
        }
    }, [
        userProfile,
        adminUser,
        setAdminUser,
        setAvatarLetter,
        config,

        showErrorAnnouncer,
    ]);

    const handleUserButtonClick = (event) => {
        toggleDrawer(false);
        if (!userProfile) {
            router.push(`/${NavigationConstants.LOGIN}${router.asPath}`);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const onLogoutClick = () => {
        router.push(`/${NavigationConstants.LOGOUT}`);
    };

    const onUserMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSearchClick = (event) => {
        router.push("/" + NavigationConstants.SEARCH);
        toggleDrawer(false);
    };
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleDrawer = (open) => (event) => {
        setOpen(open);
    };

    const accountAvatar = (
        <Avatar
            className={userProfile ? classes.userIcon : classes.accountIcon}
            onClick={handleUserButtonClick}
        >
            {userProfile ? (
                <Tooltip
                    title={t("logout", { name: userProfile.id })}
                    aria-label={t("logout", { name: userProfile.id })}
                    placement="bottom"
                    arrow
                >
                    <Typography variant={"h6"}>{avatarLetter}</Typography>
                </Tooltip>
            ) : (
                <Tooltip
                    title={t("login")}
                    aria-label={t("login")}
                    placement="bottom"
                    arrow
                >
                    <AccountCircle fontSize="large" />
                </Tooltip>
            )}
        </Avatar>
    );

    const drawerItems = (
        <List>
            <Tooltip title={t("dashboard")} placement="right" arrow>
                <ListItem
                    id={build(ids.DRAWER_MENU, ids.DASHBOARD_MI)}
                    onClick={() => {
                        toggleDrawer(false);
                        router.push("/" + NavigationConstants.DASHBOARD);
                    }}
                    className={
                        activeView === NavigationConstants.DASHBOARD
                            ? classes.listItemActive
                            : classes.listItem
                    }
                >
                    <img
                        className={classes.drawerIcon}
                        src="/dashboard_selected.png"
                        alt={t("dashboard")}
                    />
                    <ListItemText>{t("dashboard")}</ListItemText>
                </ListItem>
            </Tooltip>
            <Tooltip title={t("data")} placement="right" arrow>
                <ListItem
                    id={build(ids.DRAWER_MENU, ids.DATA_MI)}
                    onClick={() => {
                        toggleDrawer(false);
                        router.push("/" + NavigationConstants.DATA);
                    }}
                    className={
                        activeView === NavigationConstants.DATA
                            ? classes.listItemActive
                            : classes.listItem
                    }
                >
                    <img
                        className={classes.drawerIcon}
                        src="/data_selected.png"
                        alt={t("data")}
                    />
                    <ListItemText>{t("data")}</ListItemText>
                </ListItem>
            </Tooltip>
            <Tooltip title={t("apps")} placement="right" arrow>
                <ListItem
                    id={build(ids.DRAWER_MENU, ids.APPS_MI)}
                    onClick={() => {
                        toggleDrawer(false);
                        router.push("/" + NavigationConstants.APPS);
                    }}
                    className={
                        activeView === NavigationConstants.APPS
                            ? classes.listItemActive
                            : classes.listItem
                    }
                >
                    <img
                        className={classes.drawerIcon}
                        src="/apps_selected.png"
                        alt={t("apps")}
                    />
                    <ListItemText>{t("apps")}</ListItemText>
                </ListItem>
            </Tooltip>
            <Tooltip title={t("analyses")} placement="right" arrow>
                <ListItem
                    id={build(ids.DRAWER_MENU, ids.ANALYSES_MI)}
                    onClick={() => {
                        toggleDrawer(false);
                        router.push("/" + NavigationConstants.ANALYSES);
                    }}
                    className={
                        activeView === NavigationConstants.ANALYSES
                            ? classes.listItemActive
                            : classes.listItem
                    }
                >
                    <img
                        className={classes.drawerIcon}
                        src="/analyses_selected.png"
                        alt={t("analyses")}
                    />
                    <ListItemText>{t("analyses")}</ListItemText>
                </ListItem>
            </Tooltip>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <Tooltip title={t("search")} placement="right" arrow>
                    <ListItem
                        id={build(ids.DRAWER_MENU, ids.SEARCH_MI)}
                        onClick={handleSearchClick}
                        className={
                            activeView === NavigationConstants.SEARCH
                                ? classes.listItemActive
                                : classes.listItem
                        }
                    >
                        <ListItemIcon>
                            <SearchIcon
                                className={classes.icon}
                                fontSize="large"
                            />
                        </ListItemIcon>
                        <ListItemText>{t("search")}</ListItemText>
                    </ListItem>
                </Tooltip>
            </Hidden>
            <Divider />
            {userProfile?.id && (
                <Tooltip title={t("settings")} placement="right" arrow>
                    <ListItem
                        id={build(ids.DRAWER_MENU, ids.SETTINGS_MI)}
                        onClick={() =>
                            router.push("/" + NavigationConstants.SETTINGS)
                        }
                        className={
                            activeView === NavigationConstants.SETTINGS
                                ? classes.listItemActive
                                : classes.listItem
                        }
                    >
                        <ListItemIcon>
                            <SettingsIcon
                                className={classes.icon}
                                fontSize="large"
                            />
                        </ListItemIcon>
                        <ListItemText>{t("settings")}</ListItemText>
                    </ListItem>
                </Tooltip>
            )}
        </List>
    );

    const adminDrawerItems = (
        <List>
            <ListItem
                id={build(ids.DRAWER_MENU, ids.ADMIN_MI)}
                className={
                    activeView === NavigationConstants.ADMIN
                        ? classes.listItemActive
                        : classes.listItem
                }
            >
                <ListItemIcon>
                    <SupervisorAccountIcon
                        className={classes.icon}
                        fontSize="large"
                    />
                </ListItemIcon>
                <ListItemText>{t("admin")}</ListItemText>
            </ListItem>
            <List component="div" disablePadding>
                <Tooltip title={t("vice")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.VICE_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.VICE
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText>{t("vice")}</ListItemText>
                    </ListItem>
                </Tooltip>
                <Tooltip title={t("refGenomes")} placement="right" arrow>
                    <ListItem
                        button
                        id={build(ids.DRAWER_MENU, ids.REF_GENOME_MI)}
                        className={clsx(classes.nested, classes.listItem)}
                        onClick={() =>
                            router.push(
                                "/" +
                                    NavigationConstants.ADMIN +
                                    "/" +
                                    NavigationConstants.REF_GENOMES
                            )
                        }
                    >
                        <ListItemIcon>
                            <LabelImportantIcon className={classes.icon} />
                        </ListItemIcon>
                        <ListItemText>{t("refGenomes")}</ListItemText>
                    </ListItem>
                </Tooltip>
            </List>
        </List>
    );
    return (
        <div className={classes.root}>
            <AppBar
                id={ids.APP_BAR_BASE}
                position="static"
                variant="outlined"
                ref={ref}
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <Hidden only={["sm", "md", "lg", "xl"]}>
                        <IconButton
                            aria-label={t("openDrawer")}
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={classes.menuIcon}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography>{t("deTitle")}</Typography>
                    </Hidden>
                    <Hidden xsDown>
                        <a
                            href={constants.CYVERSE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                width={190}
                                height={39}
                                src="/de_white.png"
                                alt={t("cyverse")}
                            ></img>
                        </a>
                    </Hidden>
                    <Hidden xsDown>
                        <GlobalSearchField
                            search={searchTerm}
                            selectedFilter={filter}
                        />
                    </Hidden>
                    <div className={classes.root} />
                    <div style={{ display: "flex" }}>
                        <CustomIntercom
                            intercomUnreadCount={intercomUnreadCount}
                        />
                        <BagMenu />
                        <Notifications />
                    </div>
                    <Hidden only={["xs"]}>
                        <div id={build(ids.APP_BAR_BASE, ids.ACCOUNT_MI)}>
                            {accountAvatar}
                        </div>
                    </Hidden>
                </Toolbar>
            </AppBar>
            <Hidden xsDown>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        {!open && (
                            <IconButton
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuIcon, {
                                    [classes.hide]: open,
                                })}
                            >
                                <MenuIcon fontSize="large" />
                            </IconButton>
                        )}
                        {open && (
                            <IconButton
                                onClick={handleDrawerClose}
                                className={classes.menuIcon}
                            >
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon fontSize="large" />
                                ) : (
                                    <ChevronLeftIcon fontSize="large" />
                                )}
                            </IconButton>
                        )}
                    </div>
                    <Divider />
                    {drawerItems}
                    {open && adminUser && (
                        <>
                            <Divider />
                            {adminDrawerItems}
                        </>
                    )}
                </Drawer>
            </Hidden>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                <Drawer
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                    open={open}
                    onClose={toggleDrawer(false)}
                >
                    <div
                        id={build(ids.DRAWER_MENU, ids.ACCOUNT_MI)}
                        style={{ margin: 8 }}
                    >
                        <UserMenu
                            baseId={build(ids.DRAWER_MENU, ids.ACCOUNT_MI)}
                            profile={userProfile}
                            onLogoutClick={onLogoutClick}
                            onManageAccountClick={() =>
                                window.open(
                                    "https://user.cyverse.org",
                                    "_blank"
                                )
                            }
                        />
                    </div>
                    <Divider />
                    {drawerItems}
                    {adminUser && (
                        <>
                            <Divider />
                            {adminDrawerItems}
                        </>
                    )}
                </Drawer>
            </Hidden>
            <CyVerseAnnouncer />
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onUserMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <UserMenu
                    baseId={build(ids.APP_BAR_BASE, ids.ACCOUNT_MI)}
                    profile={userProfile}
                    onLogoutClick={onLogoutClick}
                    onManageAccountClick={() =>
                        window.open("https://user.cyverse.org", "_blank")
                    }
                />
            </Popover>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                {children}
            </main>
        </div>
    );
}
export default withErrorAnnouncer(CyverseAppBar);
