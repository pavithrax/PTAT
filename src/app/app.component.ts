import { Component, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import { UtilityServiceService } from './services/utility-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SocketService } from './db/socket.service';
import { HostListener } from "@angular/core";
import { GlobalDataService } from './services/global-data.service';

@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.css']
})
export class AppComponent {
   IsTelemetryLicenseAgreed = false;
   versionNo = '';
   SystemName = '';
   title = 'IntelThermalAnalysisTool';
   hasclass: any = false;
   navBarData: any;
   menuSizeDefault: number = 0;
   scrollDuration: number = 1500;
   itemsLength: number;
   itemSize: number;
   menuSize: number;
   menuWrapperSize: number;
   rightButtonDisabled: boolean;
   leftButtonDisabled: boolean;
   selectedNavValue: any = "System Information";
   getToolInfoResponse: any;
   getTargetRes: any;
   wrkspcPath: any;
   isLoadWrkspcOnLoad = false;
   loading = true;
   workloadClickCount: number = 0;
   controlClickCount: number = 0
   liveAnalysisClickCount: number = 0;
   ScriptClickCount: number = 0;
   tatLogAnalysisClickCount: number = 0;
   public portNumber = 49861;
   osInformation: any = "";
   hideNavBar: any = true;
   licenseNavBar: boolean = true;
   sidePanelToggleFlag: number = 0;
   powerVisualizationOpenStatus: any = "";
   platform: string = "server";

   constructor(private utility: UtilityServiceService, private spinner: NgxSpinnerService, public socket: SocketService) {

   }

   /* Initialize Command Starts*/
   initialCommand() {
      // Need to suscribe 1st
      this.socket.checkSocketConn().subscribe(
         (data) => {
            var myURL = window.location.href;
            var ind = myURL.lastIndexOf("#");
            var guid = "0";
            if (ind > -1) {
               guid = myURL.slice(ind + 1);
            }
            var command = '{"Command" : "IsTATHostService","Args":' + '"' + guid + '"' + '}'
            //console.log(command);
            this.getTatHostService();
            //this.socket.sendMessage(command);
            //this.socket.sendMessage("IsTATHostService("+guid+")");
         }
      );


   }

   getTatHostService() {
      //this.socket.getTatHostService().subscribe(message => {
         var command = '{"Command" : "GetToolInfo"}'
         this.socket.sendMessage(command);

         // if (message[0]=="USER_NOT_ADMIN") {
         //    this.utility.showHostPopup("Please run application as Administrator");           
         // }
         // else{
         //    this.socket.sendMessage(command);
         // }
      //});
   }

