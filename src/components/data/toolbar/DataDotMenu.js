/**
 * @author aramsey
 *
 * A dot menu intended for the Data view.
 */

import React, { useState } from "react";

import ids from "../ids";
import shareIds from "components/sharing/ids";
import { isOwner, isWritable, containsFolders } from "../utils";
import CreateFolderDialog from "../CreateFolderDialog";
import UploadMenuItems from "./UploadMenuItems";

import { build, DotMenu } from "@cyverse-de/ui-lib";
import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from "@material-ui/core";
import {
    CreateNewFolder,
    ListAlt,
    Queue as AddToBagIcon,
} from "@material-ui/icons";
import { useTranslation } from "i18n";
import DetailsMenuItem from "../menuItems/DetailsMenuItem";
import DeleteMenuItem from "../menuItems/DeleteMenuItem";
import SharingMenuItem from "components/sharing/SharingMenuItem";
import PublicLinksMenuItem from "../menuItems/PublicLinksMenuItem";

function DataDotMenu(props) {
    const {
        baseId,
        path,
        permission,
        onDetailsSelected,
        onDeleteSelected,
        onAddToBagSelected,
        ButtonProps,
        refreshListing,
        detailsEnabled,
        uploadMenuId,
        localUploadId,
        setUploadDialogOpen,
        setImportDialogOpen,
        selected,
        getSelectedResources,
        onCreateHTFileSelected,
        onCreateMultiInputFileSelected,
        canShare,
        setSharingDlgOpen,
        isSmall,
        onPublicLinksSelected,
    } = props;
    const { t } = useTranslation("data");
    const [createFolderDlgOpen, setCreateFolderDlgOpen] = useState(false);
    const onCreateFolderDlgClose = () => setCreateFolderDlgOpen(false);
    const onCreateFolderClicked = () => setCreateFolderDlgOpen(true);
    const isSelectionEmpty = selected?.length === 0;
    const selectedResources = getSelectedResources
        ? getSelectedResources()
        : null;
    const deleteMiEnabled = !isSelectionEmpty && isOwner(selectedResources);
    return (
        <>
            <DotMenu
                baseId={baseId}
                ButtonProps={ButtonProps}
                render={(onClose) => [
                    isSmall
                        ? [
                              isWritable(permission) && (
                                  <MenuItem
                                      key={build(baseId, ids.CREATE_FOLDER_MI)}
                                      id={build(baseId, ids.CREATE_FOLDER_MI)}
                                      onClick={() => {
                                          onClose();
                                          onCreateFolderClicked();
                                      }}
                                  >
                                      <ListItemIcon>
                                          <CreateNewFolder fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={t("folder")} />
                                  </MenuItem>
                              ),
                              detailsEnabled && (
                                  <DetailsMenuItem
                                      key={build(baseId, ids.DETAILS_MENU_ITEM)}
                                      baseId={baseId}
                                      onClose={onClose}
                                      onDetailsSelected={onDetailsSelected}
                                  />
                              ),
                              selected && selected.length > 0 && (
                                  <MenuItem
                                      key={build(baseId, ids.ADD_TO_BAG_MI)}
                                      id={build(baseId, ids.ADD_TO_BAG_MI)}
                                      onClick={() => {
                                          onClose();
                                          onAddToBagSelected();
                                      }}
                                  >
                                      <ListItemIcon>
                                          <AddToBagIcon fontSize="small" />
                                      </ListItemIcon>
                                      <ListItemText primary={t("addToBag")} />
                                  </MenuItem>
                              ),
                              canShare && (
                                  <SharingMenuItem
                                      key={build(
                                          baseId,
                                          shareIds.SHARING_MENU_ITEM
                                      )}
                                      baseId={baseId}
                                      onClose={onClose}
                                      setSharingDlgOpen={setSharingDlgOpen}
                                  />
                              ),
                              deleteMiEnabled && (
                                  <DeleteMenuItem
                                      key={build(baseId, ids.DELETE_MENU_ITEM)}
                                      baseId={baseId}
                                      onClose={onClose}
                                      onDeleteSelected={onDeleteSelected}
                                  />
                              ),
                              <Divider
                                  key={build(
                                      baseId,
                                      ids.UPLOAD_MENU_ITEM_DIVIDER
                                  )}
                              />,
                              isWritable(permission) && (
                                  <UploadMenuItems
                                      key={build(baseId, ids.UPLOAD_MENU_ITEM)}
                                      localUploadId={localUploadId}
                                      uploadMenuId={uploadMenuId}
                                      onBrowseLocal={onClose}
                                      onImportFromURL={() => {
                                          onClose();
                                          setImportDialogOpen(true);
                                      }}
                                      onUploadQueue={() => {
                                          onClose();
                                          setUploadDialogOpen(true);
                                      }}
                                  />
                              ),
                          ]
                        : deleteMiEnabled && (
                              <DeleteMenuItem
                                  key={build(baseId, ids.DELETE_MENU_ITEM)}
                                  baseId={baseId}
                                  onClose={onClose}
                                  onDeleteSelected={onDeleteSelected}
                              />
                          ),
                    isWritable(permission) && [
                        <MenuItem
                            key={build(baseId, ids.CREATE_HT_FILE_MI)}
                            id={build(baseId, ids.CREATE_HT_FILE_MI)}
                            onClick={() => {
                                onClose();
                                onCreateHTFileSelected();
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("newHTAnalysisPathListFile")}
                            />
                        </MenuItem>,
                        <MenuItem
                            key={build(baseId, ids.CREATE_MULTI_INPUT_MI)}
                            id={build(baseId, ids.CREATE_MULTI_INPUT_MI)}
                            onClick={() => {
                                onClose();
                                onCreateMultiInputFileSelected();
                            }}
                        >
                            <ListItemIcon>
                                <ListAlt fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary={t("newMultiInputPathListFile")}
                            />
                        </MenuItem>,
                    ],
                    isOwner(selectedResources) &&
                        !containsFolders(selectedResources) && (
                            <PublicLinksMenuItem
                                key={build(baseId, ids.PUBLIC_LINKS_MENU_ITEM)}
                                onPublicLinksSelected={onPublicLinksSelected}
                                baseId={baseId}
                                onClose={onClose}
                            />
                        ),
                ]}
            />
            <CreateFolderDialog
                path={path}
                open={createFolderDlgOpen}
                onClose={onCreateFolderDlgClose}
                onFolderCreated={() => {
                    onCreateFolderDlgClose();
                    refreshListing();
                }}
            />
        </>
    );
}

export default DataDotMenu;
