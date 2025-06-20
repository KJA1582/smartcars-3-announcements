import fs from "fs";
import path from "path";
import LocalAPI from "./modules/local";
import FlightTrackingAPI from "./modules/flight-tracking";

let id: NodeJS.Timeout;
let lastFlightPhase: string | null = null;
let settings: AnnouncementsSettings | null = null;
let currentFile: string | null = null;
let flightTrackingInstalled = false;
let startTime = 0;

interface AnnouncementsSettings {
    playAnnouncements: boolean;
    playGpws: boolean;
}

const gpwsCallouts = [
    {
        callout: "2500",
        minAlt: 2450,
        maxAlt: 2550,
        played: false,
    },
    {
        callout: "1000",
        minAlt: 950,
        maxAlt: 1050,
        played: false,
    },
    {
        callout: "500",
        minAlt: 480,
        maxAlt: 520,
        played: false,
    },
    {
        callout: "400",
        minAlt: 380,
        maxAlt: 420,
        played: false,
    },
    {
        callout: "300",
        minAlt: 280,
        maxAlt: 320,
        played: false,
    },
    {
        callout: "200",
        minAlt: 180,
        maxAlt: 220,
        played: false,
    },
    {
        callout: "100",
        minAlt: 80,
        maxAlt: 120,
        played: false,
    },
    {
        callout: "50",
        minAlt: 40,
        maxAlt: 60,
        played: false,
    },
    {
        callout: "40",
        minAlt: 35,
        maxAlt: 45,
        played: false,
    },
    {
        callout: "30",
        minAlt: 25,
        maxAlt: 35,
        played: false,
    },
    {
        callout: "20",
        minAlt: 15,
        maxAlt: 25,
        played: false,
    },
    {
        callout: "10",
        minAlt: 5,
        maxAlt: 15,
        played: false,
    },
];
let callouts = gpwsCallouts;

function getAnnouncementTime(currentHour) {
    if (currentHour >= 0 && currentHour < 12) {
        return "morning";
    }
    if (currentHour >= 12 && currentHour < 18) {
        return "day";
    }
    return "evening";
}

async function processTrackingData() {
    flightTrackingInstalled = await LocalAPI.isPluginInstalled(
        "com.tfdidesign.flight-tracking",
    );

    if (flightTrackingInstalled !== true) {
        return;
    }

    try {
        const data = await FlightTrackingAPI.getFlightTrackingData();

        if (!data || !data.trackingData) {
            lastFlightPhase = null;
            settings = null;
            startTime = 0;
            callouts = gpwsCallouts;
            await LocalAPI.stopSound();
            return;
        }

        if (!settings) {
            settings = await LocalAPI.getPluginSettings(
                "com.tfdidesign.announcements",
            );
        }

        if (!startTime) {
            startTime = Date.now();
        }

        if (
            data &&
            data.trackingData &&
            data.trackingData.lastSimData &&
            data.trackingData.currentFlightPhase !== lastFlightPhase &&
            Date.now() - startTime > 20000
        ) {
            lastFlightPhase = data.trackingData.currentFlightPhase;

            if (lastFlightPhase && settings && settings.playAnnouncements) {
                const announcementTime = getAnnouncementTime(
                    data.trackingData.lastSimData.clockHour,
                );
                const filePath = path.join(
                    __dirname,
                    `./soundpacks/default/fa/${data.trackingData.currentFlightPhase.toLowerCase()}_${announcementTime}.wav`,
                );

                if (fs.existsSync(filePath)) {
                    LocalAPI.log(
                        `Playing announcement for ${lastFlightPhase.toLowerCase()}, ${announcementTime}`,
                        "info",
                    );

                    currentFile = filePath;

                    LocalAPI.playSound(
                        `http://localhost:7172/api/com.tfdidesign.announcements/current.wav?${Date.now()}`,
                    );
                }
            }
        }

        if (data && data.trackingData && settings && settings.playGpws) {
            callouts = callouts.map((callout) => {
                if (
                    data &&
                    data.trackingData &&
                    data.trackingData.lastSimData.vs < 0 &&
                    callout.played === false &&
                    callout.minAlt <=
                        data.trackingData.lastSimData.altitudeAgl &&
                    callout.maxAlt >= data.trackingData.lastSimData.altitudeAgl
                ) {
                    const filePath = path.join(
                        __dirname,
                        `./soundpacks/default/gpws/${callout.callout}.wav`,
                    );

                    if (fs.existsSync(filePath)) {
                        LocalAPI.log(
                            `Playing GPWS callout for ${callout.callout}`,
                            "info",
                        );

                        currentFile = filePath;

                        LocalAPI.playSound(
                            `http://localhost:7172/api/com.tfdidesign.announcements/current.wav?${Date.now()}`,
                        );
                    }
                    return {
                        ...callout,
                        played: true,
                    };
                }
                return callout;
            });
        }

        if (data.trackingData.lastSimData.altitudeAgl > 3000) {
            callouts = gpwsCallouts;
        }
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            // Ignore 404 errors as it could be that the core is not fully initialized yet
            return;
        }
    }
}

export = {
    onStart: async function () {
        currentFile = null;
        lastFlightPhase = null;
        flightTrackingInstalled = false;
        settings = null;
        startTime = 0;
        callouts = gpwsCallouts;
        id = setInterval(processTrackingData, 1000);
    },
    onEnd: function () {
        if (id) {
            clearInterval(id);
        }
    },
    onSettingsUpdate: async () => {
        try {
            settings = await LocalAPI.getPluginSettings(
                "com.tfdidesign.announcements",
            );
        } catch (error: any) {
            LocalAPI.log(`Failed to get settings: ${error.message}`, "error");
        }
    },
    routes: {
        get: {
            "current.wav": {
                description: "Endpoint to get the latest announcement file",
                handler: function (req, res) {
                    if (!currentFile) {
                        return res.status(404).send("Not found");
                    }
                    return res.sendFile(currentFile);
                },
            },
        },
    },
};
