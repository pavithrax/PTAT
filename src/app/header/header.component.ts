import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../services/global-data.service';
import { SocketService } from '../db/socket.service';
import * as CanvasJS from '../../assets/canvasjs.min'; 
import * as $ from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import { UtilityServiceService } from '../services/utility-service.service';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
   // user checks
   settingsParameterCheckBox: boolean = true;
   monitorParameterCheckbox: boolean = true;
   customViewParameterCheckbox: boolean = true;
   graphParameterCheckbox: boolean = true;
   alertParameterCheckbox: boolean = true;

   isClicked: boolean = false;

   isTelemetryEnabled = false;
   versionNo = '';
   systemName = '';
   connectedIp = '';
   chromeSupport = '';
   isChromeSupport = false;
   saveWorkspaceName = '';
   loadWorkspaceError = "";
   //loadWorkspaceGetFiles = "GetFilesInDir(#folderPath,#type)";
   //loadWorkspaceGetFilesStatus = "LoadWorkspace(#folderPath,#settingsParam,#monitorParam,#customeParam,#graphParam,#alertParam)"
   workspaceType = "workspace";
   //saveWorkspaceCommand = "SaveWorkspace(#path)"
  // saveWorkSpacePath1: any = "C:\\Users\\asteffix\\Documents\\iPTAT\\workspace\\";
   saveWorkSpacePath: any;
   settingsParameter: any = "";
   monitorParameter: any = "";
   customeviewParameter: any = "";
   graphParameter: any = "";
   alertParameter: any = "";
   getToolInfoResponse: any;
   getTargetRes: any;
   workspaceReceivedData: any; 
   loadWrkspcClick = false;
   isLoadwrkSpace = false;
   liveAnalysisClickCount:number = 0;
   loadWorkSpacelogFileCount:any = 0;
   showcastroCovModal:any = false;
   castrocovData:any;
   showwarrenCovModal:any;
   warrencovData:any;
   isImonflag:any = false;
   showHidePowerVisualizationModal:any;
   powerVisualizationRunningStatus:any;
   totalPower:any = 0;
   CPUTDP:any = "";
   dGPUTDP:any = 1;
   dgPackagePowerPAge:any = "";
   cpuPackagePowerPAge:any= "";
   unused:any = "";
   packagePower:any="";
   powerVisualizationBtnStatus: boolean = true;
   showHidePowerVisualizationMenuCounter:any = 0;
   showHidePowerVisualizationMenu:boolean = true;
   plotGraph:boolean=false;
   CPUPackagePowerUID:any = "";
   dgPackagePowerUid:any = "";
   packageTdpPowerUid:any = "";
   dgPackagePowerRes :any = "";
   cpuPackagePowerRes :any = "";
   showGraph:any = false;
   unusedshow:any = 0;
   powerVisualizationchart:any;
   packagePowerData:any = [];
   dgPackagePowerData:any = [];
   totalPowerData:any = [];
   totalInstantaneousPowerData:any = [];
   powerVisualizationCount:any = 0;
   osInformation:any = "";
   hideCastrocoveMenu:boolean = false;
   hideWarrencoveMenu:boolean = false;
   hideTelemetryMenu:boolean = true;
   powerVisualizationStatus: boolean = true;
   showHideSettings:boolean = false;
   displayLoadWorkspace:any = "none";
   workspaceDataFromMonitor:Array<any> = [];
   counter:number = 1;
   dataType = '';
   constructor(public GlobalDataService: GlobalDataService, private SocketService: SocketService,private spinner: NgxSpinnerService,
      private util: UtilityServiceService) {

   }

   openRemoteConnection(){
      this.util.getTargetErrorModel(true);
   }

   stringify(obj) {
      return JSON.stringify(obj);
    }

    // used for PTAT Improvement Program in settings 
   sendTelDta() {

      if (this.isTelemetryEnabled == false) {
         this.isTelemetryEnabled = true;
         //var cmd = "ChangeTelemetryStatus(0)";
         var command = '{"Command" : "ChangeTelemetryStatus","Args": "1"}'
         this.SocketService.sendMessage(command);
      }
      else {
         this.isTelemetryEnabled = false;
         //var cmd = "ChangeTelemetryStatus(1)";
         var command = '{"Command" : "ChangeTelemetryStatus","Args": "0"}'
         this.SocketService.sendMessage(command);
      }
   }
   getToolData() {
      this.SocketService.getToolInfo().subscribe(message => {
         if (message) {
            this.getToolInfoResponse = message;
            var len = this.getToolInfoResponse.length;
            for (var i = 0; i < len; i++) {
               if (this.getToolInfoResponse[i].Key == 'IsTelemetryEnabled') {
                  if (this.getToolInfoResponse[i].Value == "1") {
                     this.isTelemetryEnabled = true;
                  }
                  else {
                     this.isTelemetryEnabled = false;
                  }
               }
               else if (this.getToolInfoResponse[i].Key == 'CurrentIpAddress') {
                  this.connectedIp = this.getToolInfoResponse[i].Value;
               }
               else if(this.getToolInfoResponse[i].Key == 'WorkSpacePath'){
                  this.saveWorkSpacePath = this.getToolInfoResponse[i].Value;
               }else if(this.getToolInfoResponse[i].Key == 'OperatingSystem'){
                  if(this.getToolInfoResponse[i].Value == "Windows"){
                     this.osInformation = "windows";
                     this.hideTelemetryMenu = false;
                  }else{
                     this.osInformation = "others";
                  }
                 }
                 else if(this.getToolInfoResponse[i].Key == 'platform_sku'){
                  if(this.getToolInfoResponse[i].Value == 'server') {
                    this.dataType = 'Serverside';
                  } else {
                    this.dataType = 'Clientside';
                  }
                }
            }

         } else {

            this.getToolInfoResponse = [];
         }
      });
   }
   getTargetData() {
      this.SocketService.getTargetInfo().subscribe(message => {
         if (message) {
            var command = '{"Command" : "getTatFeaturesStatus"}'
            this.SocketService.sendMessage(command);
            //this.SocketService.sendMessage("getTatFeaturesStatus()");
            this.getTargetRes = message;
            var len = this.getTargetRes.length;
            for (var k = 0; k < len; k++) {
               if (this.getTargetRes[k].key == 'BuildVersion') {
                  this.versionNo = this.getTargetRes[k].value;
               }
               else if (this.getTargetRes[k].key == 'SystemName') {
                  this.systemName = this.getTargetRes[k].value;
               }
            }
         } else {
            this.getTargetRes = [];
         }
      });
   }
   receiveTeleResp(){
      this.SocketService.getErrorTelemetry().subscribe(message => {
         if (message) {
            this.isTelemetryEnabled = !this.isTelemetryEnabled; 
         } 
      });
   }
   ngOnInit() {

        
      this.powerVisualizationchart = new CanvasJS.Chart("chartContainer", {
         zoomEnabled: true,
         toolTip: {
            shared: true
         },
         legend: {
            cursor:"pointer",
            fontSize: 12,
            horizontalAlign: "center",
            verticalAlign: "bottom",
            itemclick: function (e) {
               if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                   e.dataSeries.visible = false;
               } else {
                   e.dataSeries.visible = true;
               }
               e.chart.render();
           }
         },
         height:200,
         width: 490,
         data: [{ 
               type: "line",
               color: "#fcc213",
               xValueType: "dateTime",
               yValueFormatString: "####.00W",
               xValueFormatString: "hh:mm:ss TT",
               showInLegend: true,
               name: "CPU Package Power",
               dataPoints: this.packagePowerData
            },
            {				
               type: "line",
               color: "#0071c5",
               xValueType: "dateTime",
               yValueFormatString: "####.00W",
               showInLegend: true,
               name: "DG Package Power",
               dataPoints: this.dgPackagePowerData
            },
            {				
               type: "line",
               color: "green",
               xValueType: "dateTime",
               yValueFormatString: "####.00W",
               showInLegend: true,
               name: "Total Power",
               dataPoints: this.totalPowerData
            }, {				
               type: "line",
               color: "grey",
               xValueType: "dateTime",
               yValueFormatString: "####.00W",
               showInLegend: true,
               name: "Total Instantaneous Power",
               dataPoints: this.totalInstantaneousPowerData
            }

      ]
      });
      this.powerVisualizationchart.render();

      // this.totalPower = this.CPUTDP + this.dGPUTDP;
      this.util.telemetryAcceptDenied.subscribe(data => {
         if(data == true){
            this.isTelemetryEnabled = true;
         }else if(data == false){
            this.isTelemetryEnabled = false;
         }else{

         }

       });
   

      this.util.getCustomWorkSpace().subscribe(
         (data) => this.setCurrentWorkSpace(data)
      )
      this.getToolData();
      this.getTargetData();
      this.SaveWorkspaceSuccessResponse();
      this.receiveTeleResp();


      

   //TO RECEIVE DATA FROM TREEVIEW CHECKBOX CLICK
   this.util.imonChkFlag.subscribe(data => {
      this.isImonflag = data;
   });

   this.util.openPowerVisualizationPopup.subscribe(data => {
      this.showHidePowerVisualizationModal= data;
      this.powerVisualizationRunningStatus = data;
      this.util.powerVisualizationWorkingStatus(this.powerVisualizationRunningStatus);
    });

      this.SocketService.ResetControlRes().subscribe(message => {
         if (message) {
            this.spinner.show();
            var command = '{"Command" : "GetUpdatedControlData"}'
            this.SocketService.sendMessage(command);

            //this.SocketService.sendMessage("GetUpdatedControlData()");  
           // this.SocketService.sendMessage("OtherView()");     
         }

      });

      this.SocketService.ResetWorkloadRes().subscribe(message => {
         if (message) {
            this.spinner.show();
            var command = '{"Command" : "GetWorkLoadData"}'
            this.SocketService.sendMessage(command);
            //this.SocketService.sendMessage("GetWorkLoadData()");
            //this.SocketService.sendMessage("OtherView()"); 
         }

      });

      this.SocketService.getFilesInDir().subscribe(message => {
         if (message) {
            this.spinner.hide();
            if(message.CommandStatus.Status == "Success" && message.Data.Key == "workspace"){
               this.workspaceReceivedData = message.Data.List;
               if(this.workspaceReceivedData.length != 0){
                  this.loadWorkSpacelogFileCount = 1;
               }else{
                  this.loadWorkSpacelogFileCount = 0;
               }
            }
         }

      });

      // once load button with user checkbox is done this is used
      this.SocketService.removeFromMonitorList().subscribe(message => {
         if (message) {
            this.settingsParameter = 0;
            this.monitorParameter = 0;
            this.customeviewParameter = 0;
            this.graphParameter = 0;
            this.alertParameter = 0;
      
            if (this.settingsParameterCheckBox == true) {
               this.settingsParameter = "USERCHECKED";
            }
            if (this.monitorParameterCheckbox == true) {
               this.monitorParameter = "MONITORCHECKED";
            }
            if (this.customViewParameterCheckbox == true) {
               this.customeviewParameter = "CUSTOMVIEWCHECKED";
            }
            if (this.graphParameterCheckbox == true) {
               this.graphParameter = "GRAPHCHECKED";
            }
            if (this.alertParameterCheckbox == true) {
               this.alertParameter = "ALERTSCHECKED";
            }
            if(this.isLoadwrkSpace){
            var loadWorkspaceFileName = $('#loadWorkSpaceFileName').val();
            //var loadWorkspaceFileName = 'all.xml';
            var loadWorkspacefullPath = this.saveWorkSpacePath + loadWorkspaceFileName;
            var path = ""
            if(this.osInformation = "windows"){
               path = loadWorkspacefullPath.replace(/\\/g,"\\\\");
            }else{
               path = loadWorkspacefullPath.replace(/\\/g,"////");
            }

            //var loadWorkSpaceCommand = this.loadWorkspaceGetFilesStatus.replace("#folderPath",loadWorkspacefullPath).replace("#settingsParam", this.settingsParameter).replace("#monitorParam", this.monitorParameter).replace("#customeParam", this.customeviewParameter).replace("#graphParam", this.graphParameter).replace("#alertParam", this.alertParameter);
            var loadWorkSpaceCommand = '{"Command" : "LoadWorkspace","params" : {"Args":'+'"'+path+','+this.settingsParameter+","+this.monitorParameter+","+this.customeviewParameter+","+this.graphParameter+","+this.alertParameter+'"'+'}}'
            this.SocketService.sendMessage(loadWorkSpaceCommand);
            this.isLoadwrkSpace = false;

            // to check in the monitor tab if monitor and log is started, if started to stop
            if($('.startButton').text().toLowerCase().trim() == "stop monitor"){
               var command = '{"Command" : "StopMonitor"}'
               this.SocketService.sendMessage(command);
               //this.SocketService.sendMessage("StopMonitor()");
            }
   
            if($('.logButton').text() == "Stop Logging"){
               var command = '{"Command" : "StopLogging"}'
               this.SocketService.sendMessage(command);
               //this.SocketService.sendMessage("StopLogging()");
            }
            }

           
         }
         
      });

      // above fun "LoadWorkspace" resp. data subscription
      this.SocketService.getLoadWrkSpc().subscribe(message => {
         if (message.CommandStatus.Status == "Success") {
            this.displayLoadWorkspace = 'none';
            this.loadWorkspaceError = "";
            if (this.settingsParameterCheckBox == true) {
               var monitorCommand = '{"Command" : "MonitorView"}'
               var command = '{"Command" : "GetSettings"}'
               this.SocketService.sendMessage(monitorCommand);
               this.SocketService.sendMessage(command);
               //this.SocketService.sendMessage("GetSettings()");
               //this.SocketService.sendMessage("MonitorView()");
            }
            if (this.monitorParameterCheckbox == true) {
               var monitorCommand = '{"Command" : "MonitorView"}'
               var command = '{"Command" : "GetMonitorData"}'
               this.SocketService.sendMessage(monitorCommand);
               this.SocketService.sendMessage(command);
               //this.SocketService.sendMessage("GetMonitorData()");
               //this.SocketService.sendMessage("MonitorView()");
            } 
            // not needed
            if (this.customViewParameterCheckbox == true) {
               var monitorCommand = '{"Command" : "MonitorView"}'
               this.SocketService.sendMessage(monitorCommand);

               // var command = '{"Command" : "LoadCustomViewData"}' // not used i guess
               // this.SocketService.sendMessage(command);
            }
            if (this.graphParameterCheckbox == true) {
               var monitorCommand = '{"Command" : "MonitorView"}'
               var command = '{"Command" : "GetMonitorData"}'
               if(this.counter != 1){
                  this.SocketService.sendMessage(monitorCommand);
                  this.SocketService.sendMessage(command);
               }
               this.counter++
            }
            if (this.alertParameterCheckbox == true) {
               var monitorCommand = '{"Command" : "MonitorView"}'
               var command = '{"Command" : "LoadAlertsData"}'
               this.SocketService.sendMessage(monitorCommand);
               this.SocketService.sendMessage(command);
               //this.SocketService.sendMessage("LoadAlertsData()");
               //this.SocketService.sendMessage("MonitorView()");
            }
         }else{
            this.spinner.hide();
            this.loadWorkspaceError = message.CommandStatus.Message;
         }
      });   
      
      