   getToolData() {

      this.socket.getToolInfo().subscribe(message => {
         if (message) {
            this.loading = false;
            this.getToolInfoResponse = message;
            //this.socket.sendMessage("GetComponentList()"); to be sent only once telemetry lic is passed
            var len = this.getToolInfoResponse.length;
            for (var i = 0; i < len; i++) {
               if (this.getToolInfoResponse[i].key == 'IsTelemetryLicenseAgreed') {
                  var command = '{"Command" : "GetComponentList"}';
                  this.socket.sendMessage(command);
                  //this.socket.sendMessage("GetComponentList()");
                  if (this.getToolInfoResponse[i].value == "0") {
                     if (this.osInformation == "others") {
                        this.IsTelemetryLicenseAgreed = true;
                     }
                     else {
                        this.IsTelemetryLicenseAgreed = false;
                     }
                     this.licenseNavBar = false;
                  }
                  else {
                     this.IsTelemetryLicenseAgreed = true;
                  }

               }
               else if (this.getToolInfoResponse[i].key == 'WorkSpacePath') {
                  this.wrkspcPath = this.getToolInfoResponse[i].value;
               } else if (this.getToolInfoResponse[i].key == 'OperatingSystem') {
                  if (this.getToolInfoResponse[i].value == "Windows") {
                     this.osInformation = "windows";
                  } else {
                     this.osInformation = "others";
                  }
               }
               else if (this.getToolInfoResponse[i].key == 'platform'){
                  this.platform = this.getToolInfoResponse[i].value;
                  console.log(this.platform);
               }


            }

         } else {
            this.getToolInfoResponse = [];
         }
      });
   }
   getTargetData() {
      this.socket.getTargetInfo().subscribe(message => {
         if (message) {
            this.getTargetRes = message;
            //console.log(this.getTargetRes);
            var path = ""
            if (this.osInformation = "windows") {
               path = this.wrkspcPath.replace(/\\/g, "\\\\");
            } else {
               path = this.wrkspcPath.replace(/\\/g, "////");
            }

            var command = '{"Command" : "LoadWorkspace","Args":' + '"' + path + 'DefaultWorkSpace.xml' + ',' + 'USERCHECKED,MONITORCHECKED,CUSTOMVIEWCHECKED,GRAPHCHECKED,ALERTSCHECKED' + '"' + '}'
            //var cmd = "LoadWorkspace(" + this.wrkspcPath+ "DefaultWorkSpace.xml"+ ",USERCHECKED,MONITORCHECKED,CUSTOMVIEWCHECKED,GRAPHCHECKED,ALERTSCHECKED)";
            this.socket.sendMessage(command);
            var len = this.getTargetRes.length;
            for (var k = 0; k < len; k++) {
               if (this.getTargetRes[k].key == 'BuildVersion') {
                  this.versionNo = this.getTargetRes[k].value;
               }
               else if (this.getTargetRes[k].key == 'SystemName') {
                  this.SystemName = this.getTargetRes[k].value;
               }
            }


         } else {

            this.getTargetRes = [];
         }
      });
   }
   changeConn() {
      this.socket.getChangeConn().subscribe(message => {
         if (message) {
            var command = '{"Command" : "ValidateGUID","Args":"73350375-d63e-4c47-9635-2ec59626bf1b"}'
            this.socket.sendMessage(command);
            // this.socket.sendMessage("ValidateGUID(73350375-d63e-4c47-9635-2ec59626bf1b)");
         }
         this.workloadClickCount = 0;
         this.controlClickCount = 0;
         this.liveAnalysisClickCount = 0;
         this.ScriptClickCount = 0;
         this.tatLogAnalysisClickCount = 0;
         this.ScriptClickCount = 0;
      });
   }
   validateGuid() {
      this.socket.getValidateGuid().subscribe(message => {
         if (message) {
            var command = '{"Command" : "SetAppEventProperties"}'
            this.socket.sendMessage(command);
            //this.socket.sendMessage("SetAppEventProperties()");
         }

      });
   }

   getComponentLists() {
      this.socket.getComponentList().subscribe(message => {
         if (message) {
            this.navBarData = message.TreeList;
            var command = '{"Command" : "GetFavConnList"}';
            this.socket.sendMessage(command);
            // this.socket.sendMessage("GetFavConnList()");
            //this.socket.sendMessage("ChangeConnection(websockets,127.0.0.1,49866)");
            var changeConnectioncommand = '{"Command" : "ChangeConnection","Args":"websockets,127.0.0.1,49866"}'
            this.socket.sendMessage(changeConnectioncommand);
         }
      });
   }
   setAppEventProperties() {
      this.socket.getSetAppEventproperties().subscribe(message => {
         if (message) {
            var command = '{"Command" : "GetTargetInfo"}'
            this.socket.sendMessage(command);
            //this.socket.sendMessage("GetTargetInfo()");
            //this.socket.sendMessage("TelemetrySettings(1,1)");
         }

      });


   }
   telemetrySettings() {
      this.socket.getTelemetrySettings().subscribe(message => {
         if (message) {
            //this.socket.sendMessage("GetTargetInfo()");

         }

      });
   }
   loadwrkspc() {
      if (this.isLoadWrkspcOnLoad == false) {
         this.socket.getLoadWrkSpc().subscribe(message => {
            if (message) {
               // this.socket.sendMessage("GetSettings()");
               this.isLoadWrkspcOnLoad = true;
            }

         });
      }

   }

   //Testing
   @HostListener('window:resize', ['$event'])
   getScreenSize(event?) {
      var scrWidth = window.innerWidth;
      var hscls = $('#sidebar').hasClass('active');

      if (this.sidePanelToggleFlag == 1) {
         if (hscls) {
            this.hasclass = true;
         } else {
            this.hasclass = false
         }
      }
      // if(scrWidth < 700){
      //    if(hscls){
      //    this.hasclass = false;
      //    }else{
      //    this.fnToggle();
      //     $('#sidebar').toggleClass('active');
      //    this.hasclass = true;
      //    }
      // }

      if (this.sidePanelToggleFlag == 0) {
         if (scrWidth < 700) {
            if ($('#sidebar').hasClass('active')) {
               //this.fnWindowresize();
               this.hasclass = true;
            } else {
               $('#sidebar').toggleClass('active');
               //this.fnWindowresize();
               this.hasclass = false;
            }
            this.fnWindowresize();
            $(".container1").trigger("ss-rearrange");
         }
      }
      //$(".container1").trigger("ss-rearrange"); 
   }


