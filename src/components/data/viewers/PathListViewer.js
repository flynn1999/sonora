/**
 * View / Edit path list files
 *
 * @author sriram
 *
 */
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import { useMutation, useQuery } from "react-query";
import { useRowSelect, useTable } from "react-table";
import { useTranslation } from "i18n";

import { uploadTextAsFile } from "serviceFacades/fileio";
import {
    DATA_DETAILS_QUERY_KEY,
    getResourceDetails,
} from "serviceFacades/filesystem";
import constants from "../../../constants";
import { UploadTrackingProvider } from "contexts/uploadTracking";
import SaveAsDialog from "../SaveAsDialog";
import { getParentPath, isWritable } from "../utils";
import ids from "./ids";
import Toolbar from "./Toolbar";
import { getColumns, LINE_NUMBER_ACCESSOR } from "./utils";

import DataSelectionDrawer from "components/data/SelectionDrawer";
import PageWrapper from "components/layout/PageWrapper";
import { ERROR_CODES, getErrorCode } from "components/utils/error/errorCode";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";

import {
    Checkbox,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@material-ui/core";

const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        return <Checkbox type="Checkbox" ref={resolvedRef} {...rest} />;
    }
);

function PathListViewer(props) {
    const {
        baseId,
        path,
        resourceId,
        separator,
        loading,
        showErrorAnnouncer,
        createFile,
        handlePathChange,
        onRefresh,
        onNewFileSaved,
        fileName,
        data,
    } = props;

    const { t } = useTranslation("data");
    const [open, setOpen] = useState(false);
    const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [permission, setPermission] = useState(null);
    const [saveNewFileError, setSaveNewFileError] = useState(null);
    const [fileSavePath, setFileSavePath] = useState();
    const [editorData, setEditorData] = useState([]);

    const columns = useMemo(() => getColumns(data, false, t("path")), [
        data,
        t,
    ]);

    const pathAccessor = columns[1].accessor;

    const setLineNumbers = useCallback(
        (tableData) => {
            const tableDataWithLineNumbers = tableData.map((row, index) => {
                const pathKey = pathAccessor;
                const val = row[pathKey];
                const newRow = {};
                //line number starts from 1
                newRow[LINE_NUMBER_ACCESSOR] = index + 1;
                newRow[pathKey] = val;
                return newRow;
            });
            return tableDataWithLineNumbers;
        },
        [pathAccessor]
    );

    useEffect(() => {
        //hide the shebang row
        const dataToDisplay = data.slice(1);
        setEditorData(setLineNumbers(dataToDisplay));
    }, [data, setLineNumbers]);

    const [saveTextAsFile, { status: fileSaveStatus }] = useMutation(
        uploadTextAsFile,
        {
            onSuccess: (resp) => {
                setDirty(false);
                announce({
                    text: t("fileSaveSuccess", {
                        fileName: resp?.file.label,
                    }),
                    variant: AnnouncerConstants.SUCCESS,
                });

                if (createFile && onNewFileSaved) {
                    //reload the viewer
                    onNewFileSaved(resp?.file.path, resp?.file.id);
                }
            },
            onError: (error) => {
                if (createFile) {
                    const text =
                        getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                            ? t("fileExists", {
                                  path: getParentPath(fileSavePath),
                              })
                            : t("fileSaveError");
                    setSaveNewFileError(text);
                } else {
                    showErrorAnnouncer(t("fileSaveError", { fileName }), error);
                }
            },
        }
    );

    const { isFetching: fetchingDetails } = useQuery({
        queryKey: [DATA_DETAILS_QUERY_KEY, { paths: [path] }],
        queryFn: getResourceDetails,
        config: {
            enabled: !createFile,
            onSuccess: (resp) => {
                const details = resp?.paths[path];
                setPermission(details?.permission);
            },
            onError: (e) => {
                showErrorAnnouncer(t("detailsError"), e);
            },
        },
    });

    const getContent = () => {
        //add back the shebang line
        let content = data[0][pathAccessor].concat("\n");
        editorData.forEach((row, index) => {
            content = content
                .concat(row[pathAccessor])
                .concat(separator)
                .concat("\n");
        });
        return content;
    };

    const saveFile = () => {
        saveTextAsFile({
            dest: path,
            content: getContent(),
            newFile: false,
        });
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns,
        selectedFlatRows,
        state: { hiddenColumns, selectedRowIds },
    } = useTable(
        {
            columns,
            data: editorData,
            initialState: {
                hiddenColumns: [],
            },
        },
        useRowSelect,
        (hooks) => {
            hooks.allColumns.push((columns) => [
                // Let's make a column for selection
                {
                    id: "selection",
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllRowsSelectedProps }) => (
                        <IndeterminateCheckbox
                            {...getToggleAllRowsSelectedProps()}
                        />
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                    ),
                },
                ...columns,
            ]);
        }
    );
    return (
        <PageWrapper appBarHeight={120}>
            <Toolbar
                baseId={build(baseId, ids.VIEWER_STRUCTURED, ids.TOOLBAR)}
                path={path}
                resourceId={resourceId}
                allowLineNumbers={true}
                showLineNumbers={!hiddenColumns?.includes(LINE_NUMBER_ACCESSOR)}
                onShowLineNumbers={(showLineNumbers) => {
                    if (showLineNumbers) {
                        setHiddenColumns([]);
                    } else {
                        setHiddenColumns([LINE_NUMBER_ACCESSOR]);
                    }
                }}
                editing={
                    (!fetchingDetails && isWritable(permission)) || createFile
                }
                onAddRow={() => {
                    setOpen(true);
                }}
                onDeleteRow={() => {
                    selectedFlatRows.forEach((selRow) => {
                        const newData = editorData.filter(
                            (row, index) => index !== selRow.index
                        );
                        setEditorData(setLineNumbers([...newData]));
                        setDirty(true);
                    });
                }}
                onSave={() => {
                    if (createFile) {
                        setSaveAsDialogOpen(true);
                    } else {
                        saveFile();
                    }
                }}
                dirty={dirty}
                selectionCount={Object.keys(selectedRowIds).length}
                handlePathChange={handlePathChange}
                onRefresh={onRefresh}
                fileName={fileName}
                createFile={createFile}
            />
            {(loading || fileSaveStatus === constants.LOADING) && (
                <CircularProgress
                    thickness={7}
                    color="primary"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                    }}
                />
            )}
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table
                    id={build(baseId, ids.VIEWER_STRUCTURED, fileName)}
                    size="small"
                    stickyHeader
                    {...getTableProps()}
                >
                    <TableHead>
                        {headerGroups.map((headerGroup) => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <TableCell {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {rows.map((row, index) => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <TableCell {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <UploadTrackingProvider>
                <DataSelectionDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    onConfirm={(resources) => {
                        setOpen(false);
                        if (resources?.length > 0) {
                            const selPaths = [];
                            resources.forEach((resource) => {
                                const key = pathAccessor;
                                const pathObj = {};
                                pathObj[key] = resource?.path;
                                selPaths.push(pathObj);
                            });
                            const dataWithLineNumbers = setLineNumbers([
                                ...editorData,
                                ...selPaths,
                            ]);
                            setEditorData(dataWithLineNumbers);
                            setDirty(true);
                        }
                    }}
                    multiSelect={true}
                />
            </UploadTrackingProvider>
            <SaveAsDialog
                path={getParentPath(path)}
                open={saveAsDialogOpen}
                onClose={() => setSaveAsDialogOpen(false)}
                saveFileError={saveNewFileError}
                onSaveAs={(newPath) => {
                    setFileSavePath(newPath);
                    setSaveNewFileError(null);
                    saveTextAsFile({
                        dest: newPath,
                        content: getContent(),
                        newFile: createFile ? true : false,
                    });
                }}
                loading={fileSaveStatus === constants.LOADING}
            />
        </PageWrapper>
    );
}

export default withErrorAnnouncer(PathListViewer);
