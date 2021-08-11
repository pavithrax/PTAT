export class constant {
    // Command Message Constants
    public static GETTATFEATURE_CMD = "GetTatFeatures";
    public static GETTOOLINFO_CMD = "GetToolInfo";
    public static GETTARGETINFO_CMD = "GetTargetInfo";
    public static CHANGECONN_CMD = "ChangeConnection";
    public static CheckTargetStatus_CMD = "CheckTargetStatus";

    public static RemoveFromFavConnList_CMD = "RemoveFromFavConnList";
    public static AddToFavConnList_CMD = "AddToFavConnList";
    public static GetFavConnList_CMD = "GetFavConnList";
    
    public static VALIDATEGUID_CMD = "ValidateGUID";
    public static TATHOSTSERVICE_CMD = "IsTATHostService";
    public static GETSETTINGS_CMD = "GetSettings";
    public static SETAPPEVENTPROPERTIES_CMD = "SetAppEventProperties";
    public static TELEMETRYSETTINGS_CMD = "TelemetrySettings";
    public static SAVECUSTOMWRKSPC_CMD = "SaveCustomWorkspace";
    public static LOADWRKSPC_CMD = "LoadWorkspace";
    public static SAVEWRKSPC_CMD = "SaveWorkspace";
    public static SETSETTINGS_CMD = "SetSettings";
    public static CHANGETELEMETRYSTATUS_CMD  = "ChangeTelemetryStatus";
    public static GETCOMPONENTLIST_CMD  = "GetComponentList";
    public static TATFEATURESTATUS_CMD  = "getTatFeaturesStatus";
    public static GETFILESINDIR_CMD  = "GetFilesInDir";
    public static REMOVEMONITORLIST_CMD  = "RemoveFromMonitorList";
    public static SETTATFEATURESTATUS_CMD  ="setTatFeaturesStatus";
    public static GetMonitorData_CMD  = "GetMonitorData";
    public static GetControlData_CMD  = "GetControlData";
    public static GetUpdatedControlData_CMD  = "GetUpdatedControlData";
    public static GetWorkLoadData_CMD  = "GetWorkLoadData";
    public static StartMonitor_CMD  = "StartMonitor";
    public static StopMonitor_CMD  =  "StopMonitor";
    public static StartWorkload_CMD  = "StartWorkload";
    public static StopWorkload_CMD  = "StopWorkload";
    public static SetControl_CMD  = "SetControl"
    public static GetLogHeader_CMD  =  "GetLogHeader";
    public static StartLogging_CMD  =  "StartLogging";
    public static StopLogging_CMD  =  "StopLogging";
    public static GetSolverData_CMD = "GetSolverData";
    public static StartSolver_CMD = "StartSolver";
    public static SolverStatus_CMD = "SolverStatus";
    public static StopSolver_CMD = "StopSolver";
    public static ResetControl_CMD = "ResetControl";
    public static ResetWorkload_CMD = "ResetWorkload";
    public static GetComponentData_CMD = "GetComponentData";
    public static GetScriptData_CMD = "GetScriptData";
    public static ScriptCommandSelected_CMD = "ScriptCommandSelected";
    public static ScriptComponentSelected_CMD = "ScriptComponentSelected";
    public static ScriptArg1Selected_CMD = "ScriptArg1Selected";
    public static ScriptArg2Selected_CMD = "ScriptArg2Selected";
    public static ScriptArg3Selected_CMD = "ScriptArg3Selected";
    public static ScriptAddRow_CMD = "ScriptAddRow";
    public static ScriptRemoveRows_CMD = "ScriptRemoveRows";
    public static LOADSCRIPT_CMD = "LoadScript";
    public static SAVESCRIPT_CMD = "SaveScript";
    public static SCRIPTDRAGDROP_CMD = "ScriptRowsDragAndDrop";
    public static EXECUTESCRIPTS_CMD = "ExecuteScripts";
    public static ROWSTATUS_CMD = "RowStatus";
    public static SCRIPTCOMMANDLINESTATUS_CMD = "ScriptCommandLineStatus";
    public static SCRIPTSTATUS_CMD = "ScriptStatus";
    public static STOPSCRIPTS_CMD = "StopScripts";
    public static REMOVEFROMCUSTOMVIEWLIST_CMD = "RemoveFromCustomViewList";
    public static LoadCustomViewData_CMD = "LoadCustomViewData";
    public static GetParamType_CMD = "GetParamType";
    public static AddToAlertList_CMD = "AddToAlertList";
    public static UpdateAlertList_CMD = "UpdateAlertList";
    public static RemoveFromAlertList_CMD = "RemoveFromAlertList";
    
    public static StartAlert_CMD = "StartAlert";
    public static GetAlertFileName_CMD = "GetAlertFileName";
    public static AlertSummary_CMD = "AlertSummary";
    public static StopAlert_CMD = "StopAlert";
    public static LoadAlertsData_CMD = "LoadAlertsData";
    
    public static GetSupportedOfflineAnalysisList_CMD = "GetSupportedOfflineAnalysisList";
    public static LoadAnalysisFromFile_CMD = "LoadAnalysisFromFile";
    public static GetOfflineAnalysisResults_CMD = "GetOfflineAnalysisResults";
    public static GetTatLogAnalysisGraphData_CMD = "GetTatLogAnalysisGraphData";

    public static DisableWarnings_CMD = "DisableWarnings";
    public static startPowerVisualization_CMD = "startPowerVisualization";
    public static stopPowerVisualization_CMD = "stopPowerVisualization";

    public static GetParamVal_CMD = "GetParamVal";

    
    

    //Graphs
    public static GetGraphData_CMD = "GetGraphData";
    public static AddParamToGraph1_CMD = "AddParamToGraph1";
    // public static AddParamToGraph1_CMD = "AddParamToGraph";
    public static Graph1ComponentSelected_CMD = "Graph1ComponentSelected";
    public static Graph1Arg1Selected_CMD = "Graph1Arg1Selected";
    public static Graph1Arg2Selected_CMD = "Graph1Arg2Selected";
    // public static StartGraph1_CMD = "StartGraph";
    public static StartGraph1_CMD = "StartGraph1";
    public static RemoveParamFromGraph1_CMD = "RemoveParamFromGraph1";
    // public static PlayGraph1_CMD = "PlayGraph";
    public static PlayGraph1_CMD = "PlayGraph1";
    public static StopGraph1_CMD = "StopGraph1";
    public static GetGraphPoints_CMD = "GetGraphPoints";

    public static LoadGraph2File_CMD = "LoadGraph2File";
    public static GetGraph2Details_CMD = "GetGraph2Details";
    public static AddParamToGraph2_CMD = "AddParamToGraph2";
    public static RemoveParamFromGraph2_CMD = "RemoveParamFromGraph2";
    public static StartGraph2_CMD = "StartGraph2";
    public static StopGraph2_CMD  = "StopGraph2";
    public static GetCastro_CMD  = "GetCastroCoveConfig";
    public static SetCastro_CMD  = "SetCastroCoveConfig";
    public static GetWarrenco_CMD  = "GetWarrenCoveConfig";
    public static SetWarrenco_CMD  = "SetWarrenCoveConfig";

    // Success Message Constant
    public static SUCCESS_MSG = "success";
    // Failure Message Constant
    public static FAILED_MSG = "Failed";
    
    // Error Message
    public static DISCONNECT = "User disconnected";


    //Server Monitor
    
    public static StartServerMonitor_CMD  = "StartMonitor";
    public static StopStopMonitor_CMD  =  "StopMonitor";
}