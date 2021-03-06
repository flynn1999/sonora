/**
 * @author sriram
 *
 * A toolbar for file viewer.
 *
 *
 */
import React, { useEffect, useState } from "react";

import { queryCache, useQuery } from "react-query";
import { useTranslation } from "i18n";
import { NavigationParams } from "common/NavigationConstants";

import ids from "./ids";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";
import DetailsDrawer from "components/data/details/Drawer";
import ResourceTypes from "components/models/ResourceTypes";

import BackButton from "components/utils/BackButton";
import { getHost } from "components/utils/getHost";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    Button,
    Divider,
    Hidden,
    FormControlLabel,
    FormGroup,
    Switch,
    Toolbar,
    Typography,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    Add,
    CloudDownload,
    Delete,
    Info,
    List as MetadataIcon,
    Refresh,
    Save,
    Code,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
    separator: {
        margin: theme.spacing(0.5),
    },
}));

function ViewerToolbar(props) {
    const {
        baseId,
        path,
        resourceId,
        showLineNumbers,
        onShowLineNumbers,
        showErrorAnnouncer,
        firstRowHeader,
        onFirstRowHeader,
        onAddRow,
        onDeleteRow,
        editing,
        onSave,
        selectionCount,
        dirty,
        onRefresh,
        handlePathChange,
        fileName,
        createFile,
        modeSelect,
    } = props;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [download, setDownload] = useState(false);
    const [openModeSelectDialog, setOpenModeSelectDialog] = useState(false);
    const classes = useStyles();

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    useEffect(() => {
        if (download) {
            window.open(`${getHost()}/api/download?path=${path}`, "_blank");
            setDownload(false);
        }
    }, [path, download]);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                showErrorAnnouncer(t("infoTypeFetchError"), e);
            },
        },
    });

    const onViewDetails = () =>
        setDetailsResource({
            id: resourceId,
            path,
            label: fileName,
            type: ResourceTypes.FILE,
        });

    const onViewMetadata = () =>
        handlePathChange(path, { view: NavigationParams.VIEW.METADATA });

    const ToolbarButton = ({ idExtension, text, ...props }) => {
        return (
            <Button
                id={build(baseId, idExtension)}
                size="small"
                className={classes.toolbarItems}
                variant="outlined"
                disableElevation
                color="primary"
                {...props}
            >
                <Hidden xsDown>{text}</Hidden>
            </Button>
        );
    };
    return (
        <>
            <Toolbar variant="dense" id={baseId}>
                <BackButton />
                <Divider
                    orientation="vertical"
                    flexItem
                    className={classes.separator}
                />
                <Typography variant="body2" color="primary">
                    {fileName}
                </Typography>
                <Hidden smDown>
                    {onShowLineNumbers && (
                        <>
                            <Divider
                                orientation="vertical"
                                flexItem
                                className={classes.separator}
                            />
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id={build(
                                                baseId,
                                                ids.LINE_NUMBERS_SWITCH
                                            )}
                                            size="small"
                                            checked={showLineNumbers}
                                            onChange={(event) =>
                                                onShowLineNumbers(
                                                    event.target.checked
                                                )
                                            }
                                            name={t("showLineNumbers")}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {t("showLineNumbers")}
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        </>
                    )}
                    {onFirstRowHeader && (
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        id={build(baseId, ids.HEADER_SWITCH)}
                                        size="small"
                                        checked={firstRowHeader}
                                        onChange={(event) =>
                                            onFirstRowHeader(
                                                event.target.checked
                                            )
                                        }
                                        name={t("firstRowHeader")}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        {t("firstRowHeader")}
                                    </Typography>
                                }
                            />
                        </FormGroup>
                    )}

                    <div className={classes.divider} />
                    {editing && (
                        <>
                            <ToolbarButton
                                idExtension={ids.ADD_BTN}
                                onClick={onAddRow}
                                startIcon={<Add fontSize="small" />}
                                text={t("add")}
                            />
                            <ToolbarButton
                                idExtension={ids.DELETE_BTN}
                                onClick={onDeleteRow}
                                startIcon={<Delete fontSize="small" />}
                                text={t("delete")}
                                disabled={selectionCount === 0}
                            />
                            <ToolbarButton
                                idExtension={ids.SAVE_BTN}
                                onClick={onSave}
                                startIcon={<Save fontSize="small" />}
                                text={i18nCommon("save")}
                                disabled={!dirty}
                            />
                            <Divider
                                orientation="vertical"
                                flexItem
                                className={classes.separator}
                            />
                        </>
                    )}
                    {!createFile && (
                        <>
                            {modeSelect}
                            <ToolbarButton
                                idExtension={ids.DETAILS_BTN}
                                onClick={onViewDetails}
                                startIcon={<Info />}
                                text={t("details")}
                            />
                            <ToolbarButton
                                idExtension={ids.METADATA_BTN}
                                onClick={onViewMetadata}
                                startIcon={<MetadataIcon />}
                                text={t("metadata")}
                            />
                            <ToolbarButton
                                idExtension={ids.DOWNLOAD_BTN}
                                onClick={() => setDownload(true)}
                                startIcon={<CloudDownload fontSize="small" />}
                                text={t("download")}
                            />
                            <ToolbarButton
                                idExtension={ids.REFRESH_BTN}
                                onClick={onRefresh}
                                startIcon={<Refresh fontSize="small" />}
                                text={i18nCommon("refresh")}
                            />
                        </>
                    )}
                </Hidden>
                <Hidden mdUp>
                    <>
                        <div className={classes.divider} />
                        <DotMenu
                            baseId={baseId}
                            render={(onClose) => [
                                onShowLineNumbers && (
                                    <MenuItem
                                        key={build(
                                            baseId,
                                            ids.LINE_NUMBER_MENU_ITEM
                                        )}
                                    >
                                        <ListItemIcon>
                                            <Switch
                                                id={build(
                                                    baseId,
                                                    ids.LINE_NUMBERS_SWITCH
                                                )}
                                                size="small"
                                                checked={showLineNumbers}
                                                onChange={(event) => {
                                                    onShowLineNumbers(
                                                        event.target.checked
                                                    );
                                                }}
                                                color="primary"
                                                inputProps={{
                                                    "aria-labelledby": build(
                                                        baseId,
                                                        ids.LINE_NUMBER_MENU_ITEM
                                                    ),
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            id={build(
                                                baseId,
                                                ids.LINE_NUMBER_MENU_ITEM
                                            )}
                                            primary={t("showLineNumbers")}
                                        />
                                    </MenuItem>
                                ),
                                onFirstRowHeader && (
                                    <MenuItem
                                        key={build(
                                            baseId,
                                            ids.FIRST_ROW_HEADER_MENU_ITEM
                                        )}
                                    >
                                        <ListItemIcon>
                                            <Switch
                                                id={build(
                                                    baseId,
                                                    ids.HEADER_SWITCH
                                                )}
                                                size="small"
                                                checked={firstRowHeader}
                                                onChange={(event) => {
                                                    onFirstRowHeader(
                                                        event.target.checked
                                                    );
                                                }}
                                                color="primary"
                                                inputProps={{
                                                    "aria-labelledby": build(
                                                        baseId,
                                                        ids.FIRST_ROW_HEADER_MENU_ITEM
                                                    ),
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            id={build(
                                                baseId,
                                                ids.FIRST_ROW_HEADER_MENU_ITEM
                                            )}
                                            primary={t("firstRowHeader")}
                                        />
                                    </MenuItem>
                                ),

                                editing && [
                                    <MenuItem
                                        key={build(baseId, ids.ADD_MENU_ITEM)}
                                        id={build(baseId, ids.ADD_MENU_ITEM)}
                                        onClick={() => {
                                            onClose();
                                            onAddRow();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Add fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("add")} />
                                    </MenuItem>,
                                    <MenuItem
                                        key={build(
                                            baseId,
                                            ids.DELETE_MENU_ITEM
                                        )}
                                        id={build(baseId, ids.DELETE_MENU_ITEM)}
                                        onClick={() => {
                                            onClose();
                                            onSave();
                                        }}
                                        disabled={!dirty}
                                    >
                                        <ListItemIcon>
                                            <Save fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={i18nCommon("save")}
                                        />
                                    </MenuItem>,
                                    <MenuItem
                                        key={build(baseId, ids.SAVE_MENU_ITEM)}
                                        id={build(baseId, ids.SAVE_MENU_ITEM)}
                                        onClick={() => {
                                            onClose();
                                            onDeleteRow();
                                        }}
                                        disabled={selectionCount === 0}
                                    >
                                        <ListItemIcon>
                                            <Delete fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("delete")} />
                                    </MenuItem>,
                                ],
                                !createFile &&
                                    modeSelect && [
                                        <MenuItem
                                            key={
                                                ids.SELECT_MODE_INPUT_MENU_ITEM
                                            }
                                            id={build(
                                                baseId,
                                                ids.SELECT_MODE_INPUT_MENU_ITEM
                                            )}
                                            onClick={() => {
                                                onClose();
                                                setOpenModeSelectDialog(true);
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Code fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={t(
                                                    "syntaxHighlighterMode"
                                                )}
                                            />
                                        </MenuItem>,
                                    ],
                                !createFile && [
                                    <MenuItem
                                        key={ids.DETAILS_MENU_ITEM}
                                        id={build(
                                            baseId,
                                            ids.DETAILS_MENU_ITEM
                                        )}
                                        onClick={() => {
                                            onClose();
                                            onViewDetails();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Info fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("details")} />
                                    </MenuItem>,
                                    <MenuItem
                                        key={ids.METADATA_MENU_ITEM}
                                        id={build(
                                            baseId,
                                            ids.METADATA_MENU_ITEM
                                        )}
                                        onClick={() => {
                                            onClose();
                                            onViewMetadata();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <MetadataIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("metadata")} />
                                    </MenuItem>,
                                    <MenuItem
                                        key={ids.DOWNLOAD_MENU_ITEM}
                                        id={build(
                                            baseId,
                                            ids.DOWNLOAD_MENU_ITEM
                                        )}
                                        onClick={() => {
                                            onClose();
                                            setDownload(true);
                                        }}
                                    >
                                        <ListItemIcon>
                                            <CloudDownload fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("download")} />
                                    </MenuItem>,
                                    <MenuItem
                                        key={ids.REFRESH_MENU_ITEM}
                                        id={build(
                                            baseId,
                                            ids.REFRESH_MENU_ITEM
                                        )}
                                        onClick={onRefresh}
                                    >
                                        <ListItemIcon>
                                            <Refresh fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={i18nCommon("refresh")}
                                        />
                                    </MenuItem>,
                                ],
                            ]}
                        />
                    </>
                </Hidden>
            </Toolbar>
            {modeSelect && (
                <Dialog open={openModeSelectDialog}>
                    <DialogContent>{modeSelect}</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenModeSelectDialog(false)}>
                            {i18nCommon("done")}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {detailsResource && (
                <DetailsDrawer
                    baseId={baseId}
                    resource={detailsResource}
                    onClose={() => setDetailsResource(null)}
                    open={detailsResource !== null}
                    infoTypes={infoTypes}
                />
            )}
        </>
    );
}
export default withErrorAnnouncer(ViewerToolbar);
