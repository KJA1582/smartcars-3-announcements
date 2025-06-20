import axios from "axios";

export interface Aircraft {
    id: number;
    code: string;
    name: string;
    serviceCeiling: string;
    maximumPassengers: number;
    maximumCargo: number;
    minimumRank: number | null;
    registration: string | null;
}

export interface Airport {
    id: number;
    code: string;
    name: string;
    latitude: number;
    longitude: number;
}

export interface NavLogItem {
    ident: string;
    name: string;
    type: string;
    pos_lat: number;
    pos_long: number;
    altitude_feet: number;
    via_airway: string;
    is_sid_star: boolean;
    distance: number;
    planned_time_total: number;
    planned_fuel_totalused: number;
    actual_fuel_totalused: number | null;
    actual_time_total: number | null;
    skipped: boolean;
}

export interface FlightPlanData {
    guid: string | null;
    bidID: string | number;
    trackingId: string;
    pirepID: string | null;
    code: string;

    number: string;
    currentAircraft: Aircraft;
    departure: Airport;
    arrival: Airport;
    flightTime: number;
    departureTime: string;
    arrivalTime: string;
    network: string;
    cruise: number;
    route: string[];
    distance: number;
    type: string;

    // Simbrief only
    navlog?: NavLogItem[];
    estimatedFlightTime?: number;
    estimatedBlockBurn?: number;
}

export interface TrackingEvent {
    type?: string;
    eventId: string;
    eventElapsedTime: number;
    eventTimestamp: string;
    eventCondition: string;
    message: string;
}

export interface ComputedData {
    distanceFromDest: number;
    distanceFromDep: number;
    landingDistance: number;
    engineStatus: boolean;
    highestN1: number;
    diverted: boolean;
    cruiseAltitude: number;
    fuelFlow: number;
}

export interface TrackingData {
    simData: SC3FlightData;
    lastSimData: SC3FlightData;
    computedData: ComputedData;
    lastFlightPhase: string;
    currentFlightPhase: string;
    historyReport: SC3FlightData[];
    flightLog: TrackingEvent[];
    startTimestamp: number;
    remainingFlightTime: number;
    elapsedTime: number;
    elapsedFlightTime: number;
    blockTime: number;
    startingFuel: number;
    comments: string;
    initialLandingRate: number | null;
    simbrief?: {
        navlog: NavLogItem[];
    };
    simVersion: string;
    flightBackup: boolean;
    lastFrameTime: number;
    timeSinceLastFrame: number;
}

export interface CoreSettings {
    darkMode: boolean;
    flashWindow: boolean;
    playSound: boolean;
    weightUnits: string;
    altitudeUnits: string;
    landingDistanceUnits: string;
    discordRichPresence: boolean;
    showAdvancedSettings: boolean;
}

export interface ProSettings {
    abnormalFlightConditionsCausePause: boolean;
}

export interface FlightTrackingSettings {
    core: CoreSettings;
    pro: ProSettings;
    flight_tracking: {
        automatic_pirep_submission: boolean;
        tracking_provider: string;
        local_ip_address: string;
        local_port: number;
        x_plane_ip_address: string;
        x_plane_port: number;
        simconnect_ip_address: string;
        simconnect_port: number;
        show_vatsim_traffic: boolean;
        show_vatsim_atc_coverage: boolean;
        show_vatsim_fir_boundaries: boolean;
        show_ivao_traffic: boolean;
        show_pilotedge_traffic: boolean;
        pause_at_tod: boolean;
        map_provider: string;
        auto_start_tracking: boolean;
    };
    simbrief: {
        simbriefUsername: string;
        simbriefPreferredPlanFormat: string;
    };
}

export interface SC3FlightData {
    isXPlane: boolean;
    latitude: number;
    longitude: number;
    altitude: number;
    altitudeAgl: number;
    altitudeCalibrated: number;
    bank: number;
    heading: number;
    pitch: number;
    gs: number;
    gearControl: number;
    flapsControl: number;
    vs: number;
    tas: number;
    planeOnground: boolean;
    engine1Firing: boolean;
    engine2Firing: boolean;
    engine3Firing: boolean;
    engine4Firing: boolean;
    ias: number;
    aircraftEmptyWeight: number;
    zeroWeightPlusPayload: number;
    simulationRate: number;
    engine1N1: number;
    engine2N1: number;
    engine3N1: number;
    engine4N1: number;
    engine1N2: number;
    engine2N2: number;
    engine3N2: number;
    engine4N2: number;
    fuelTotalQuantityWeight: number;
    flapsRightPosition: number;
    flapsLeftPosition: number;
    transponderFreq: number;
    com1Freq: number;
    com1StandbyFreq: number;
    com2Freq: number;
    com2StandbyFreq: number;
    nav1Freq: number;
    nav1StandbyFreq: number;
    nav2Freq: number;
    nav2StandbyFreq: number;
    windDirection: number;
    windSpeed: number;
    pressureQNH: number;
    altimeterSettings: number;
    zuluMonthOfYear: number | null;
    zuluDayOfMonth: number | null;
    zuluYear: number | null;
    zuluHour: number | null;
    zuluMin: number | null;
    zuluSec: number | null;
    localYear: number | null;
    localMonthOfYear: number | null;
    localDayOfMonth: number | null;
    clockHour: number | null;
    clockMin: number | null;
    clockSec: number | null;
    enginesCount: number;
    overspeedWarning: boolean;
    stallWarning: boolean;
    pauseFlag: boolean;
    slewMode: boolean;
    simulatorVersion: number | string;
    isInMenu: number;
    aircraftType: string;
    gForce: number;
    landingRate: number | null;
    gForceTouchDown: number | null;
    crashed: boolean;

    elapsedTime?: number;
    elapsedFlightTime?: number;
    fuelWeight?: number;
    timestamp?: number;
}

export interface RecoverableFlight {
    guid: string;
    callsign: string;
    aircraftID: number;
    departure: string;
    arrival: string;
    cruise: number;
    route?: string;
    comments: string;
    remainingFlightTime: number;
    latitude: number;
    longitude: number;
    heading: number;
    gs: number;
    altitude: number;
    network: string;
    phase: string;
    bidID: number;
    uuid: string;
    elapsedTime: number;
    elapsedFlightTime: number;
    blockTime: number;
    profilerData: SC3FlightData[];
    flightLog: any[];
    startingFuel: number;
}

export interface FlightTrackingData {
    settings?: FlightTrackingSettings;
    trackingData?: TrackingData;
    flightPlanData?: FlightPlanData;
    trackingState: {
        status: string;
        message: string;
    };
    providerState: {
        status: string;
        simulatorName: string | null;
    };
    providerData: SC3FlightData | null;
    recoverableFlight: RecoverableFlight | null;
}

export default class FlightTrackingAPI {
    static async getFlightTrackingData(): Promise<FlightTrackingData> {
        const response = await axios.get(
            "http://localhost:7172/api/com.tfdidesign.flight-tracking/data",
        );
        return response.data;
    }
}
