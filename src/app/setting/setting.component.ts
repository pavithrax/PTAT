import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SocketService } from '../db/socket.service';
import {UtilityServiceService} from '../services/utility-service.service';
import * as $ from 'jquery';


@Component({
   selector: 'app-setting',
   templateUrl: './setting.component.html',
   styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

   settingsForm: FormGroup;
   settingsForm1: FormGroup;
   settingsForm2: FormGroup;
   pollVal = '';
   markedReset1 = "";
   markedReset: any;
   refreshInterval = '';
   logFilePath = '';
   logFileType = [];
   logOption = [];
   alertFilePath = '';
   defaultLogType = '';
   defaultLogOption = '';
   disableAlertPath = true;
   display = 'none';
   getToolInfoResponse: any;
   getSettingsResponse: any;
   settingOnLoad = false;
   prevLogFileType = "";
   prevLogOptions = "";
   prevResetControls: any;
   prevPollVal: any;
   prevLogFilePath: any;
   prevRefrInterval: any;
   openModal() {
      var command = '{"Command" : "GetSettings"}'
      this.SocketService.sendMessage(command);
      //this.SocketService.sendMessage("GetSettings()");
      this.display = 'block';

   }
   closeModal() {
      this.display = 'none';

   }

  
   //validation for polling time
   validatePollValidator(controller: AbstractControl): { [key: string]: any } {
      if (controller.value) {
         if (!(1 <= controller.value && controller.value <= 60000)) {
            return {
               validatePoll: true
            }
         }
      }
      return null;
   }
   // validation for refresh time interval
   validateRefreshValidator(controller: AbstractControl): { [key: string]: any } {
      if (controller.value) {
         if (!(500 <= controller.value && controller.value <= 60000)) {
            return {
               validateRefresh: true
            }
         }
      }

      return null;
   }
   // validation for log file name
   validateFileNameValidator(controller: AbstractControl): { [key: string]: any } {
      var format = /^[a-zA-Z0-9\.]+$/i;
      if (controller.value) {
         if (!(format).test(controller.value)) {
            return {
               validateFileName: true
            }
         }
      }

      return null;
   }

   constructor(fb: FormBuilder, private SocketService: SocketService,private utility : UtilityServiceService) {

      this.settingsForm = fb.group({
         pollVal: [null, [Validators.required, this.validatePollValidator]]

      })
      this.settingsForm1 = fb.group(
         {
            refreshInterval: [null, [Validators.required, this.validateRefreshValidator]]
         }

      )
      this.settingsForm2 = fb.group(
         {
            logFilePath: [null, [Validators.required, this.validateFileNameValidator]]
         }
      )


   }
   getToolData() {

      this.SocketService.getToolInfo().subscribe(message => {
         if (message) {
            this.getToolInfoResponse = message;
            for (var i = 0; i < this.getToolInfoResponse.length; i++) {
               if (this.getToolInfoResponse[i].Key == 'AlertPath') {
                  this.alertFilePath = this.getToolInfoResponse[i].Value;
               }
            }
         } else {

            this.getToolInfoResponse = [];
         }
      });
   }
   getSettings() {
      this.SocketService.getSettings().subscribe(message => {
         if (message) {
            console.log(message);
            
            this.getSettingsResponse = message;
            var len = this.getSettingsResponse.length;
            for (var i = 0; i < len; i++) {
               if (this.getSettingsResponse[i].Key == 'PollingInterval') {
                  this.settingsForm.setValue({ pollVal: this.getSettingsResponse[i].Value })
                  this.prevPollVal = this.getSettingsResponse[i].Value;
               }
               else if (this.getSettingsResponse[i].Key == 'ResetAll') {
                  if (this.getSettingsResponse[i].Value == "Yes") {
                     this.markedReset = true;
                     this.markedReset1 = "Yes";
                  }
                  else {
                     this.markedReset = false
                     this.markedReset1 = "No";
                  }
   
   
   
               }
               else if (this.getSettingsResponse[i].Key == 'RefreshInterval') {
   
                  this.settingsForm1.setValue({ refreshInterval: this.getSettingsResponse[i].Value })
                  this.prevRefrInterval = this.getSettingsResponse[i].Value;
               }
               else if (this.getSettingsResponse[i].Key == 'AppLogFilePath') {
   
                  this.settingsForm2.setValue({ logFilePath: this.getSettingsResponse[i].Value })
                  this.prevLogFilePath = this.getSettingsResponse[i].Value;
               }
               else if (this.getSettingsResponse[i].Key == 'LogFileType') {
                  if (this.getSettingsResponse[i].Value.length) {
                     // this.logFileType = this.getSettingsResponse[i].Value.split(",");
                     this.logFileType = this.getSettingsResponse[i].Value;
                     // this.defaultLogType = this.getSettingsResponse[i].Value[0];
                     console.log(this.defaultLogType);
                     
                  }
               } else if (this.getSettingsResponse[i].Key == 'LogFileTypeSelected') {
                  this.defaultLogType = this.getSettingsResponse[i].Value;
               }
               
               else if (this.getSettingsResponse[i].Key == 'FileOption') {
                  if (this.getSettingsResponse[i].Value.length) {
                     // this.logOption = this.getSettingsResponse[i].Value.split(",");
                     this.logOption = this.getSettingsResponse[i].Value;
                     // this.defaultLogOption = this.getSettingsResponse[i].Value.split(":")[1];
                  }
               }
               else if (this.getSettingsResponse[i].Key == 'FileOptionSelected') {
                  this.defaultLogOption = this.getSettingsResponse[i].Value;
               }
               console.log(this.defaultLogType);
            }
            if(this.settingOnLoad == false){
               //this.SocketService.sendMessage("getTatFeaturesStatus()");
            //   this.SocketService.sendMessage("GetMonitorData()");
            //   this.SocketService.sendMessage("MonitorView()");
              this.settingOnLoad = true;
            }

           
         } else {

            this.getSettingsResponse = [];
         }
      });
   }
   setSettingResp() {
      this.SocketService.getErrorSetSettings().subscribe(message => {
         if (message) {
            if (this.prevLogFileType) {
               this.defaultLogType = this.prevLogFileType;
            }
            if (this.prevLogOptions) {
               this.defaultLogOption = this.prevLogOptions;
            }
            if (this.prevResetControls) {
               this.markedReset = this.prevResetControls;
            }
            if (this.prevRefrInterval) {
               this.settingsForm1.setValue({ refreshInterval: this.prevRefrInterval })
            }
            if (this.prevPollVal) {
               this.settingsForm.setValue({ pollVal: this.prevPollVal })
            }
            if (this.prevLogFilePath) {
               this.settingsForm2.setValue({ logFilePath: this.prevLogFilePath })
            }
         }
      });
   }

   ngOnInit() {
      this.getToolData();
      this.getSettings();
      this.setSettingResp();

      this.SocketService.getSetSettings().subscribe(message => {
         if (message) {
            this.utility.refreshRateValue(this.settingsForm1.getRawValue().refreshInterval);
         }
     });


   }


   // On key press event validation for Poll time and refresh time interval
   onlyNumber(event: any) {
      var keycode = event.which;
      if (!(event.shiftKey == false && (keycode >= 48 && keycode <= 57))) {
         event.preventDefault();
      }      
   }

   // on ok button click event
   submitForm() {
      console.log(this.settingsForm);
      
      var pollTime = this.settingsForm.getRawValue().pollVal;
      var refreshTime = this.settingsForm1.getRawValue().refreshInterval;
      console.log(pollTime,refreshTime,this.settingsForm.getRawValue());
      // if(this.defaultLogO)
      var logType = this.defaultLogType;
      var logName = this.settingsForm2.getRawValue().logFilePath;
      var logOption = this.defaultLogOption;
      var resetVal = "";
      if(this.markedReset == true){
         resetVal = "Yes";
      }else{
         resetVal = "No";
      }
      //var resetVal = this.markedReset1;
      console.log(logType,logOption);
      
     
      if(pollTime && refreshTime && logName.length>0){
         console.log("hi");
         
         if(parseInt(pollTime)>=1 ){console.log("hi");
            if(parseInt(pollTime)<=60000 ){console.log("hi");
               if(parseInt(refreshTime)>=500){ console.log("hi");
                  if(parseInt(refreshTime)<=60000){console.log("hi");
                     // send Command
                     //var cmdSettingsset = "SetSettings(" + logType + "," + logName + "," + logOption + "," + pollTime + "," + resetVal + "," + refreshTime + ")";          
                     // var cmdSettingsset = '{"Command" : "SetSettings","params" : {"Args":'+'"'+logType+','+logName+','+logOption+','+pollTime+','+resetVal+','+refreshTime+'"'+'}}'
                     var cmdSettingsset = '{"Command" : "SetSettings","params" : {"Args":{"LogFileTypeSelected":"'+logType+'","LogFileName":"'+logName+'","FileOptionSelected":"'+logOption+'","PollingInterval":'+pollTime+',"ResetAll":"'+resetVal+'","RefreshInterval":'+refreshTime+''+'}}}'
                     this.SocketService.sendMessage(cmdSettingsset);
                     this.display = 'none';
                  }
                  else{
                     this.settingsForm1.setValue({ refreshInterval: "60000" });
                  }
               }
               else{
                  this.settingsForm1.setValue({ refreshInterval: "500" });
               }
            }
            else{
               this.settingsForm.setValue({ pollVal: "60000" });
            }
         }
         else{
            this.settingsForm.setValue({ pollVal: "1" });
         }
      }
   }

   resetChanged(event) {
      this.prevResetControls = this.markedReset;
   }

   logOptionChanged(event) {
      this.prevLogOptions = this.defaultLogOption;

   }

   //On selection of file type file name change accordingly
   onSelectFile(event) {
      this.prevLogFileType = this.defaultLogType;
      var fileNameArr =this.settingsForm2.getRawValue().logFilePath.split(".");
      var fileName = fileNameArr[0];
      if (event == 'html') {
         this.settingsForm2.setValue({ logFilePath: fileName+'.html' })

      }
      else {
         this.settingsForm2.setValue({ logFilePath: 
            fileName+'.csv' })

      }

   }

   //On key press event not allow special characters or slash
   keyPressValidate(event: any) {
      var format = /^[-a-zA-Z0-9_\.]+$/i;
      if (event.key) {
         if (!(format).test(event.key)) {
            event.preventDefault();
         }
      }
   }




}
