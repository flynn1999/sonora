/**
 * @author johnworth
 *
 * The dashboard component.
 *
 * @module dashboard
 */
import React, { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

import { useQuery, queryCache } from "react-query";

import { useTranslation } from "i18n";

import { Typography } from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { announce, AnnouncerConstants } from "@cyverse-de/ui-lib";

import ids from "./ids";
import * as constants from "./constants";
import useStyles from "./styles";
import * as fns from "./functions";
import {
    // NewsFeed,
    // EventsFeed,
    RecentlyUsedApps,
    PublicApps,
    RecentAnalyses,
    RunningAnalyses,
    VideosFeed,
} from "./DashboardSection";

import { getDashboard, DASHBOARD_QUERY_KEY } from "serviceFacades/dashboard";
import { useBootstrapInfo } from "contexts/bootstrap";

import {
    useBootStrap,
    useSavePreferences,
    BOOTSTRAP_KEY,
} from "serviceFacades/users";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import { useUserProfile } from "contexts/userProfile";
import Banner from "./dashboardItem/Banner";
import Tour from "./dashboardItem/Tour";

const AppDetailsDrawer = dynamic(() =>
    import("components/apps/details/Drawer")
);
const AnalysesDetailsDrawer = dynamic(() =>
    import("components/analyses/details/Drawer")
);

const DashboardSkeleton = () => {
    const classes = useStyles();
    const [userProfile] = useUserProfile();

    let skellyTypes = [classes.sectionNews, classes.sectionEvents, "", ""];

    if (userProfile?.id) {
        skellyTypes = [
            "",
            "",
            "",
            "",
            classes.sectionNews,
            classes.sectionEvents,
            "",
        ];
    }

    const skellies = skellyTypes.map((extraClass, index) => (
        <div className={clsx(classes.section, extraClass)} key={index}>
            <Skeleton
                variant="rect"
                animation="wave"
                height={50}
                width="100%"
            />
            <div className={classes.sectionItems}>
                <Skeleton
                    variant="rect"
                    animation="wave"
                    height={225}
                    width="100%"
                />
            </div>
        </div>
    ));

    return <>{skellies}</>;
};

const Dashboard = (props) => {
    const { showErrorAnnouncer } = props;
    const classes = useStyles();
    const { t } = useTranslation("dashboard");
    const { t: i18nPref } = useTranslation("preferences");
    const [userProfile] = useUserProfile();

    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [bootstrapError, setBootstrapError] = useState(null);
    const [bootstrapInfo, setBootstrapInfo] = useBootstrapInfo();

    //get from cache if not fetch now.
    const prefCache = queryCache.getQueryData(BOOTSTRAP_KEY);

    const preProcessData = useCallback(
        (respData) => {
            let pref = respData.preferences;
            setBootstrapInfo({ ...bootstrapInfo, preferences: pref });
        },
        [bootstrapInfo, setBootstrapInfo]
    );

    useEffect(() => {
        if (prefCache && !bootstrapInfo) {
            preProcessData(prefCache);
        } else {
            setBootstrapQueryEnabled(true);
        }
    }, [preProcessData, bootstrapInfo, prefCache]);

    useBootStrap(
        bootstrapQueryEnabled,
        (respData) => preProcessData(respData),
        setBootstrapError
    );

    const [mutatePreferences] = useSavePreferences(
        (updatedPref) => {
            announce({
                text: i18nPref("prefSaveSuccess"),
                variant: AnnouncerConstants.SUCCESS,
            });
            setBootstrapInfo({
                ...bootstrapInfo,
                preferences: updatedPref.preferences,
            });
        },
        (e) => {
            showErrorAnnouncer(i18nPref("savePrefError"), e);
        }
    );

    const dashboardEl = useRef();
    const [cardWidth, cardHeight, numColumns] = fns.useDashboardSettings({
        dashboardEl,
    });

    const { status, data, error } = useQuery(
        [DASHBOARD_QUERY_KEY, { limit: constants.SECTION_ITEM_LIMIT }],
        getDashboard
    );
    const isLoading = status === "loading";
    const hasErrored = status === "error";

    // Display the error message if an error occurred.
    if (hasErrored) {
        showErrorAnnouncer(t("dashboardInitError", { error: error.message }));
    }

    // State variables.
    const [detailsApp, setDetailsApp] = useState(null);
    const [detailsAnalysis, setDetailsAnalysis] = useState(null);

    let sections = [
        // new NewsFeed(),
        // new EventsFeed(),
        new VideosFeed(),
        new PublicApps(),
    ];

    if (userProfile?.id) {
        sections = [
            new RecentAnalyses(),
            new RunningAnalyses(),
            new RecentlyUsedApps(),
            new PublicApps(),
            // new NewsFeed(),
            // new EventsFeed(),
            new VideosFeed(),
        ];
    }

    const filteredSections = data
        ? sections
              .filter(
                  (section) =>
                      data.hasOwnProperty(section.kind) &&
                      data[section.kind].hasOwnProperty(section.name)
              )
              .filter((section) => data[section.kind][section.name].length > 0)
              .map((section, index) =>
                  section.getComponent({
                      t,
                      data,
                      cardWidth,
                      cardHeight,
                      numColumns,
                      showErrorAnnouncer,
                      setDetailsApp,
                      setDetailsAnalysis,
                  })
              )
        : [];

    let componentContent;

    if (filteredSections.length > 0) {
        componentContent = filteredSections;
    } else {
        componentContent = (
            <Typography color="textSecondary">{t("noContentFound")}</Typography>
        );
    }

    // The base ID for the dashboard.
    const baseId = fns.makeID(ids.ROOT);

    return (
        <div ref={dashboardEl} id={baseId} className={classes.gridRoot}>
            {!userProfile?.id && <Banner />}
            {!bootstrapError && userProfile?.id && (
                <Tour
                    showTourPrompt={bootstrapInfo?.preferences?.showTourPrompt}
                    onDismiss={() => {
                        mutatePreferences({
                            ...bootstrapInfo.preferences,
                            showTourPrompt: false,
                        });
                    }}
                />
            )}
            {isLoading ? <DashboardSkeleton /> : componentContent}

            {detailsApp && (
                <AppDetailsDrawer
                    appId={detailsApp.id}
                    systemId={detailsApp.system_id}
                    open={true}
                    baseId={baseId}
                    onClose={() => setDetailsApp(null)}
                    onFavoriteUpdated={detailsApp.onFavoriteUpdated}
                />
            )}
            {detailsAnalysis && (
                <AnalysesDetailsDrawer
                    selectedAnalysis={detailsAnalysis}
                    baseId={baseId}
                    open={detailsAnalysis !== null}
                    onClose={() => setDetailsAnalysis(null)}
                />
            )}
            <div className={classes.footer} />
        </div>
    );
};

export default withErrorAnnouncer(Dashboard);
