import { Injectable,EventEmitter } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { faAngry } from '@fortawesome/free-regular-svg-icons';


@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {
  private content  = new BehaviorSubject<any>("");
  private content1  = new BehaviorSubject<any>("");
  private loadWorkSpaceValue = new BehaviorSubject<any>("");
  private imonChk = new BehaviorSubject<any>("");
  private triggerTargetError = new BehaviorSubject<any>("");
  private closeContextMenu = new BehaviorSubject<any>("");
  private telemetryStatus =  new BehaviorSubject<any>("");
  private settingsRefreshInterval =  new BehaviorSubject<any>("");
  private liveGraphList =  new BehaviorSubject<any>("");
  private openPowerVisualization =  new BehaviorSubject<any>("");
  private minimizeVisualization =  new BehaviorSubject<any>("");
  private pvt_openHostPopup =  new BehaviorSubject<any>("");
  private pvt_triggerResize =  new BehaviorSubject<any>("");
  private visualizationParameters = new BehaviorSubject<any>("");
  private powerVisualizationStatus = new BehaviorSubject<any>("");


  public share = this.content.asObservable();
  public sharedata = this.content1.asObservable();
  private customWorkSpace$: EventEmitter<any>;
  public loadWorkSpaceFlag = this.loadWorkSpaceValue.asObservable();
  public imonChkFlag = this.imonChk.asObservable();
  public TargetErrorFlag = this.triggerTargetError.asObservable();
  public closeLiveAnalyContextMenu = this.closeContextMenu.asObservable();
  public telemetryAcceptDenied = this.telemetryStatus.asObservable();
  public settingsRefreshValue = this.settingsRefreshInterval.asObservable();
  public liveGraphListValue = this.liveGraphList.asObservable();
  public openPowerVisualizationPopup = this.openPowerVisualization.asObservable();
  public minimizeVisualizationPopup = this.minimizeVisualization.asObservable();
  public pub_openHostPopup = this.pvt_openHostPopup.asObservable();
  public pub_triggerResize = this.pvt_triggerResize.asObservable();
  public checkVisualizationParameters = this.visualizationParameters.asObservable();
  public powerVisualizationCurrentStatus = this.powerVisualizationStatus.asObservable();
 
  
  private cdkDropConnectedToList:Array<String> = ['table1', 'table2', 'table3'];
  
  constructor() { 
    this.customWorkSpace$ = new EventEmitter<any>();
  }

 updateData(any){
  this.content.next(any);
 }

 passData(any){
  this.content1.next(any);
 }

imonflagChecking(any){
  this.imonChk.next(any);
}

 loadWorkSpaceFlagData(any){
  this.loadWorkSpaceValue.next(any);
 }

 getCdkDropConnectedToList() {
   return this.cdkDropConnectedToList;
 }

 // may not be used
 setCustomWorkSpace(data){
   this.customWorkSpace$.emit(data);
 }

 // may not be used
 getCustomWorkSpace(){
   return this.customWorkSpace$;
 }

getTargetErrorModel(any){
  this.triggerTargetError.next(any);
}

getcloseContextMenu(arg){
  this.closeContextMenu.next(arg);
}

telemetryAcceptDeniedStatus(any){
  this.telemetryStatus.next(any);
}

refreshRateValue(arg){
  this.settingsRefreshInterval.next(arg);
}

checkLiveAnalysisParam(any){
  this.liveGraphList.next(any);
}

maximizePowerVisualizationPopup(any){
  this.openPowerVisualization.next(any);
}

minimizePowerVisualizationPopup(any){
  this.minimizeVisualization.next(any);
}

showHostPopup(any){
  this.pvt_openHostPopup.next(any);
}

triggerGridViewResize(arg){
  this.pvt_triggerResize.next(arg);
}
checkVisualizationParameter(any){
  this.visualizationParameters.next(any);
}

powerVisualizationWorkingStatus(any){
  this.powerVisualizationStatus.next(any);
}

}