   /* settings menus */
   ngOnInit() {

      this.spinner.show();
      // Need to suscribe 1st
      this.socket.webSocketResponse(this.portNumber);
      this.initialCommand();

      this.getTatHostService();
      this.getToolData();
      this.getTargetData();
      this.changeConn();
      this.validateGuid();
      this.getComponentLists();
      this.setAppEventProperties();
      this.telemetrySettings();
      this.loadwrkspc();

      setTimeout(() => {
         /** spinner ends after 5 seconds */
         // this.spinner.hide();
      }, 4000);

      this.socket.hostNotConnectedErrorHandling().subscribe(message => {
         if (message) {
            // alert("app");
            this.IsTelemetryLicenseAgreed = false;
            this.loading = false;
            $("#hidelicenceagreement").addClass("hidden");
            $(".container1").trigger("ss-rearrange");
         }
      });

      this.utility.powerVisualizationCurrentStatus.subscribe(data => {
         this.powerVisualizationOpenStatus = data;
      });

   }


   rightNavigation() {
      this.itemsLength = $('.horizontalNavItem').length;
      this.itemSize = $('.horizontalNavItem').outerWidth(true);
      this.menuSize = this.itemsLength * this.itemSize;
      this.menuWrapperSize = $('.horizontalNavDiv').outerWidth();

      if (this.menuSizeDefault + this.menuWrapperSize > this.menuSize) {
         this.menuSizeDefault = this.menuSize;
         /*  this.rightButtonDisabled = false;   */
      } else {
         this.menuSizeDefault = this.menuSizeDefault + this.menuWrapperSize;
         /*  if(this.menuSizeDefault == 0){
            this.leftButtonDisabled = true;
          } */
      }
      $('.horizontalNavUl').animate({ scrollLeft: this.menuSizeDefault }, this.scrollDuration);

   }

   leftNavigation() {
      if (this.menuSizeDefault - this.menuWrapperSize <= 0) {
         this.menuSizeDefault = 0;
         /*  this.rightButtonDisabled = true;   */
      } else {
         this.menuSizeDefault = this.menuSizeDefault - this.menuWrapperSize;

      }
      $('.horizontalNavUl').animate({ scrollLeft: this.menuSizeDefault }, this.scrollDuration);
   }



   fnToggle() {
      this.sidePanelToggleFlag = 1;
      var scrWidth = window.innerWidth;
      setTimeout(() => {
         this.fnWindowresize();
         $(".container1").trigger("ss-rearrange");
      }, 700);

      if (scrWidth < 700) {
         // if($('#sidebar').hasClass('active')){

         // }else{
         //    $('#sidebar').toggleClass('active');
         // }
         $('#sidebar').toggleClass('active');
         // console.log($('#sidebar').hasClass('active'));
         if ($('#sidebar').hasClass('active')) {
            this.hasclass = false;
            this.fnWindowresize();
            $(".container1").trigger("ss-rearrange");
         } else {
            this.hasclass = true;
         }
         // $(".container1").trigger("ss-rearrange");
      } else {
         $('#sidebar').toggleClass('active');
         // console.log($('#sidebar').hasClass('active'));
         if ($('#sidebar').hasClass('active')) {
            this.hasclass = true;
            this.fnWindowresize();
            $(".container1").trigger("ss-rearrange");
         } else {
            this.hasclass = false;
         }
      }

      this.utility.triggerGridViewResize(1);
      setTimeout(() => {
         this.sidePanelToggleFlag = 0;
      }, 2000);

   }


   fnWindowresize() {
      if (typeof (Event) === 'function') {
         window.dispatchEvent(new Event('resize'));
      } else { //FOR IE 
         var evt = window.document.createEvent('UIEvents');
         evt.initUIEvent('resize', true, false, window, 0);
         window.dispatchEvent(evt);
      }
   }