//CastroCov Response:
   this.SocketService.GetCastroCoveConfigRes().subscribe(message => {
      if (message) {
         this.castrocovData = message.Data;
         this.showcastroCovModal = true; 
      }
   });

 //CastroCov success response:
 this.SocketService.SetCastroCoveConfigRes().subscribe(message =>{
   if(message){
      location.reload();
   }
 });


 //WarrenCov success response:
 this.SocketService.SetWarrenCoveConfigRes().subscribe(message =>{
   if(message){
      location.reload();
   }
 });

//WarrenCov Response:
   this.SocketService.GetWarrenCoveConfigRes().subscribe(message => {
      if (message) {
         this.warrencovData = message.Data;
         this.showwarrenCovModal = true;
      }
   });


   this.SocketService.getMonitorDataRes().subscribe(message => {
      // this.dataType = 'Clientside' // to be delted later
      if (message && this.dataType == 'Clientside') {
         this.showHidePowerVisualizationMenuCounter = 0;
         var monitorDataRes = message.Data[0].Treelist;
         for(let i=0;i<monitorDataRes.length;i++){
            if(monitorDataRes[i].Name == "CPU Component" || monitorDataRes[i].Name == "DG Component"){
               this.showHidePowerVisualizationMenuCounter = this.showHidePowerVisualizationMenuCounter + 1;
               for(let j=0;j<monitorDataRes[i].Treelist.length;j++){
                  if(monitorDataRes[i].Treelist[j].Name == "Power" || monitorDataRes[i].Treelist[j].Name == "Miscellaneous" || monitorDataRes[i].Treelist[j].Name == "ConfigTDP"){
                     var subTreeList = monitorDataRes[i].Treelist[j].SubTreeList;
                     for(let k=0;k<subTreeList.length;k++){
                        if(subTreeList[k].Name == "Package Power"){
                           this.CPUPackagePowerUID = subTreeList[k].Index;
                        }else if(subTreeList[k].Name == "DG Package Power"){
                      // }else if(subTreeList[k].Name == "Integrated Graphics Power"){
                           this.dgPackagePowerUid = subTreeList[k].Index;
                        }else if(subTreeList[k].Name == "Package TDP Power"){
                           this.packageTdpPowerUid = subTreeList[k].Index;
                        }
                     }
                  }
               }
            }else if(monitorDataRes[i].Name == "CastroCove Component"){
               this.hideCastrocoveMenu = true;
            }else if(monitorDataRes[i].Name == "WarrenCove Component"){
               this.hideWarrencoveMenu = true;
            }
         } 

         if(this.showHidePowerVisualizationMenuCounter == 2){
          this.showHidePowerVisualizationMenu = true;
         }else{
            this.showHidePowerVisualizationMenu = false;
         }
      }
    });



    this.SocketService.startPowerVisualizationRes().subscribe(message => {
      if (message) {
         if(message.Data == undefined){

         }else{
         this.powerVisualizationStatus = false;
         var startMonitorRes = message.Data;
         let systemTime = new Date().toTimeString().split(" ")[0];
         for(let i=0;i<startMonitorRes.length;i++){
            if(startMonitorRes[i].Index == this.CPUPackagePowerUID){
               this.cpuPackagePowerRes = startMonitorRes[i].Value;
               var floatNumber = parseFloat(this.cpuPackagePowerRes);
               this.cpuPackagePowerRes = floatNumber.toPrecision(3);
               this.packagePowerData.push({x:this.powerVisualizationCount, y:parseFloat(this.cpuPackagePowerRes), label:systemTime});
            }else if(startMonitorRes[i].Index == this.dgPackagePowerUid){
               this.dgPackagePowerRes = startMonitorRes[i].Value;
               var floatNumber = parseFloat(this.dgPackagePowerRes);
               this.dgPackagePowerRes = floatNumber.toPrecision(3);
               this.dgPackagePowerData.push({x:this.powerVisualizationCount, y:parseFloat(this.dgPackagePowerRes), label:systemTime});
            }
            
            this.totalPower =  parseFloat(this.CPUTDP) + parseFloat(this.dGPUTDP) ;
            this.dgPackagePowerPAge  = (parseFloat(this.dgPackagePowerRes)*100)/this.totalPower;            
            this.cpuPackagePowerPAge = (parseFloat(this.cpuPackagePowerRes)*100)/this.totalPower;           
            var totalInstantaneousPower : any= parseFloat(this.cpuPackagePowerRes) + parseFloat(this.dgPackagePowerRes);
            var unusedValue = 100 - (this.dgPackagePowerPAge + this.cpuPackagePowerPAge);
            var unusedCount = this.totalPower -(parseFloat(this.dgPackagePowerRes) + parseFloat(this.cpuPackagePowerRes));
            this.totalPowerData.push({x:this.powerVisualizationCount, y:parseFloat(this.totalPower), label:systemTime});
            this.totalInstantaneousPowerData.push({x:this.powerVisualizationCount, y:parseFloat(totalInstantaneousPower), label:systemTime})
            
            if(unusedCount > 0){
               //this.unusedshow = unusedCount;
               this.unusedshow = unusedCount.toPrecision(3);
            }else{
               this.unusedshow = 0;
            }

            if(unusedValue > 0){
               this.unused  = unusedValue;
            }else{
               this.unused = 0;
            }
            var dgAndCpuPackage = parseFloat(this.dgPackagePowerRes) + parseInt(this.cpuPackagePowerRes);
            
         }
         this.powerVisualizationCount = this.powerVisualizationCount+1;
         this.powerVisualizationchart.render();
       }
      }
    });

   this.SocketService.stopPowerVisualizationRes().subscribe(message => {
      if (message) {
         this.powerVisualizationStatus = true;
      }
   });


   this.SocketService.getParamValRes().subscribe(message => {
      if (message) {
        this.CPUTDP = message.Data;
        this.totalPower = this.CPUTDP + this.dGPUTDP;
      }
    });


   }


   //Castrocov popup
   castroCovUI(){
      //Sending command:
      var command = '{"Command" : "GetCastroCoveConfig"}'
      this.SocketService.sendMessage(command);
      // this.SocketService.sendMessage('GetCastroCoveConfig()');
    }

   closeModal(){
      this.showcastroCovModal = false;
   }

   //Save CastroCov
   savecastroCov(){
      var data = this.castrocovData;
      var res = '';
      for(var i = 0; i<data.length; i++){
         res += data[i].RailName+':'+data[i].CustomRailName;
         if(i<data.length-1){
            res +=';';
         }
      }
      //console.log('SetCastroCoveConfig('+res+')');
      var command = '{"Command" : "SetCastroCoveConfig","Args":'+'"'+res+'"'+'}'
      this.SocketService.sendMessage(command);
      //this.SocketService.sendMessage('SetCastroCoveConfig('+res+')');
   }

