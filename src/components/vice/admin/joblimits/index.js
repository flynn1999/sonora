import React, { useState } from "react";

import {
    Card,
    CardContent,
    TextField,
    Typography,
    CardHeader,
    makeStyles,
    Button,
    FormControl,
} from "@material-ui/core";

import { getMessage as msg, formatMessage, withI18N } from "@cyverse-de/ui-lib";

import { useMutation } from "react-query";
import { injectIntl } from "react-intl";

import { id } from "./functions";
import ids from "./ids";
import messages from "./messages";

import {
    getUserJobLimit,
    setUserJobLimit,
} from "../../../../serviceFacades/vice/admin";

import withErrorAnnouncer from "../../../utils/error/withErrorAnnouncer";

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: theme.spacing(4),
        width: "100%",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column",
            justifyContent: "center",
        },
    },
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: theme.spacing(2),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            width: "100%",
            marginLeft: 0,
        },
    },
    textField: {
        [theme.breakpoints.up("xs")]: {
            width: "100%",
            marginLeft: 0,
            marginRight: 0,
        },
        [theme.breakpoints.up("sm")]: {
            width: "50ch",
        },
        [theme.breakpoints.up("md")]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    },
}));

const JobLimits = ({ showErrorAnnouncer, intl }) => {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [previousUsername, setPreviousUsername] = useState("");
    const [newLimit, setNewLimit] = useState("");
    const [currentLimit, setCurrentLimit] = useState("");

    // We're using a mutation instead of a query here because of a bug in
    // how react-query handles the 'enabled' flag in the config. It's fixed
    // in the latest version, but that version makes backwards-breaking changes
    // to the queryCache.refetchQueries() call that breaks most pages. The
    // upgrade to react-query will need to happen in another PR.
    const [getJobLimit] = useMutation(getUserJobLimit, {
        onSuccess: (data) => {
            setPreviousUsername(username); // set the displayed username.
            setCurrentLimit(data?.concurrent_jobs); // set the displayed limit.
            setNewLimit(""); // reset new limit text box.
            setUsername(""); // reset username text box.
        },

        onError: (e) => {
            showErrorAnnouncer(
                formatMessage(intl, "jobLimitLookupError", {
                    username,
                }),
                e
            );
        },
    });

    const [setLimitMutation] = useMutation(setUserJobLimit, {
        onSuccess: () => getJobLimit({ username }),

        onError: (e) => {
            showErrorAnnouncer(
                formatMessage(intl, "jobLimitUpdateError", {
                    username,
                    currentLimit: newLimit,
                }),
                e
            );
        },
    });

    let infoMsg;

    if (currentLimit !== "" && previousUsername !== "") {
        infoMsg = msg("currentJobLimit", {
            values: {
                username: previousUsername,
                currentLimit,
            },
        });
    } else {
        infoMsg = msg("searchForLimit");
    }

    return (
        <Card id={id(ids.CARD)} className={classes.root}>
            <CardHeader title={msg("jobLimits")} />

            <CardContent>
                <FormControl>
                    <div className={classes.container}>
                        <Typography>{infoMsg}</Typography>
                    </div>

                    <div className={classes.container}>
                        <TextField
                            label={msg("username")}
                            id={id(ids.CARD, "textfield")}
                            className={classes.textField}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    getJobLimit({ username });
                                }
                            }}
                        />

                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={() => getJobLimit({ username })}
                            id={id(ids.CARD, "search", "button")}
                        >
                            {msg("search")}
                        </Button>
                    </div>

                    <div className={classes.container}>
                        <TextField
                            label={msg("newJobLimit")}
                            id={id(ids.CARD, "newjobLimit")}
                            className={classes.textField}
                            value={newLimit}
                            onChange={(e) => setNewLimit(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setLimitMutation({
                                        username,
                                        newLimit,
                                    });
                                }
                            }}
                        />

                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.button}
                            onClick={() =>
                                setLimitMutation({ username, newLimit })
                            }
                            id={id(ids.CARD, "setLimit", "button")}
                        >
                            {msg("set")}
                        </Button>
                    </div>
                </FormControl>
            </CardContent>
        </Card>
    );
};

export default withI18N(injectIntl(withErrorAnnouncer(JobLimits)), messages);