   setNavValue(val) {
      //Triggering to fix the content collapse
      //this.fnWindowresize();
      var otherViewCommand = '{"Command" : "OtherView"}'
      if (val.toLowerCase() == "workload") {
         if (this.workloadClickCount == 0) {
            this.spinner.show();
            var getWorkLoadDataCommand = '{"Command" : "GetWorkLoadData"}'
            this.socket.sendMessage(getWorkLoadDataCommand);
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }
         } else {
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }
         }
         this.workloadClickCount = this.workloadClickCount + 1
      } else if (val.toLowerCase() == "control") {
         this.spinner.show();
         // if (this.controlClickCount == 0) {
            var getControlDataCommand = '{"Command" : "GetControlData"}'
            this.socket.sendMessage(getControlDataCommand);
            //this.socket.sendMessage(otherViewCommand);
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }

         // } 
         // else {
         //    var getUpdatedControlDataCommand = '{"Command" : "GetUpdatedControlData"}'
         //    this.socket.sendMessage(getUpdatedControlDataCommand);
         //    //this.socket.sendMessage(otherViewCommand);
         //    if (this.powerVisualizationOpenStatus != true) {
         //       this.socket.sendMessage(otherViewCommand);
         //    }

         // }
         this.controlClickCount = this.controlClickCount + 1
      } else if (val.toLowerCase() == "live analysis") {

         if (this.liveAnalysisClickCount == 0) {
            var getSolverDataCommand = '{"Command" : "GetSolverData"}'
            this.socket.sendMessage(getSolverDataCommand);
            //this.socket.sendMessage(otherViewCommand);
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }

         } else {
            //this.socket.sendMessage(otherViewCommand);
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }

         }
         this.liveAnalysisClickCount = this.liveAnalysisClickCount + 1;

      } else if (val.toLowerCase() == "scripts") {

         if (this.ScriptClickCount == 0) {
            var getScriptDataCommand = '{"Command" : "GetScriptData"}'
            this.socket.sendMessage(getScriptDataCommand);
            //this.socket.sendMessage(otherViewCommand);
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }

         } else {
            //this.socket.sendMessage(otherViewCommand);
            if (this.powerVisualizationOpenStatus != true) {
               this.socket.sendMessage(otherViewCommand);
            }
         }
      } else if (val.toLowerCase() == "monitor") {
         var command = '{"Command" : "MonitorView"}'
         this.socket.sendMessage(command);
         this.socket.sendMessage(command);
         //this.socket.sendMessage("MonitorView()");
         //this.socket.sendMessage("MonitorView()");
         this.utility.triggerGridViewResize(1);
      } else if (val.toLowerCase() == "ptat log analysis") {

         if (this.tatLogAnalysisClickCount == 0) {
            this.spinner.show();
            var getSupportedOfflineAnalysisListCommand = '{"Command" : "GetSupportedOfflineAnalysisList"}'
            this.socket.sendMessage(getSupportedOfflineAnalysisListCommand);
            //this.socket.sendMessage("GetSupportedOfflineAnalysisList()");
         } else {

         }
         this.tatLogAnalysisClickCount = this.tatLogAnalysisClickCount + 1;
      }
      // else if (val.toLowerCase() == "graph") {

      //    if (this.ScriptClickCount == 0) {
      //       var getGraphDataCommand = '{"Command" : "GetGraphData"}'
      //       this.socket.sendMessage(getGraphDataCommand);
      //       //this.socket.sendMessage(otherViewCommand);
      //       if (this.powerVisualizationOpenStatus != true) {
      //          this.socket.sendMessage(otherViewCommand);
      //       }

      //    } else {
      //       //this.socket.sendMessage(otherViewCommand);
      //       if (this.powerVisualizationOpenStatus != true) {
      //          this.socket.sendMessage(otherViewCommand);
      //       }

      //    }
      // }
      this.selectedNavValue = val;
   }

   TelemetryLicenseAgreementAccept() {
      //var cmd = "TelemetryLicenseAgreementStatus(1)";
      var cmd = '{"Command" : "TelemetryLicenseAgreementStatus","Args":' + '"' + '1' + '"' + '}'
      this.socket.sendMessage(cmd);
      // console.log(cmd);
      setTimeout(() => {
         this.getScreenSize(event);
         this.fnWindowresize();
      }, 200)

      this.IsTelemetryLicenseAgreed = true;
      $(".container1").trigger("ss-rearrange");
      this.utility.telemetryAcceptDeniedStatus(true);
      this.licenseNavBar = true;
   }

   TelemetryLicenseAgreementReject() {
      //var cmd = "TelemetryLicenseAgreementStatus(0)";
      var cmd = '{"Command" : "TelemetryLicenseAgreementStatus","Args":' + '"' + '0' + '"' + '}'
      this.socket.sendMessage(cmd);
      //  console.log(cmd);
      this.IsTelemetryLicenseAgreed = true;
      setTimeout(() => {
         this.getScreenSize(event);
         this.fnWindowresize();
      }, 200);

      $(".container1").trigger("ss-rearrange");
      this.utility.telemetryAcceptDeniedStatus(false);
      this.licenseNavBar = true;
   }

   closeContextMenu() {
      this.utility.getcloseContextMenu(true);
   }

}