//Warrencov popup
warrenCovUI(){
   var command = '{"Command" : "GetWarrenCoveConfig"}'
   this.SocketService.sendMessage(command);
   //this.SocketService.sendMessage('GetWarrenCoveConfig()');
}

closeWarrencovModal(){
   this.showwarrenCovModal = false;
}

//Save warrenCov
savewarrenCov(){ 
   var data = this.warrencovData;
   var res = '';
   for(var i = 0; i<data.length; i++){
      res += data[i].RailName+':'+data[i].CustomRailName;
      if(i<data.length-1){
         res +=';';
      }
   }
   //console.log('SetWarrenCoveConfig('+res+')');
   var command = '{"Command" : "SetWarrenCoveConfig","Args":'+'"'+res+'"'+'}'
   this.SocketService.sendMessage(command);
   //this.SocketService.sendMessage('SetWarrenCoveConfig('+res+')');
}

   setCurrentWorkSpace(data){
      this.workspaceDataFromMonitor=data;
      //console.log("WorkspaceMonitor", this.workspaceDataFromMonitor);
   }
     
   // To Close the tool
   public exitApp(): void {
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if (isChrome) {
         this.isChromeSupport = true;
         this.chromeSupport = "This Feature is not supported by the browser. Please close the tool manually";

      }
      else {
         var objWindow = window.open(location.href, "_self");
         objWindow.close();
      }
      setTimeout(() => {
         this.isChromeSupport = false;

      }, 3000);
   }

   // DPTF UI Method
   public dptfUi(): void {
      var url = "http://" + this.connectedIp + ":8888/";
      window.open(url, '_blank');
   }

   //Reset Wrkload Method
   public resetWrkld(): void {
      //var cmd = "ResetWorkload()";
      var command = '{"Command" : "ResetWorkload"}'
      this.SocketService.sendMessage(command);
   }


   resetControl(){
      var command = '{"Command" : "ResetAllControl"}'
      this.SocketService.sendMessage(command);
      //this.SocketService.sendMessage("ResetControl()");
   }

   SaveWorkspaceSuccessResponse() {

      this.SocketService.getSaveCustomWrkSpc().subscribe(message => {
         if (message) {
            let workspaceName = this.saveWorkspaceName;
            let workspacePath = this.saveWorkSpacePath;
            let fullPath = workspacePath + workspaceName + ".json"
            // let fullPath = workspacePath + workspaceName + ".xml"
            var saveWorkspaceFullpath = ""
            if(this.osInformation = "windows"){
               saveWorkspaceFullpath = fullPath.replace(/\\/g,"\\\\");
            }else{
               saveWorkspaceFullpath = fullPath.replace(/\\/g,"////");
            }
            var command = '{"Command" : "SaveWorkspace","params" : {"Args":'+'"'+saveWorkspaceFullpath+'"'+'}}'
            //let path = this.saveWorkspaceCommand.replace("#path", fullPath);
            this.SocketService.sendMessage(command);
         }

      });


   }

   submitSaveWorkspace() {
      var paramList = this.workspaceDataFromMonitor.join();
      //this.SocketService.sendMessage("SaveWorkspace("+paramList+")");
      // var command = '{"Command" : "SaveWorkspace","Args":'+'"'+paramList+'"'+'}'
      let workspaceName = this.saveWorkspaceName;
      let workspacePath = this.saveWorkSpacePath;
      let fullPath = workspacePath + workspaceName + ".json"
      // let fullPath = workspacePath + workspaceName + ".xml"
      var saveWorkspaceFullpath = ""
      if(this.osInformation = "windows"){
         saveWorkspaceFullpath = fullPath.replace(/\\/g,"\\\\");
      }else{
         saveWorkspaceFullpath = fullPath.replace(/\\/g,"////");
      }
      var command = '{"Command" : "SaveWorkspace","params" : {"Args":'+'"'+saveWorkspaceFullpath+'"'+'}}'
      this.SocketService.sendMessage(command);
   }

   loadWorkSpace() {
      //let loadWorkSpaceLogListCommand = this.loadWorkspaceGetFiles.replace("#folderPath", this.saveWorkSpacePath).replace("#type", this.workspaceType);
      var path = ""
      this.displayLoadWorkspace = 'block';
      if(this.osInformation = "windows"){
         path = this.saveWorkSpacePath.replace(/\\/g,"\\\\");
      }else{
         path = this.saveWorkSpacePath.replace(/\\/g,"////");
      }
      var loadWorkSpaceLogListCommand = '{"Command" : "GetFilesInDir","params" : {"Args":'+'"'+path+","+this.workspaceType+'"'+'}}'
      // var loadWorkSpaceLogListCommand = '{"Command" : "GetFilesInDir","Args":'+'"'+path+","+this.workspaceType+'"'+'}'
      this.liveAnalysisClickCount = this.liveAnalysisClickCount+1;
      if(this.liveAnalysisClickCount > 0){
         this.SocketService.sendMessage(loadWorkSpaceLogListCommand);
         this.spinner.show();
      }
   }

   loadworkspaceRefresh() {
      //let loadWorkSpaceLogListCommand = this.loadWorkspaceGetFiles.replace("#folderPath", this.saveWorkSpacePath).replace("#type", this.workspaceType);
      var path = ""
      if(this.osInformation = "windows"){
         path = this.saveWorkSpacePath.replace(/\\/g,"\\\\");
      }else{
         path = this.saveWorkSpacePath.replace(/\\/g,"////");
      }
      var loadWorkSpaceLogListCommand = '{"Command" : "GetFilesInDir","params" : {"Args":'+'"'+path+","+this.workspaceType+'"'+'}}'
      // var loadWorkSpaceLogListCommand = '{"Command" : "GetFilesInDir","Args":'+'"'+path+","+this.workspaceType+'"'+'}'
      this.SocketService.sendMessage(loadWorkSpaceLogListCommand);
   }

   submitLoadWorkspace() {
         this.spinner.show();
         // to remove monitor data
         // var command = '{"Command" : "RemoveFromMonitorList"}'
         var command = '{"Command" : "RemoveFromMonitorList","params" : {"Args":"0"}}'
         this.SocketService.sendMessage(command);
         //this.SocketService.sendMessage("RemoveFromMonitorList()");

         // to remove everything from graph
         this.util.checkLiveAnalysisParam(1);
         this.isLoadwrkSpace = true;
         this.util.loadWorkSpaceFlagData(1);
  
   }


   restrictDotAndSlash(value) {
      var keyCode = value.keyCode == 0 ? value.charCode : value.keyCode;
      if ((keyCode >= 48 && keyCode <= 58) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || keyCode == 45 || keyCode == 95 || keyCode == 32 || keyCode == 40 || keyCode == 41 || keyCode == 8) {
         return true;
      }
      else {
         return false;
      }
   }


   openPowerVisualizationModal(){
      this.showHidePowerVisualizationModal= true;
      this.powerVisualizationRunningStatus = true;
      this.util.powerVisualizationWorkingStatus(this.powerVisualizationRunningStatus);
      this.util.checkVisualizationParameter(this.CPUPackagePowerUID+'_'+this.dgPackagePowerUid);  
      var command = '{"Command" : "GetParamVal","Args":'+'"'+this.packageTdpPowerUid+'"'+'}'
      this.SocketService.sendMessage(command);
   }

   closePowerVisualizationModal(){
      this.showHidePowerVisualizationModal= false;
      this.powerVisualizationRunningStatus = false;
      this.util.powerVisualizationWorkingStatus(this.powerVisualizationRunningStatus);
      this.packagePowerData.length = 0;
      this.dgPackagePowerData.length = 0;
      if(this.powerVisualizationStatus == false){
         var command = '{"Command" : "stopPowerVisualization"}'
         this.SocketService.sendMessage(command);
      }
      
   }

   displayVisualizationGraph($event){

   }

   onlyNumber(event: any) {
      
      var keycode = event.which;
      if (!(event.shiftKey == false && (keycode >= 48 && keycode <= 57) || keycode==46)) {
        event.preventDefault();
      }
    }

    visualizationCheckBox(){
       if(this.showGraph == true)
       {
          this.showGraph = false;
          
       }
       else{
          this.showGraph = true;
       }
    }
   
   plotPowerClk(){
      this.plotGraph = !this.plotGraph;
      // not used 
       if(this.plotGraph == true){
         this.plotGraph = false;
       }else{
         this.plotGraph = true;
       }
    }


    minimizeVisualizationPopup(){
      this.showHidePowerVisualizationModal= false;
      this.powerVisualizationRunningStatus = true;
      this.util.powerVisualizationWorkingStatus(this.powerVisualizationRunningStatus);
      this.util.minimizePowerVisualizationPopup(true);      
    }

    openAboutFile(){
      var filePath = "assets/Intel (R) Power And Thermal Analysis Tool Help.pdf";
      window.open(filePath, "_blank");

    }

    startStopPowerVisualization(powerVisualizationCurrentStatus){
     if(powerVisualizationCurrentStatus == true){
      // this.powerVisualizationStatus = false;
      if(this.CPUPackagePowerUID == ""){
         this.CPUPackagePowerUID = null;
      }else if(this.dgPackagePowerUid == ""){
         this.dgPackagePowerUid = null;
      }
      var command = '{"Command" : "startPowerVisualization","Args":'+'"'+this.CPUPackagePowerUID+","+this.dgPackagePowerUid+'"'+'}'      // console.log(cmd);
      this.SocketService.sendMessage(command);
     }else{
      // this.powerVisualizationStatus = true;
      var command = '{"Command" : "stopPowerVisualization"}'
      this.SocketService.sendMessage(command);
     }
      // this.powerVisualizationStatus = !this.powerVisualizationStatus; 
    }

    closeLoadworkspacePopup(){
      this.displayLoadWorkspace = 'none';
   }
   
}
