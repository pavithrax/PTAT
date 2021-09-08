import { Injectable, EventEmitter } from '@angular/core';
import { constant } from '../constants/constant';
import { Subject, Observable} from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private ws: any;
  public isConn$: Subject<any>;
  public isTatConn$: Subject<any>;
  public changeConn$: Subject<any>;
  public validateGuid$: Subject<any>;
  public isGetTatFeature$: Subject<any>;
  public targetInfo$: Subject<any>;
  public toolInfo$: Subject<any>;
  public getSettings$: Subject<any>;
  public setAppEventProp$: Subject<any>;
  public telemetrySettings$: Subject<any>;
  public saveCustomWrkspc$: Subject<any>;
  public loadWrkspc$: Subject<any>;
  public saveWrkspc$: Subject<any>;
  public changeTelemetryStatus$: Subject<any>;
  public setSettings$: Subject<any>;
  public getComponentList$: Subject<any>;
  public getTatFeatureStatus$: Subject<any>;
  public getFilesInDir$: Subject<any>;
  public removeFromMonitorList$: Subject<any>;
  public isError$: Subject<any>;
  public isSetTatStatusRes$: Subject<any>;
  public errorSetSettingsRes$: Subject<any>;
  public errorTelemetryStatus$: Subject<any>;
  public isgetMonitorDataRes$: Subject<any>;
  public isgetControlDataRes$: Subject<any>;
  public isUpdatedControlDataRes$: Subject<any>;
  public isWorkLoadDataRes$: Subject<any>;
  public isStartWorkloadDataRes$: Subject<any>;
  public isStopWorkloadRes$ : Subject<any>;  
  public isSetControlRes$ : Subject<any>;
  public isStartMonitorRes$: Subject<any>;
  public isStopMonitorRes$: Subject<any>;
  public isGetLogHeaderRes$: Subject<any>;
  public isGetLogHeaderServerRes$: Subject<any>;
  public isStartLoggingRes$: Subject<any>;
  public isStopLoggingRes$: Subject<any>;
  public isGetSolverDataRes$: Subject<any>;
  public isStartSolverRes$: Subject<any>;
  public isSolverStatusRes$: Subject<any>;
  public isStopSolverRes$: Subject<any>;
  public isResetControlRes$: Subject<any>;
  public isResetWorkloadRes$: Subject<any>;
  public isGetComponentDataRes$: Subject<any>;
  public isGetScriptDataRes$: Subject<any>;
  public isScriptCommandSelectedRes$: Subject<any>;
  public isScriptComponentSelectedRes$: Subject<any>;
  public isScriptArg1SelectedRes$: Subject<any>;
  public isScriptArg2SelectedRes$: Subject<any>;
  public isScriptArg3SelectedRes$: Subject<any>;
  public isScriptAddRowRes$: Subject<any>;
  public isScriptRemoveRowsRes$: Subject<any>;
  public isLoadScriptRes$: Subject<any>;
  public isSaveScriptRes$: Subject<any>;
  public isScriptDragDropRes$: Subject<any>;
  public isExecuteSuccRes$: Subject<any>;
  public isExecuteErrRes$: Subject<any>;
  public isRowStatus$: Subject<any>;
  public isCommandLineStatus$: Subject<any>;
  public isStopScript$: Subject<any>;
  public isScriptStatus$: Subject<any>;
  public isRemoveFromCustomViewListRes$: Subject<any>;
  public isLoadCustomViewData$: Subject<any>;
  public isGetParamType$: Subject<any>;
  public isAddToAlertList$: Subject<any>;
  public isUpdateAlertList$: Subject<any>;
  public isRemoveFromAlertList$: Subject<any>;
  public isStartAlert$: Subject<any>;
  public isGetAlertFileName$: Subject<any>;
  public isAlertSummary$: Subject<any>;
  public isStopAlert$: Subject<any>;
  public isLoadAlertsData$: Subject<any>;
  public isGetSupportedOfflineAnalysisList$: Subject<any>;
  public isLoadAnalysisFromFile$: Subject<any>;
  public isGetOfflineAnalysisResults$: Subject<any>;
  public isGetTatLogAnalysisGraphData$: Subject<any>;
  public isGetGraphData$: Subject<any>;
  public isLoadGraph2File$: Subject<any>;
  public isGetGraph2Details$: Subject<any>;
  public isAddParamToGraph2$: Subject<any>;
  public isRemoveParamFromGraph2$: Subject<any>;
  public isStartGraph2$: Subject<any>;
  public isStopGraph2$: Subject<any>;
  public isAddParamToGraph1$: Subject<any>;
  public isGraph1ComponentSelected$: Subject<any>;
  public isGraph1Arg1Selected$: Subject<any>;
  public isGraph1Arg2Selected$: Subject<any>;
  public isStartGraph1$: Subject<any>;
  public isRemoveParamFromGraph1$: Subject<any>;
  public isPlayGraph1$: Subject<any>;
  public isStopGraph1$: Subject<any>;
  public isGetGraphPoints$: Subject<any>;
  public ishostNotConnected$: Subject<any>;
  public ishostDisconnected$: Subject<any>;
  public portNumber = 49861;
  public isCastroCoveConfig$: Subject<any>;
  public isWarrenCoveConfig$: Subject<any>;
  public isSetWarrenCoveConfig$: Subject<any>;
  public isSetCastroCoveConfig$: Subject<any>;
  public isChangeConnection$: Subject<any>;
  public isCheckTargetStatus$: Subject<any>;
  public ishideSpinner$: Subject<any>;
  public isRemoveFromFavConnList$: Subject<any>;
  public isAddToFavConnList$: Subject<any>;
  public isGetFavConnList$: Subject<any>;
  public isstartPowerVisualization$: Subject<any>;
  public isstopPowerVisualization$: Subject<any>;
  public getParamVal$: Subject<any>;

  
  public isStartServerMonitorRes$: Subject<any>;
  public isStopServerMonitorRes$: Subject<any>;
  
  targetStatus:any = 0;
  
  static send(cmd: any) {
  }
  constructor() {
    this.isConn$ = new Subject<any>();
    this.isTatConn$ = new Subject<any>();
    this.isGetTatFeature$ = new Subject<any>();
    this.validateGuid$ = new Subject<any>();
    this.changeConn$ = new Subject<any>();
    this.targetInfo$ = new Subject<any>();
    this.toolInfo$ = new Subject<any>();
    this.getSettings$ = new Subject<any>();
    this.setAppEventProp$ = new Subject<any>();
    this.telemetrySettings$ = new Subject<any>();
    this.saveCustomWrkspc$ = new Subject<any>();
    this.loadWrkspc$ = new Subject<any>();
    this.saveWrkspc$ = new Subject<any>();
    this.changeTelemetryStatus$ = new Subject<any>();
    this.setSettings$ = new Subject<any>();
    this.getComponentList$ = new Subject<any>();
    this.getTatFeatureStatus$ = new Subject<any>();
    this.getFilesInDir$ = new Subject<any>();
    this.removeFromMonitorList$ = new Subject<any>();
    this.isError$ = new Subject<any>();
    this.isSetTatStatusRes$ = new Subject<any>();
    this.errorSetSettingsRes$ = new Subject<any>();
    this.errorTelemetryStatus$ = new Subject<any>();
    this.isgetMonitorDataRes$ = new Subject<any>();
    this.isgetControlDataRes$ = new Subject<any>();
    this.isUpdatedControlDataRes$ = new Subject<any>();
    this.isWorkLoadDataRes$ = new Subject<any>(); 
    this.isStartMonitorRes$ = new Subject<any>();
    this.isStopMonitorRes$ = new Subject<any>();
    this.isGetLogHeaderRes$ = new Subject<any>();
    this.isGetLogHeaderServerRes$ = new Subject<any>();
    this.isStartLoggingRes$ = new Subject<any>();
    this.isStopLoggingRes$ = new Subject<any>();
    this.isStartWorkloadDataRes$ = new Subject<any>(); 
    this.isStopWorkloadRes$ = new Subject<any>();
    this.isSetControlRes$ = new Subject<any>();
    this.isGetSolverDataRes$ = new Subject<any>();
    this.isStartSolverRes$ = new Subject<any>(); 
    this.isSolverStatusRes$ = new Subject<any>();
    this.isStopSolverRes$ = new Subject<any>();
    this.isResetControlRes$ = new Subject<any>();
    this.isResetWorkloadRes$ = new Subject<any>();
    this.isGetComponentDataRes$ = new Subject<any>();
    this.isGetScriptDataRes$ = new Subject<any>();
    this.isScriptCommandSelectedRes$ = new Subject<any>();
    this.isScriptComponentSelectedRes$ = new Subject<any>();
    this.isScriptArg1SelectedRes$ = new Subject<any>();
    this.isScriptArg2SelectedRes$ = new Subject<any>();
    this.isScriptArg3SelectedRes$ = new Subject<any>();
    this.isScriptAddRowRes$ = new Subject<any>();    
    this.isScriptRemoveRowsRes$ = new Subject<any>();  
    this.isLoadScriptRes$ = new Subject<any>();  
    this.isSaveScriptRes$ = new Subject<any>();
    this.isScriptDragDropRes$ = new Subject<any>();
    this.isExecuteSuccRes$ = new Subject<any>();
    this.isExecuteErrRes$ = new Subject<any>();
    this.isRowStatus$ = new Subject<any>();
    this.isCommandLineStatus$ = new Subject<any>();
    this.isStopScript$ = new Subject<any>();
    this.isScriptStatus$ = new Subject<any>();
    this.isRemoveFromCustomViewListRes$ = new Subject<any>();
    this.isLoadCustomViewData$ = new Subject<any>();
    this.isGetParamType$ = new Subject<any>();
    this.isAddToAlertList$ = new Subject<any>();
    this.isUpdateAlertList$ = new Subject<any>();
    this.isRemoveFromAlertList$ = new Subject<any>();
    this.isStartAlert$ = new Subject<any>();
    this.isGetAlertFileName$ = new Subject<any>();
    this.isAlertSummary$ = new Subject<any>();
    this.isStopAlert$ = new Subject<any>();
    this.isLoadAlertsData$ = new Subject<any>();
    this.isGetSupportedOfflineAnalysisList$ = new Subject<any>();
    this.isLoadAnalysisFromFile$ = new Subject<any>();
    this.isGetOfflineAnalysisResults$ = new Subject<any>();
    this.isGetTatLogAnalysisGraphData$ = new Subject<any>();
    this.isGetGraphData$ = new Subject<any>();
    this.isLoadGraph2File$= new Subject<any>();
    this.isGetGraph2Details$= new Subject<any>();
    this.isAddParamToGraph2$= new Subject<any>();
    this.isRemoveParamFromGraph2$= new Subject<any>();
    this.isStartGraph2$= new Subject<any>();
    this.isStopGraph2$= new Subject<any>();
    this.isAddParamToGraph1$= new Subject<any>();
    this.isGraph1ComponentSelected$= new Subject<any>();
    this.isGraph1Arg1Selected$= new Subject<any>();
    this.isGraph1Arg2Selected$= new Subject<any>();
    this.isStartGraph1$= new Subject<any>();
    this.isRemoveParamFromGraph1$= new Subject<any>();
    this.isPlayGraph1$= new Subject<any>();
    this.isStopGraph1$= new Subject<any>();
    this.isGetGraphPoints$= new Subject<any>();
    this.ishostNotConnected$= new Subject<any>();
    this.ishostDisconnected$= new Subject<any>();
    this.isCastroCoveConfig$= new Subject<any>();
    this.isWarrenCoveConfig$= new Subject<any>();
    this.isSetWarrenCoveConfig$= new Subject<any>();
    this.isSetCastroCoveConfig$= new Subject<any>();

    this.isChangeConnection$= new Subject<any>();
    this.isCheckTargetStatus$= new Subject<any>();
    this.ishideSpinner$= new Subject<any>();
    this.isRemoveFromFavConnList$= new Subject<any>();
    this.isAddToFavConnList$= new Subject<any>();
    this.isGetFavConnList$= new Subject<any>(); 
    this.isstartPowerVisualization$= new Subject<any>(); 
    this.isstopPowerVisualization$= new Subject<any>();   
    this.getParamVal$ = new Subject<any>();

    
    this.isStartServerMonitorRes$ = new Subject<any>();
    this.isStopServerMonitorRes$ = new Subject<any>();
    
  }
 

  public createObservableSocket(portNumber): Observable<any> {
    if(!this.ws){
      var Url = "ws://localhost:" + portNumber + "/echo";
      this.ws = new WebSocket(Url);
      return new Observable(
        observer => {
          this.ws.onmessage = (event) => observer.next(event.data);
          this.ws.onerror = (event) => observer.error(event);
          this.ws.onclose = (event) => observer.complete();
          this.ws.onopen = (event) => observer.next(event);

          return () => this.ws.close(1000, constant.DISCONNECT);
        }
      );
      }else{
        var Url = "ws://localhost:" + portNumber + "/echo";
        this.ws = WebSocket;
        this.ws = new WebSocket(Url);
        return new Observable(
          observer => {
            this.ws.onmessage = (event) => observer.next(event.data);
            this.ws.onerror = (event) => observer.error(event);
            this.ws.onclose = (event) => observer.complete();
            this.ws.onopen = (event) => observer.next(event);
  
            return () => this.ws.close(1000, constant.DISCONNECT);
          }
        );
      }
  }
  public webSocketResponse(portNumber):void{
    this.createObservableSocket(portNumber)
      .subscribe(
        (data) => {
          if(data.type == 'open'){
            // console.log("Web Connection Established");
            this.isConn$.next(1);
          }else{
            console.log(data);
            this.receiveMessage(JSON.parse(data));
          }
        },
        (errorEvent) => {
          // console.log("error" , errorEvent);
          // console.log("host closed while loading");
          var data = "host closed while loading"
          this.alternatePortConnectionHandling(portNumber);
          this.ishostNotConnected$.next(data);
          this.ishostDisconnected$.next(data);
        },
        () => {
          this.isConn$.next(0);
          // console.log("host closed in between");
          var data = "host closed in between"
          this.ishostDisconnected$.next(data);
        }
      );
  }

  alternatePortConnectionHandling(portNumber){
    if(portNumber == 49861){
      this.webSocketResponse(49861);
    }else if(portNumber == 49862){
      this.webSocketResponse(49863);
    }else if(portNumber == 49863){
      this.webSocketResponse(49864);
    }else if(portNumber == 49864){
      this.webSocketResponse(49865);
    }else if(portNumber == 49865){
      this.webSocketResponse(49866);
    }
  }


  public checkSocketConn(): Observable<any> {
    return new Observable(
      observer => {
        //console.log("checkSocketConn called");
        if(this.ws.readyState == 1) {
          observer.next();
        } else if(this.ws.readyState == 2 || this.ws.readyState == 3) {
          console.log("Check Socket Conn : ", false);
          console.log("connection disconnected");
        } else {
          this.isConn$.subscribe(
            (data) => observer.next()
          );
        }
        return;
      });
  }

  public sendMessage(message:string): void {
    console.log("sending Command", message);
    if(this.ws.readyState == 1) {
      this.ws.send(message);
    }else{
      this.ishideSpinner$.next('3');
      // if(this.targetStatus == 1){
      //   this.ishideSpinner$.next(this.targetStatus);
      // }else{
      //   this.ishideSpinner$.next('3');
      // }
    }
  }

  

  receiveMessage(data: any): void {
    //console.log(JSON.stringify(data)); 
    // check if data exists
    if (data) {
      if (data.CommandStatus.Status.toLowerCase() == constant.SUCCESS_MSG) {
        if (data.Command == constant.TATHOSTSERVICE_CMD) {
          this.isTatConn$.next(data.Data);
        }
        else if (data.Command == constant.GETTOOLINFO_CMD) {
          this.toolInfo$.next(data.Data);
        }
        else if (data.Command == constant.CHANGECONN_CMD) {
          this.changeConn$.next(data);
          this.targetStatus = 0;
        }else if (data.Command == constant.CheckTargetStatus_CMD) {
          this.isCheckTargetStatus$.next(data.Data);
        }
        else if (data.Command == constant.VALIDATEGUID_CMD) {
          this.validateGuid$.next(data);
        }
        else if (data.Command == constant.GETTARGETINFO_CMD) {
          this.targetInfo$.next(data.Data);
        }
        else if (data.Command == constant.GETTATFEATURE_CMD) {
          this.isGetTatFeature$.next(data.Data);
        }
        else if (data.Command == constant.GETSETTINGS_CMD) {
          this.getSettings$.next(data.Data);
        }   
        else if (data.Command == constant.SETAPPEVENTPROPERTIES_CMD) {
           this.setAppEventProp$.next(data);
         }
        else if (data.Command == constant.TELEMETRYSETTINGS_CMD) {
           this.telemetrySettings$.next(data);
         }
        else if (data.Command == constant.SAVECUSTOMWRKSPC_CMD) {
           this.saveCustomWrkspc$.next(data.Data);
         }
        else if (data.Command == constant.LOADWRKSPC_CMD) {
           this.loadWrkspc$.next(data);
         }
         else if (data.Command == constant.SAVEWRKSPC_CMD) {
           this.saveWrkspc$.next(data.Data);
         }
         else if (data.Command == constant.CHANGETELEMETRYSTATUS_CMD) {
          this.changeTelemetryStatus$.next(data);
        }
        else if (data.Command == constant.SETSETTINGS_CMD) {
          this.setSettings$.next(data);
        }
        else if (data.Command == constant.GETCOMPONENTLIST_CMD) {
          this.getComponentList$.next(data.Data);
        }
        else if (data.Command == constant.TATFEATURESTATUS_CMD) {
          this.getTatFeatureStatus$.next(data);
        }
        else if (data.Command == constant.GETFILESINDIR_CMD) {
          this.getFilesInDir$.next(data);
        }
        else if (data.Command == constant.REMOVEMONITORLIST_CMD) { 
          this.removeFromMonitorList$.next(data);
        }
        else if (data.Command == constant.SETTATFEATURESTATUS_CMD) {
          this.isSetTatStatusRes$.next(data);
        } else if (data.Command == constant.GetMonitorData_CMD){
          this.isgetMonitorDataRes$.next(data);
        }else if (data.Command == constant.GetControlData_CMD){
          this.isgetControlDataRes$.next(data);
        }else if (data.Command == constant.GetUpdatedControlData_CMD){
          this.isUpdatedControlDataRes$.next(data); 
        }else if (data.Command == constant.GetWorkLoadData_CMD){
          this.isWorkLoadDataRes$.next(data);     
        }else if(data.Command == constant.StartMonitor_CMD){
          this.isStartMonitorRes$.next(data);
        }else if(data.Command == constant.StopMonitor_CMD){
          this.isStopMonitorRes$.next(data);
        }else if(data.Command == constant.GetLogHeader_CMD){
          this.isGetLogHeaderRes$.next(data);
        }else if(data.Command == constant.GetLogHeaderServer_CMD){
          this.isGetLogHeaderServerRes$.next(data);
        }else if(data.Command == constant.StartLogging_CMD){
          this.isStartLoggingRes$.next(data);
        }else if(data.Command == constant.StopLogging_CMD){
          this.isStopLoggingRes$.next(data); 
        }else if(data.Command == constant.StartWorkload_CMD){
          this.isStartWorkloadDataRes$.next(data);
        }else if(data.Command == constant.StopWorkload_CMD){
          this.isStopWorkloadRes$.next(data);
        }else if(data.Command == constant.SetControl_CMD){
          this.isSetControlRes$.next(data);
        }else if(data.Command == constant.GetSolverData_CMD){
          this.isGetSolverDataRes$.next(data);
        }else if(data.Command == constant.StartSolver_CMD){
          this.isStartSolverRes$.next(data);
        }else if(data.Command == constant.SolverStatus_CMD){
          this.isSolverStatusRes$.next(data);
        }else if(data.Command == constant.StopSolver_CMD){
          this.isStopSolverRes$.next(data);
        }else if(data.Command == constant.ResetControl_CMD){
          this.isResetControlRes$.next(data);
        }else if(data.Command == constant.ResetWorkload_CMD){
          this.isResetWorkloadRes$.next(data);
	      }else if(data.Command == constant.GetComponentData_CMD){
          this.isGetComponentDataRes$.next(data);
        }else if(data.Command == constant.GetScriptData_CMD){
          this.isGetScriptDataRes$.next(data);
        }else if(data.Command == constant.ScriptComponentSelected_CMD){
          this.isScriptComponentSelectedRes$.next(data);
        }else if(data.Command == constant.ScriptArg1Selected_CMD){
          this.isScriptArg1SelectedRes$.next(data);
        }else if(data.Command == constant.ScriptArg2Selected_CMD){
          this.isScriptArg2SelectedRes$.next(data);
        }else if(data.Command == constant.ScriptArg3Selected_CMD){
          this.isScriptArg3SelectedRes$.next(data);
        }else if(data.Command == constant.ScriptCommandSelected_CMD){
          this.isScriptCommandSelectedRes$.next(data);
        }else if(data.Command == constant.ScriptAddRow_CMD){
          this.isScriptAddRowRes$.next(data);
        }else if(data.Command == constant.ScriptRemoveRows_CMD){
          this.isScriptRemoveRowsRes$.next(data);
        }
        else if(data.Command == constant.LOADSCRIPT_CMD){
          this.isLoadScriptRes$.next(data);
        }
        else if(data.Command == constant.SAVESCRIPT_CMD){
          this.isSaveScriptRes$.next(data);
        }
        else if(data.Command == constant.SCRIPTDRAGDROP_CMD){
          this.isScriptDragDropRes$.next(data);
        }
        else if(data.Command == constant.EXECUTESCRIPTS_CMD){
          this.isExecuteSuccRes$.next(data);
        }
        else if(data.Command == constant.ROWSTATUS_CMD){
          this.isRowStatus$.next(data);
        }
        else if(data.Command == constant.STOPSCRIPTS_CMD){
          this.isStopScript$.next(data);
        }  
        else if(data.Command == constant.SCRIPTCOMMANDLINESTATUS_CMD){
          this.isCommandLineStatus$.next(data);
        } 
        else if(data.Command == constant.SCRIPTSTATUS_CMD){
          this.isScriptStatus$.next(data);
        }else if(data.Command == constant.LoadCustomViewData_CMD){
          this.isLoadCustomViewData$.next(data);
        }else if(data.Command == constant.REMOVEFROMCUSTOMVIEWLIST_CMD){
          this.isRemoveFromCustomViewListRes$.next(data);
        }else if(data.Command == constant.GetParamType_CMD){
          this.isGetParamType$.next(data);
        }else if(data.Command == constant.AddToAlertList_CMD){
          this.isAddToAlertList$.next(data);
        }else if(data.Command == constant.UpdateAlertList_CMD){
          this.isUpdateAlertList$.next(data);
        }else if (data.Command == constant.RemoveFromAlertList_CMD){
          this.isRemoveFromAlertList$.next(data);
        }else if (data.Command == constant.StartAlert_CMD){
          this.isStartAlert$.next(data);
        }else if (data.Command == constant.GetAlertFileName_CMD){
          this.isGetAlertFileName$.next(data);
        }else if (data.Command == constant.AlertSummary_CMD){
          this.isAlertSummary$.next(data);
        }else if (data.Command == constant.StopAlert_CMD){
          this.isStopAlert$.next(data);
        }else if (data.Command == constant.LoadAlertsData_CMD){
          this.isLoadAlertsData$.next(data);
        }else if (data.Command == constant.GetSupportedOfflineAnalysisList_CMD){
          this.isGetSupportedOfflineAnalysisList$.next(data);
        }else if (data.Command == constant.LoadAnalysisFromFile_CMD){
          this.isLoadAnalysisFromFile$.next(data);
        }else if (data.Command == constant.GetOfflineAnalysisResults_CMD){
          this.isGetOfflineAnalysisResults$.next(data);
        }else if (data.Command == constant.GetTatLogAnalysisGraphData_CMD){
          this.isGetTatLogAnalysisGraphData$.next(data);
        }else if (data.Command == constant.GetGraphData_CMD){
          this.isGetGraphData$.next(data);
        }else if (data.Command == constant.LoadGraph2File_CMD){
          this.isLoadGraph2File$.next(data);
        }else if (data.Command == constant.GetGraph2Details_CMD){
          this.isGetGraph2Details$.next(data);
        }else if (data.Command == constant.AddParamToGraph2_CMD){
          this.isAddParamToGraph2$.next(data);
        }else if (data.Command == constant.RemoveParamFromGraph2_CMD){
          this.isRemoveParamFromGraph2$.next(data);
        }else if (data.Command == constant.StartGraph2_CMD){
          this.isStartGraph2$.next(data);
        }else if (data.Command == constant.StopGraph2_CMD){
          this.isStopGraph2$.next(data);
        }else if (data.Command == constant.AddParamToGraph1_CMD){
          this.isAddParamToGraph1$.next(data);
        }else if (data.Command == constant.Graph1ComponentSelected_CMD){
          this.isGraph1ComponentSelected$.next(data);
        }else if (data.Command == constant.Graph1Arg1Selected_CMD){
          this.isGraph1Arg1Selected$.next(data);
        }else if (data.Command == constant.Graph1Arg2Selected_CMD){
          this.isGraph1Arg2Selected$.next(data);
        }else if (data.Command == constant.StartGraph1_CMD){
          this.isStartGraph1$.next(data);
        }else if (data.Command == constant.RemoveParamFromGraph1_CMD){
          this.isRemoveParamFromGraph1$.next(data);
        }else if (data.Command == constant.PlayGraph1_CMD){
          this.isPlayGraph1$.next(data);
        }else if (data.Command == constant.StopGraph1_CMD){
          this.isStopGraph1$.next(data);
        }else if (data.Command == constant.GetGraphPoints_CMD){
          this.isGetGraphPoints$.next(data);
        }else if (data.Command == constant.GetCastro_CMD){
          this.isCastroCoveConfig$.next(data);
        }else if (data.Command == constant.GetWarrenco_CMD){
          this.isWarrenCoveConfig$.next(data);
        }else if(data.Command == constant.SetCastro_CMD){
          this.isSetCastroCoveConfig$.next(data);
        }else if(data.Command == constant.SetWarrenco_CMD){
          this.isSetWarrenCoveConfig$.next(data);
        }else if (data.Command == constant.RemoveFromFavConnList_CMD){
          this.isRemoveFromFavConnList$.next(data);
        }else if (data.Command == constant.AddToFavConnList_CMD){
          this.isAddToFavConnList$.next(data);
        }else if (data.Command == constant.GetFavConnList_CMD){
          this.isGetFavConnList$.next(data);
        }else if (data.Command == constant.startPowerVisualization_CMD){
          this.isstartPowerVisualization$.next(data);
        }else if (data.Command == constant.stopPowerVisualization_CMD){
          this.isstopPowerVisualization$.next(data);
        }else if (data.Command == constant.GetParamVal_CMD){
          this.getParamVal$.next(data);
        }else if(data.Command == constant.StartServerMonitor_CMD){
          this.isStartServerMonitorRes$.next(data);
        }else if(data.Command == constant.StopStopMonitor_CMD){
          this.isStopServerMonitorRes$.next(data);
        }
      }
      else {
        if (data.Command == constant.TATHOSTSERVICE_CMD) {
          this.isTatConn$.next(data.Data);
        }
        else if (data.Command == constant.GETTOOLINFO_CMD) {
          this.isError$.next(data);
        }
        else if (data.Command == constant.CHANGECONN_CMD) {
          this.isChangeConnection$.next(data);
          this.targetStatus = 1;   
        }else if (data.Command == constant.CheckTargetStatus_CMD) {
          this.isCheckTargetStatus$.next(data);
          this.targetStatus = 1;
        }
        else if (data.Command == constant.VALIDATEGUID_CMD) {
          this.isError$.next(data);
        }
        else if (data.Command == constant.GETTARGETINFO_CMD) {
          this.isError$.next(data);
        }
        else if (data.Command == constant.GETTATFEATURE_CMD) {
          this.isError$.next(data);
        }
       else if (data.Command == constant.GETSETTINGS_CMD) {
          this.isError$.next(data);
        }  
        else if (data.Command == constant.SETAPPEVENTPROPERTIES_CMD) {
          this.isError$.next(data);
         }
        else if (data.Command == constant.TELEMETRYSETTINGS_CMD) {
           this.telemetrySettings$.next(data);
         }
        else if (data.Command == constant.SAVECUSTOMWRKSPC_CMD) {
           this.saveCustomWrkspc$.next(data.Data);
         }
        else if (data.Command == constant.LOADWRKSPC_CMD) {
           this.loadWrkspc$.next(data);
         }
         else if (data.Command == constant.SAVEWRKSPC_CMD) {
           this.saveWrkspc$.next(data.Data);
         }
         else if (data.Command == constant.CHANGETELEMETRYSTATUS_CMD) {
          this.changeTelemetryStatus$.next(data);
        }
        else if (data.Command == constant.SETSETTINGS_CMD) {
          this.errorSetSettingsRes$.next(data);
        }
        else if (data.Command == constant.GETCOMPONENTLIST_CMD) {
          this.getComponentList$.next(data.Data);
        }
        else if (data.Command == constant.TATFEATURESTATUS_CMD) {
          this.getTatFeatureStatus$.next(data);
        }
        else if (data.Command == constant.GETFILESINDIR_CMD) {
          this.getFilesInDir$.next(data);
        }else if (data.Command == constant.SETTATFEATURESTATUS_CMD) {
          this.isSetTatStatusRes$.next(data);
        }
        else if (data.Command == constant.REMOVEMONITORLIST_CMD) {
          this.removeFromMonitorList$.next(data.Data);
        }
        else if(data.Command == constant.EXECUTESCRIPTS_CMD){
          this.isExecuteErrRes$.next(data);
        }else if(data.Command == constant.AddToAlertList_CMD){
          this.isAddToAlertList$.next(data);
        }else if(data.Command == constant.UpdateAlertList_CMD){
          this.isUpdateAlertList$.next(data);
        }else if (data.Command == constant.RemoveFromAlertList_CMD){
          this.isRemoveFromAlertList$.next(data);
        }else if (data.Command == constant.StartAlert_CMD){
          this.isStartAlert$.next(data);
        }else if (data.Command == constant.GetAlertFileName_CMD){
          this.isGetAlertFileName$.next(data);
        }else if (data.Command == constant.AlertSummary_CMD){
          this.isAlertSummary$.next(data);
        }else if (data.Command == constant.StopAlert_CMD){
          this.isStopAlert$.next(data);
        }else if (data.Command == constant.LoadAlertsData_CMD){
          this.isLoadAlertsData$.next(data);
        }else if (data.Command == constant.GetSupportedOfflineAnalysisList_CMD){
          this.isGetSupportedOfflineAnalysisList$.next(data);
        }else if (data.Command == constant.LoadAnalysisFromFile_CMD){
          this.isLoadAnalysisFromFile$.next(data);
        }else if (data.Command == constant.GetOfflineAnalysisResults_CMD){
          this.isGetOfflineAnalysisResults$.next(data);
        }else if (data.Command == constant.GetTatLogAnalysisGraphData_CMD){
          this.isGetTatLogAnalysisGraphData$.next(data);
        }else if (data.Command == constant.GetGraphData_CMD){
          this.isGetGraphData$.next(data);
        }else if (data.Command == constant.LoadGraph2File_CMD){
          this.isLoadGraph2File$.next(data);
        }else if (data.Command == constant.GetGraph2Details_CMD){
          this.isGetGraph2Details$.next(data);
        }else if (data.Command == constant.AddParamToGraph2_CMD){
          this.isAddParamToGraph2$.next(data);
        }else if (data.Command == constant.RemoveParamFromGraph2_CMD){
          this.isRemoveParamFromGraph2$.next(data);
        }else if (data.Command == constant.StartGraph2_CMD){
          this.isStartGraph2$.next(data);
        }else if (data.Command == constant.StopGraph2_CMD){
          this.isStopGraph2$.next(data);
        }else if (data.Command == constant.AddParamToGraph1_CMD){
          this.isAddParamToGraph1$.next(data);
        }else if (data.Command == constant.Graph1ComponentSelected_CMD){
          this.isGraph1ComponentSelected$.next(data);
        }else if (data.Command == constant.Graph1Arg1Selected_CMD){
          this.isGraph1Arg1Selected$.next(data);
        }else if (data.Command == constant.Graph1Arg2Selected_CMD){
          this.isGraph1Arg2Selected$.next(data);
        }else if (data.Command == constant.StartGraph1_CMD){
          this.isStartGraph1$.next(data);
        }else if (data.Command == constant.RemoveParamFromGraph1_CMD){
          this.isRemoveParamFromGraph1$.next(data);
        }else if (data.Command == constant.PlayGraph1_CMD){
          this.isPlayGraph1$.next(data);
        }else if (data.Command == constant.StopGraph1_CMD){
          this.isStopGraph1$.next(data);
        }else if (data.Command == constant.GetGraphPoints_CMD){
          this.isGetGraphPoints$.next(data);
        }else if (data.Command == constant.GetCastro_CMD){
          this.isCastroCoveConfig$.next(data);
        }else if (data.Command == constant.GetWarrenco_CMD){
          this.isWarrenCoveConfig$.next(data);
        }else if(data.Command == constant.SetCastro_CMD){
          this.isSetCastroCoveConfig$.next(data);
        }else if(data.Command == constant.SetWarrenco_CMD){
          this.isSetWarrenCoveConfig$.next(data);
        }else if (data.Command == constant.RemoveFromFavConnList_CMD){
          //this.isRemoveFromFavConnList$.next(data);
        }else if (data.Command == constant.AddToFavConnList_CMD){
          this.isAddToFavConnList$.next(data);
        }else if (data.Command == constant.GetFavConnList_CMD){
          this.isGetFavConnList$.next(data);
        }else if (data.Command == constant.startPowerVisualization_CMD){
          this.isstartPowerVisualization$.next(data);
        }else if (data.Command == constant.stopPowerVisualization_CMD){
          this.isstopPowerVisualization$.next(data);
        }else if (data.Command == constant.GetParamVal_CMD){
          this.getParamVal$.next(data);
        }else if(data.Command == constant.LOADSCRIPT_CMD){
          this.isLoadScriptRes$.next(data);
        }else if(data.Command == constant.StartServerMonitor_CMD){
          this.isStartServerMonitorRes$.next(data);
        }else if(data.Command == constant.StopStopMonitor_CMD){
          this.isStopServerMonitorRes$.next(data);
        }
      }
    }
  }

  getTatFeatures() {
    return this.isGetTatFeature$.asObservable();
  }
  getTatHostService() {
    return this.isTatConn$.asObservable();
  }
  getChangeConn() {
    return this.changeConn$.asObservable();
  }
  getValidateGuid() {
    return this.validateGuid$.asObservable();
  }
  getTargetInfo() {
    return this.targetInfo$.asObservable();
  }
  getToolInfo() {
    return this.toolInfo$.asObservable();
  }
  getLoadWrkSpc() {
     return this.loadWrkspc$.asObservable();
  }
  getSaveWrkSpc() {
     return this.saveWrkspc$.asObservable();
   }
   getSaveCustomWrkSpc() {
     return this.saveCustomWrkspc$.asObservable();
   }
   getSetAppEventproperties() {
      return this.setAppEventProp$.asObservable();
   }
   getTelemetrySettings() {
     return this.telemetrySettings$.asObservable();
   }
   getSettings() {
     return this.getSettings$.asObservable();
   }
   getSetSettings() {
    return this.setSettings$.asObservable();
  }
  getChangeTelemetryStatus() {
    return this.changeTelemetryStatus$.asObservable();
  }
  getComponentList() {
    return this.getComponentList$.asObservable();
  }
  getTatFeatureStatus() {
    return this.getTatFeatureStatus$.asObservable();
  }
  getFilesInDir() {
    return this.getFilesInDir$.asObservable();
  }
  removeFromMonitorList() {
    return this.removeFromMonitorList$.asObservable();
  }
  handleError() {
    return this.isError$.asObservable();
  }
  getTatFeaturesStatusRes() {
    return this.isSetTatStatusRes$.asObservable();
  }
  getErrorSetSettings() {
    return this.errorSetSettingsRes$.asObservable();
  }
  getErrorTelemetry() {
    return this.errorTelemetryStatus$.asObservable();
  }
  getMonitorDataRes()
  {
    return this.isgetMonitorDataRes$.asObservable();
  }

  getControlDataRes()
  {
    return this.isgetControlDataRes$.asObservable();
  }

  updateControlDataRes()
  {
    return this.isUpdatedControlDataRes$.asObservable();
  }

  WorkLoadDataRes()
  {
    return this.isWorkLoadDataRes$.asObservable();
  }
  StartWorkloadRes()
  {
    return this.isStartWorkloadDataRes$.asObservable();
  }

  StopWorkloadRes()
  {
    return this.isStopWorkloadRes$.asObservable();
  }


  SetControlRes()
  {
    return this.isSetControlRes$.asObservable();
  }


  StartMonitorRes(){
    return this.isStartMonitorRes$.asObservable();
  }

  StopMonitorRes(){
    return this.isStopMonitorRes$.asObservable();
  }

  GetLogHeaderRes(){
    return this.isGetLogHeaderRes$.asObservable();
  }

  GetLogHeaderServerRes(){
    return this.isGetLogHeaderServerRes$.asObservable();
  }
  StartLoggingRes(){
    return this.isStartLoggingRes$.asObservable();
  }

  StopLoggingRes(){
    return this.isStopLoggingRes$.asObservable();
  }


  GetSolverDataRes(){
    return this.isGetSolverDataRes$.asObservable();
  }

  StartSolverRes(){
    return this.isStartSolverRes$.asObservable();
  }

  SolverStatusRes(){
    return this.isSolverStatusRes$.asObservable();
  }

  StopSolverRes(){
    return this.isStopSolverRes$.asObservable();
  }

  
  ResetControlRes(){
    return this.isResetControlRes$.asObservable();
  }
  
  ResetWorkloadRes(){
    return this.isResetWorkloadRes$.asObservable();
  }
  GetComponentDataRes(){
    return this.isGetComponentDataRes$.asObservable();
  }
  
  GetScriptDataRes(){
    return this.isGetScriptDataRes$.asObservable();
  }


  ScriptCommandSelectedRes(){
    return this.isScriptCommandSelectedRes$.asObservable();
  }


  ScriptComponentSelectedRes(){
    return this.isScriptComponentSelectedRes$.asObservable();
  }

  ScriptArg1SelectedRes(){
    return this.isScriptArg1SelectedRes$.asObservable();
  }

  ScriptArg2SelectedRes(){
    return this.isScriptArg2SelectedRes$.asObservable();
  }

  ScriptArg3SelectedRes(){
    return this.isScriptArg3SelectedRes$.asObservable();
  }

  ScriptAddRowRes(){
    return this.isScriptAddRowRes$.asObservable();
  }

  ScriptRemoveRowsRes(){
    return this.isScriptRemoveRowsRes$.asObservable();
  }

  getLoadScripts(){
    return this.isLoadScriptRes$.asObservable();
  }
  getSaveScripts(){
    return this.isSaveScriptRes$.asObservable();
  }
  getScriptsDragDrop(){
    return this.isScriptDragDropRes$.asObservable();
  }
  getExecuteScripts(){
    return this.isExecuteSuccRes$.asObservable();
  }
  getExecuteScriptsError(){
    return this.isExecuteErrRes$.asObservable();
  }
  getRowStatus(){
    return this.isRowStatus$.asObservable();
  }
  getScriptCommandLineStatus(){
    return this.isCommandLineStatus$.asObservable();
  }
  getStopScriptsStatus(){
    return this.isStopScript$.asObservable();
  }
  getScriptsStatus(){
    return this.isScriptStatus$.asObservable();
  }
  RemoveFromCustomViewListRes(){
    return this.isRemoveFromCustomViewListRes$.asObservable();
  }
  LoadCustomViewDataStatus(){
    return this.isLoadCustomViewData$.asObservable();
  }

  isGetParamTypeStatus(){
    return this.isGetParamType$.asObservable();
  }

  isAddToAlertListStatus(){
    return this.isAddToAlertList$.asObservable();
  }

  isUpdateAlertListStatus(){
    return this.isUpdateAlertList$.asObservable();
  }

  isRemoveFromAlertListStatus(){
    return this.isRemoveFromAlertList$.asObservable();
  }


  isStartAlertStatus(){
    return this.isStartAlert$.asObservable();
  }

  isGetAlertFileNameStatus(){
    return this.isGetAlertFileName$.asObservable();
  }

  isAlertSummaryStatus(){
    return this.isAlertSummary$.asObservable();
  }

  isStopAlertStatus(){
    return this.isStopAlert$.asObservable();
  }

  isLoadAlertsDataStatus(){
    return this.isLoadAlertsData$.asObservable();
  }
  GetSupportedOfflineAnalysisListStatus(){
    return this.isGetSupportedOfflineAnalysisList$.asObservable();
  }


  LoadAnalysisFromFileStatus(){
    return this.isLoadAnalysisFromFile$.asObservable();
  }

  GetOfflineAnalysisResultsStatus(){
    return this.isGetOfflineAnalysisResults$.asObservable();
  }

  GetTatLogAnalysisGraphDataDataStatus(){
    return this.isGetTatLogAnalysisGraphData$.asObservable();
  }
  GetGraphDataRes(){
    return this.isGetGraphData$.asObservable();
  }
  LoadGraph2FileRes(){
    return this.isLoadGraph2File$.asObservable();
  }
  GetGraph2DetailsRes(){
    return this.isGetGraph2Details$.asObservable();
  }
  AddParamToGraph2Res(){
    return this.isAddParamToGraph2$.asObservable();
  }
  RemoveParamFromGraph2Res(){
    return this.isRemoveParamFromGraph2$.asObservable();
  }
  StartGraph2Res(){
    return this.isStartGraph2$.asObservable();
  }
  StopGraph2Res(){
    return this.isStopGraph2$.asObservable();
  }
  AddParamToGraph1Res(){
    return this.isAddParamToGraph1$.asObservable();
  }
  Graph1ComponentSelectedRes(){
    return this.isGraph1ComponentSelected$.asObservable();
  }
  Graph1Arg1SelectedRes(){
    return this.isGraph1Arg1Selected$.asObservable();
  }
  Graph1Arg2SelectedRes(){
    return this.isGraph1Arg2Selected$.asObservable();
  }
  StartGraph1Res(){
    return this.isStartGraph1$.asObservable();
  }
  RemoveParamFromGraph1Res(){
    return this.isRemoveParamFromGraph1$.asObservable();
  }
  PlayGraph1Res(){
    return this.isPlayGraph1$.asObservable();
  }
  StopGraph1Res(){
    return this.isStopGraph1$.asObservable();
  }
  GetGraphPointsRes(){
    return this.isGetGraphPoints$.asObservable();
  }
  
   hostNotConnectedErrorHandling(){
    return this.ishostNotConnected$.asObservable();
  }

  hostDisConnectedErrorHandling(){
    return this.ishostDisconnected$.asObservable();
  }
  
  GetCastroCoveConfigRes(){
    return this.isCastroCoveConfig$.asObservable();
  }
  SetCastroCoveConfigRes(){
    return this.isSetCastroCoveConfig$.asObservable();
  }
  GetWarrenCoveConfigRes(){
    return this.isWarrenCoveConfig$.asObservable();
  }
   SetWarrenCoveConfigRes(){
    return this.isSetWarrenCoveConfig$.asObservable();
  }

  changeConnectionErrorHandling1(){
    return this.isChangeConnection$.asObservable();

  }

  checkTargetStatusErrorHandling(){
    return this.isCheckTargetStatus$.asObservable();
  }

  hideSpinner(){
    return this.ishideSpinner$.asObservable();
  }

  removeFromFavConnListRes(){
    return this.isRemoveFromFavConnList$.asObservable();
  }

  addToFavConnListRes(){
      return this.isAddToFavConnList$.asObservable();
  }

  getFavConnListRes(){
    return this.isGetFavConnList$.asObservable();
  }


  startPowerVisualizationRes(){
    return this.isstartPowerVisualization$.asObservable();
  }

  stopPowerVisualizationRes(){
    return this.isstopPowerVisualization$.asObservable();
  }

  getParamValRes(){
    return this.getParamVal$.asObservable();
  }
  

  StartServerMonitorRes(){
    return this.isStartServerMonitorRes$.asObservable();
  }

  StopServerMonitorRes(){
    return this.isStopServerMonitorRes$.asObservable();
  }

  public $: Subject<any>;

  //public $: Subject<any>;


}
