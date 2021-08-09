import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SocketService } from '../db/socket.service';
import { DataService } from '../services/data.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
declare let $: any;


@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.css']
})
export class ScriptsComponent implements OnInit {
  scriptsForm: FormGroup;
  passDeleteRows: any;
  respScriptArr = [];
  addState = '0';
  dropdownresponse = [];
  getComponentResp = [];
  componentArr = [];
  arg1Arr = [];
  arg2Arr = [];
  arg3Arr = [];
  arg4Arr = [];
  key = 0;
  removeState = '0';
  saveState = '0';
  executeState = '0';
  selectedFeatures: any = [];
  selectedFeatures1: any = [];
  arr = [];
  isAllChecked = false;
  enableStop = false;
  isScriptStatus = false;
  scriptStatusCode = 0;
  stopRequested = false;
  scriptStatus = '';
  getArg2Resp = [];
  getArg3Resp = [];
  getArg1Resp = [];
  scriptDeleteList = [];
  getLoadScriptResp = [];
  getScriptResponse: any;
  getComponentResp1: any;
  getArg2Resp1: any;
  getArg3Resp1: any;
  getArg1Resp1: any;
  prevIndex: any;
  nextIndex: any;
  checkArray: any;
  rowStatusIndex:any = "";
  g_GfxDialogId:any = [];

constructor(fb: FormBuilder, private SocketService: SocketService, private DataService: DataService) {
    this.scriptsForm = fb.group({
      selectedOption: [''],
      compData: [''],
      arg1Data: [''],
      arg2Data: [''],
      arg3Data: [''],
      arg4Data: ['']

    })

    this.scriptsForm.get('compData').disable();
    this.scriptsForm.get('arg1Data').disable();
    this.scriptsForm.get('arg2Data').disable();
    this.scriptsForm.get('arg3Data').disable();
    this.scriptsForm.get('arg4Data').disable();
  }


  ngOnInit() {
    this.SocketService.getScriptsStatus().subscribe(message => {
      if (message) {
        var status = message.Data;
        var count = message.Count;
        var gfxFileName = message.Filename;
        var gfxArguments = message.Arguments;
        var endsWithString = "script";
        if(count !=undefined){
          gfxFileName = "assets//" + gfxFileName;
          this.launchGFXWorkloadFromUI(gfxFileName,gfxArguments, count, endsWithString );
        }
        else{
          this.ScriptStatusRes(status);
        }
      }
    });

    this.SocketService.GetScriptDataRes().subscribe(message => {
      if (message) {
        this.getScriptResponse = message.Data;
        if (this.getScriptResponse[0].DropDownList.DropDownData.Name == 'Command') {
          if (this.respScriptArr = this.getScriptResponse[0].DropDownList.DropDownData.Row.length) {
            this.respScriptArr = this.getScriptResponse[0].DropDownList.DropDownData.Row.split(",");
            this.scriptsForm.get('selectedOption').setValue(this.respScriptArr[this.key]);
          }
        }
      }
    });

    this.SocketService.ScriptCommandSelectedRes().subscribe(message => {
      if (message) {
        this.dropdownresponse = message.Data[0].DropDownList;
        this.ReceiveScriptResp();
      }
    });

    this.SocketService.ScriptComponentSelectedRes().subscribe(message => {
      if (message) {
        this.getComponentResp = message.Data[0].DropDownList;
        if (this.getComponentResp) {
          this.onChangeofCmdScriptScriptResponse();
        }
      }
    });

    this.SocketService.ScriptArg1SelectedRes().subscribe(message => {
      if (message) {
        this.getArg1Resp1 = message.Data[0].DropDownList;
        if (this.getArg1Resp1) {
          this.getArg1Resp = this.getArg1Resp1;
          this.onChangeofArg1ScriptScriptResponse();
        }

      }
    });

    this.SocketService.ScriptArg2SelectedRes().subscribe(message => {
      if (message) {
        this.getArg2Resp1 = message.Data[0].DropDownList;
        if (this.getArg2Resp1) {
          this.getArg2Resp = this.getArg2Resp1;
          this.onChangeofArg2ScriptScriptResponse();
        }
      }
    });

    this.SocketService.ScriptArg3SelectedRes().subscribe(message => {
      if (message) {
        this.getArg3Resp1 = message.Data[0].DropDownList;
        if (this.getArg3Resp1) {
          this.getArg3Resp = this.getArg3Resp1;
          this.onChangeofArg3ScriptScriptResponse();
        }
      }
    });

    this.SocketService.ScriptAddRowRes().subscribe(message => {
      if (message) {
        var scriptsArr =
        {
          "Cmd": this.scriptsForm.get('selectedOption').value, "CompData": this.scriptsForm.get('compData').value, "Arg1": this.scriptsForm.get('arg1Data').value, "Arg2": this.scriptsForm.get('arg2Data').value, "Arg3": this.scriptsForm.get('arg3Data').value, "Arg4": this.scriptsForm.get('arg4Data').value, "selected": false, "executestatus": ""

        }
        this.selectedFeatures.push(scriptsArr);
        if (this.selectedFeatures.length) {
          this.removeState = "1";
          this.saveState = "1";
          this.executeState = "1";
        }

        if (this.arr.length == this.selectedFeatures.length) {
          this.isAllChecked = true;
        }
        else {
          this.isAllChecked = false;
        }


        this.checkArray = this.selectedFeatures.length;
        this.passDeleteRows = this.checkArray;
      }
    });

    this.SocketService.ScriptRemoveRowsRes().subscribe(message => {
      if (message) {
        var tempArr = [];
        for (let i = 0; i < this.selectedFeatures.length; i++) {
          var j=0;
          for (;j < this.arr.length; j++) {
            if(this.arr[j]==i){
              break;
            }
          }
          if(j==this.arr.length){
            tempArr.push(this.selectedFeatures[i]);
          }
        }
        this.arr = [];
        this.selectedFeatures = [];
        this.selectedFeatures = tempArr;
        let checkBoxCount = $('.scriptCheckBox');
        if (checkBoxCount.length) {
          for (let i = 0; i <= checkBoxCount.length; i++) {

            if ($(checkBoxCount[i]).is(':checked')) {
              $(checkBoxCount[i]).parent().parent().remove();
            }
          }
        }


        // If no data in table disable buttons remove, save, execute 
        if ($(".scriptCheckBox").length == 0) {
          this.removeState = "0";
          this.saveState = "0";
          this.executeState = "0";
          this.isAllChecked = false;
        }

        this.checkArray = $(".scriptCheckBox").length;
        this.passDeleteRows = this.checkArray;

      }
    });
    this.SocketService.getScriptsDragDrop().subscribe(message => {
      if (message) {
        this.selectedFeatures = message.Data;
        // moveItemInArray(this.selectedFeatures, this.prevIndex,this.nextIndex);
      }
    });

    this.SocketService.getExecuteScriptsError().subscribe(message => {
      if (message) {
        this.scriptStatus = "Invalid Script";        
        this.scriptStatusCode = 1;        
        this.isScriptStatus =true;
        this.enableStop = false; 
      }
    });

    this.SocketService.getRowStatus().subscribe(message => {
      if (message) {
        var arrStatus =  message.Data[0].Row.split(",");
        this.rowStatusIndex = arrStatus[0];
        this.enableStop = true;

      }
    });
    this.SocketService.getScriptCommandLineStatus().subscribe(message => {
      if (message) {
        if(message.Data[0].Status == "Script Completed"){
          if(message.Data[0].Cmd == "Stop Workload"){
            if(message.Data[0].Instance == "Gfx"){
              this.StopGfxWorkload("script");
            }

          }
          
        }else{
          this.selectedFeatures[this.rowStatusIndex].executestatus = message.Data[0].Status;
        }
      }
    });

    this.SocketService.getStopScriptsStatus().subscribe(message => {
      if (message) {
        if(this.stopRequested == true){
          this.scriptStatus = "User aborted"; 
          this.StopGfxWorkload("script");       
          this.scriptStatusCode = 0;
        }
          this.isScriptStatus =true;
          this.enableStop = false;
        
      }
    });

    }

  //On selection of command script dropdown
  onChangeofSelectScript(i) {
    var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    //var cmd = "ScriptCommandSelected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + "-1:null,-1:null,-1:null,-1:null,-1:null)";
    var cmd = '{"Command" : "ScriptCommandSelected","Args":'+'"'+'-1,'+commanddropdownselecteditemindex+':null'+','+'-1:null,-1:null,-1:null,-1:null,-1:null'+'"'+'}'
    this.SocketService.sendMessage(cmd);
  }

  ReceiveScriptResp() {

    this.arg4Arr = [];
    this.arg3Arr = [];
    this.arg2Arr = [];
    this.arg1Arr = [];
    this.componentArr = [];
    this.scriptsForm.get('compData').enable();
    this.scriptsForm.get('arg1Data').enable();
    this.scriptsForm.get('arg2Data').enable();
    this.scriptsForm.get('arg3Data').enable();
    this.scriptsForm.get('arg4Data').enable();
    this.addState = "1";
    if(this.dropdownresponse.length == 0){
      this.scriptsForm.reset();
      this.scriptsForm.get('selectedOption').setValue(this.respScriptArr[this.key]);
      this.scriptsForm.get('compData').disable();
      this.scriptsForm.get('arg1Data').disable();
      this.scriptsForm.get('arg2Data').disable();
      this.scriptsForm.get('arg3Data').disable();
      this.scriptsForm.get('arg4Data').disable();
      this.addState = "0";
    }

    for (let i = 0; i < this.dropdownresponse.length; i++) {
      if (this.dropdownresponse[i].Name == 'Component') {

        if (this.dropdownresponse[i].Row != 'Disabled') {
          if (this.dropdownresponse[i].Row.includes(':')) {
            for (let k = 0; k < this.dropdownresponse[i].Row.split(",").length; k++) {
              this.componentArr.push(this.dropdownresponse[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
            }
          }
          else {
            this.componentArr = this.dropdownresponse[i].Row.split(",");
            this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
          }

        }
        else {
          this.scriptsForm.get('compData').setValue("");
          this.scriptsForm.get('compData').disable();
        }


      }
      if (this.dropdownresponse[i].Name == 'Arg1') {
        if (this.dropdownresponse[i].Row != 'Disabled') {
          if (this.dropdownresponse[i].Row.includes(':')) {
            for (let k = 0; k < this.dropdownresponse[i].Row.split(",").length; k++) {
              this.arg1Arr.push(this.dropdownresponse[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
            }
          }
          else {
            this.arg1Arr = this.dropdownresponse[i].Row.split(",");
            this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg1Data').setValue("");
          this.scriptsForm.get('arg1Data').disable();
        }

      }
      else if (this.dropdownresponse[i].Name == 'Arg2') {
        if (this.dropdownresponse[i].Row != 'Disabled') {
          if (this.dropdownresponse[i].Row.includes(':')) {
            for (let k = 0; k < this.dropdownresponse[i].Row.split(",").length; k++) {
              this.arg2Arr.push(this.dropdownresponse[i].Row.split(",")[k].slice(0, -2).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
            }
          }
          else {
            this.arg2Arr = this.dropdownresponse[i].Row.split(",");
            this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg2Data').setValue("");
          this.scriptsForm.get('arg2Data').disable();
        }


      }
      else if (this.dropdownresponse[i].Name == 'Arg3') {
        if (this.dropdownresponse[i].Row != 'Disabled') {
          if (this.dropdownresponse[i].Row.includes(':')) {
            for (let k = 0; k < this.dropdownresponse[i].Row.split(",").length; k++) {
              this.arg3Arr.push(this.dropdownresponse[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
            }
          }
          else {
            this.arg3Arr = this.dropdownresponse[i].Row.split(",");
            this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg3Data').setValue("");
          this.scriptsForm.get('arg3Data').disable();
        }

      }
      else if (this.dropdownresponse[i].Name == 'Arg4') {
        if (this.dropdownresponse[i].Row != 'Disabled') {
          if (this.dropdownresponse[i].Row.includes(':')) {
            for (let k = 0; k < this.dropdownresponse[i].Row.split(",").length; k++) {
              this.arg4Arr.push(this.dropdownresponse[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
            }
          }
          else {
            this.arg4Arr = this.dropdownresponse[i].Row.split(",");
            this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg4Data').setValue("");
          this.scriptsForm.get('arg4Data').disable();
        }
      }
    }
  }


  //Adding Script to table data
  addScript() {

    var scriptsArr =
    {
      "Cmd": this.scriptsForm.get('selectedOption').value, "CompData": this.scriptsForm.get('compData').value, "Arg1": this.scriptsForm.get('arg1Data').value, "Arg2": this.scriptsForm.get('arg2Data').value, "Arg3": this.scriptsForm.get('arg3Data').value, "Arg4": this.scriptsForm.get('arg4Data').value, "selected": false, "executestatus": ""

    }

    this.selectedFeatures1.push(scriptsArr);

    var rowIndex = $(".scriptCheckBox").length;
    var CmdScriptIndex = $("#mySelectCmdScript").prop('selectedIndex');
    var CompScriptIndex = $("#mySelectCompScript").prop('selectedIndex');
    var Arg1ScriptIndex = $("#mySelectArg1Script").prop('selectedIndex');
    var Arg2ScriptIndex = $("#mySelectArg2Script").prop('selectedIndex');
    var Arg3ScriptIndex = $("#mySelectArg3Script").prop('selectedIndex');
    var Arg4ScriptIndex = $("#mySelectArg4Script").prop('selectedIndex');
    let compData = this.scriptsForm.get('compData').value;
    let arg1Data = this.scriptsForm.get('arg1Data').value;
    let arg2Data = this.scriptsForm.get('arg2Data').value;
    let arg3Data = this.scriptsForm.get('arg3Data').value;
    let arg4Data = this.scriptsForm.get('arg4Data').value;
    if(arg4Data == ""){
      arg4Data = null;
    }
    if(arg3Data == ""){
      arg3Data = null;
    }
    if(arg2Data == ""){
      arg2Data = null;
    }
    if(arg1Data == ""){
      arg1Data = null;
    }
    if(compData == ""){
      compData = null;
    }

    //var cmd = "ScriptAddRow(" + rowIndex + "," + CmdScriptIndex + ":" + this.scriptsForm.get('selectedOption').value + "," + CompScriptIndex + ":" + compData + "," + Arg1ScriptIndex + ":" + arg1Data + "," + Arg2ScriptIndex + ":" + arg2Data + "," + Arg3ScriptIndex + ":" + arg3Data + "," + Arg4ScriptIndex + ":" + arg4Data +  ")";
    var cmd =  '{"Command" : "ScriptAddRow","Args":'+'"'+rowIndex+','+CmdScriptIndex+':'+this.scriptsForm.get('selectedOption').value+','+CompScriptIndex+':'+compData+','+Arg1ScriptIndex+':'+arg1Data+','+Arg2ScriptIndex+':'+arg2Data+','+Arg3ScriptIndex+':'+arg3Data+','+Arg4ScriptIndex+':'+arg4Data+'"'+'}'
    this.SocketService.sendMessage(cmd);
  }

  //Reset function (To clear the data on selection of command dropdown)
  resetForm() {
    this.isScriptStatus = false;
    this.scriptStatus = "";
    this.scriptsForm.reset();
    this.scriptsForm.get('selectedOption').setValue(this.respScriptArr[this.key]);
    this.scriptsForm.get('compData').disable();
    this.scriptsForm.get('arg1Data').disable();
    this.scriptsForm.get('arg2Data').disable();
    this.scriptsForm.get('arg3Data').disable();
    this.scriptsForm.get('arg4Data').disable();
    this.addState = "0";
    if (!this.selectedFeatures.length) {
      this.removeState = "0";
      this.saveState = "0";
      this.executeState = "0";
    }
    this.selectedFeatures.forEach(function(x) { 
      x.executestatus ='';
   });

  }
  // selects the checked id values
  check() {
    var arr = [];
    $(".scriptCheckBox").each(function (val) {
      if (this.checked) {
        arr.push(val);
      }

    });
    this.arr = arr;
    if (this.arr.length == $(".scriptCheckBox").length) {
      this.isAllChecked = true;
    }
    else {
      this.isAllChecked = false;
    }

  }

  // Remove Selection Scripts
  deleteSelected() {
    let checkBoxCount = $('.scriptCheckBox');
    if (checkBoxCount.length && this.arr.length>0) {
         //var cmd = "ScriptRemoveRows(" + this.arr.toString() + ")"
          var cmd = '{"Command" : "ScriptRemoveRows","Args":'+'"'+this.arr.toString()+'"'+'}'
          this.SocketService.sendMessage(cmd);
    }
  }

  //select all table rows
  selectAllScripts(event) {
    const checked = event.target.checked;
    this.selectedFeatures.filter(item => {
      item.selected = checked
      this.isAllChecked = true;
    });
    var arr = [];
    $(".scriptCheckBox").each(function (val) {
     
     arr.push(val);
     
    });
    this.arr = arr;
    

    if (!event.target.checked) {
      // clear the array
      this.arr = [];
    }

  }


  //Re order Table rows
  dropTable(event: CdkDragDrop<[]>) {
   this.prevIndex = event.previousIndex;
   this.nextIndex = event.currentIndex;
    //var cmd = "ScriptRowsDragAndDrop(" + event.previousIndex + "," + event.currentIndex + ")";
    var cmd = '{"Command" : "ScriptRowsDragAndDrop","Args":'+'"'+event.previousIndex+','+event.currentIndex+'"'+'}'
    this.SocketService.sendMessage(cmd);
    

  }
 
  //On button click of execute flow send cmd
  executeScript() {
    this.isScriptStatus = false;
    this.scriptStatus = "";
    this.selectedFeatures.forEach(function(x) { 
      x.executestatus ='';
   });
    this.resetForm();
    this.stopRequested = false;
    //var cmd = "ExecuteScripts()";
    var cmd = '{"Command" : "ExecuteScripts"}'
    setTimeout(()=>{
      this.SocketService.sendMessage(cmd);
    },100)

  }

  stopScript(){
    //var cmd = "StopScripts()";
    var cmd = '{"Command" : "StopScripts"}'
    this.SocketService.sendMessage(cmd);
    this.stopRequested = true;
  }




  //Getting response after click button of load script ok button
  customFunc(data) {
    this.selectedFeatures = [];
    this.selectedFeatures.length = 0;
    this.passDeleteRows = 0;
    this.scriptStatus = "";        
    this.SocketService.getLoadScripts().subscribe(message => {
      if(message.CommandStatus.Status == "Failure"){
        this.scriptStatus = message.CommandStatus.Message;
        this.isScriptStatus = true;
        this.scriptStatusCode = 1; 
      }else{
        this.scriptStatus = message.CommandStatus.Message;
        if (message) {
          this.getLoadScriptResp = message.Data;
          this.selectedFeatures = this.getLoadScriptResp;
        }
        if (this.selectedFeatures.length) {
          this.removeState = "1";
          this.saveState = "1";
          this.executeState = "1";
        }
      }
    });

  }

  //On selection of component
  onChangeofCmdScriptScript(i) {
    var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    var componentdropdownselecteditemindex = $("#mySelectCompScript").prop('selectedIndex');
    //var cmd = "ScriptComponentSelected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + componentdropdownselecteditemindex + ":null,-1:null,-1:null,-1:null,-1:null)";
    var cmd = '{"Command" : "ScriptComponentSelected","Args":'+'"'+'-1'+','+commanddropdownselecteditemindex+':null'+','+componentdropdownselecteditemindex+':null,-1:null,-1:null,-1:null,-1:null'+'"'+'}'
    this.SocketService.sendMessage(cmd);
  }
  onChangeofCmdScriptScriptResponse(){
   
    this.arg4Arr = [];
    this.arg3Arr = [];
    this.arg2Arr = [];
    this.arg1Arr = [];
    for (let i = 0; i < this.getComponentResp.length; i++) {
      if (this.getComponentResp[i].Name == 'Component') {

        if (this.getComponentResp[i].Row != 'Disabled') {
          if (this.getComponentResp[i].Row.includes(':')) {
            for (let k = 0; k < this.getComponentResp[i].Row.split(",").length; k++) {
              this.componentArr.push(this.getComponentResp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
            }
          }
          else {

            this.componentArr = this.getComponentResp[i].Row.split(",");
            this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
          }

        }
        else {
          this.scriptsForm.get('compData').setValue("");
          this.scriptsForm.get('compData').disable();
        }


      }
      if (this.getComponentResp[i].Name == 'Arg1') {
        if (this.getComponentResp[i].Row != 'Disabled') {
          if (this.getComponentResp[i].Row.includes(':')) {
            for (let k = 0; k < this.getComponentResp[i].Row.split(",").length; k++) {

              this.arg1Arr.push(this.getComponentResp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
            }
          }
          else {

            this.arg1Arr = this.getComponentResp[i].Row.split(",");
            this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg1Data').setValue("");
          this.scriptsForm.get('arg1Data').disable();
        }

      }
      else if (this.getComponentResp[i].Name == 'Arg2') {
        if (this.getComponentResp[i].Row != 'Disabled') {
          if (this.getComponentResp[i].Row.includes(':')) {
            for (let k = 0; k < this.getComponentResp[i].Row.split(",").length; k++) {

              this.arg2Arr.push(this.getComponentResp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
            }
          }
          else {

            this.arg2Arr = this.getComponentResp[i].Row.split(",");
            this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg2Data').setValue("");
          this.scriptsForm.get('arg2Data').disable();
        }


      }
      else if (this.getComponentResp[i].Name == 'Arg3') {
        if (this.getComponentResp[i].Row != 'Disabled') {
          if (this.getComponentResp[i].Row.includes(':')) {
            for (let k = 0; k < this.getComponentResp[i].Row.split(",").length; k++) {

              this.arg3Arr.push(this.getComponentResp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
            }
          }
          else {

            this.arg3Arr = this.getComponentResp[i].Row.split(",");
            this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg3Data').setValue("");
          this.scriptsForm.get('arg3Data').disable();
        }

      }
      else if (this.getComponentResp[i].Name == 'Arg4') {
        if (this.getComponentResp[i].Row != 'Disabled') {
          if (this.getComponentResp[i].Row.includes(':')) {
            for (let k = 0; k < this.getComponentResp[i].Row.split(",").length; k++) {

              this.arg4Arr.push(this.getComponentResp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
            }
          }
          else {

            this.arg4Arr = this.getComponentResp[i].Row.split(",");
            this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg4Data').setValue("");
          this.scriptsForm.get('arg4Data').disable();
        }
      }
    }
  }

  //On selection of Arg1

  onChangeofArg1ScriptScript(i) {
    var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    var componentdropdownselecteditemindex = $("#mySelectCompScript").prop('selectedIndex');
    var arg1dropdownselecteditemindex = $("#mySelectArg1Script").prop('selectedIndex');
    //var cmd = "ScriptArg1Selected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + componentdropdownselecteditemindex + ":null" + "," + arg1dropdownselecteditemindex + ":null" + "," + "-1:null,-1:null,-1:null)";
    var cmd = '{"Command" : "ScriptArg1Selected","Args":'+'"'+'-1,'+commanddropdownselecteditemindex+':null,'+componentdropdownselecteditemindex+':null,'+arg1dropdownselecteditemindex+':null,'+'-1:null,-1:null,-1:null'+'"'+'}'
    this.SocketService.sendMessage(cmd);
  }

  onChangeofArg1ScriptScriptResponse() {
    // var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    // var componentdropdownselecteditemindex = $("#mySelectCompScript").prop('selectedIndex');
    // var arg1dropdownselecteditemindex = $("#mySelectArg1Script").prop('selectedIndex');
    // var cmd = "ScriptArg1Selected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + componentdropdownselecteditemindex + ":null" + "," + arg1dropdownselecteditemindex + ":null" + "," + "-1:null,-1:null,-1:null)";
 

    this.arg4Arr = [];
    this.arg3Arr = [];
    this.arg2Arr = [];
    for (let i = 0; i < this.getArg1Resp.length; i++) {
      if (this.getArg1Resp[i].Name == 'Component') {

        if (this.getArg1Resp[i].Row != 'Disabled') {
          if (this.getArg1Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg1Resp[i].Row.split(",").length; k++) {
              this.componentArr.push(this.getArg1Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
            }
          }
          else {

            this.componentArr = this.getArg1Resp[i].Row.split(",");
            this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
          }

        }
        else {
          this.scriptsForm.get('compData').setValue("");
          this.scriptsForm.get('compData').disable();
        }


      }
      if (this.getArg1Resp[i].Name == 'Arg1') {
        if (this.getArg1Resp[i].Row != 'Disabled') {
          if (this.getArg1Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg1Resp[i].Row.split(",").length; k++) {

              this.arg1Arr.push(this.getArg1Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
            }
          }
          else {

            this.arg1Arr = this.getArg1Resp[i].Row.split(",");
            this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg1Data').setValue("");
          this.scriptsForm.get('arg1Data').disable();
        }

      }
      else if (this.getArg1Resp[i].Name == 'Arg2') {
        if (this.getArg1Resp[i].Row != 'Disabled') {
          if (this.getArg1Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg1Resp[i].Row.split(",").length; k++) {

              this.arg2Arr.push(this.getArg1Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
            }
          }
          else {

            this.arg2Arr = this.getArg1Resp[i].Row.split(",");
            this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg2Data').setValue("");
          this.scriptsForm.get('arg2Data').disable();
        }


      }
      else if (this.getArg1Resp[i].Name == 'Arg3') {
        if (this.getArg1Resp[i].Row != 'Disabled') {
          if (this.getArg1Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg1Resp[i].Row.split(",").length; k++) {

              this.arg3Arr.push(this.getArg1Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
            }
          }
          else {

            this.arg3Arr = this.getArg1Resp[i].Row.split(",");
            this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg3Data').setValue("");
          this.scriptsForm.get('arg3Data').disable();
        }

      }
      else if (this.getArg1Resp[i].Name == 'Arg4') {
        if (this.getArg1Resp[i].Row != 'Disabled') {
          if (this.getArg1Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg1Resp[i].Row.split(",").length; k++) {

              this.arg4Arr.push(this.getArg1Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
            }
          }
          else {

            this.arg4Arr = this.getArg1Resp[i].Row.split(",");
            this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg4Data').setValue("");
          this.scriptsForm.get('arg4Data').disable();
        }
      }
    }
  }




  //On selection of Arg2
  onChangeofArg2ScriptScript(i) {
    var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    var componentdropdownselecteditemindex = $("#mySelectCompScript").prop('selectedIndex');
    var arg1dropdownselecteditemindex = $("#mySelectArg1Script").prop('selectedIndex');
    var arg2dropdownselecteditemindex = $("#mySelectArg2Script").prop('selectedIndex');
    //var cmd = "ScriptArg2Selected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + componentdropdownselecteditemindex + ":null" + "," + arg1dropdownselecteditemindex + ":null" + "," + arg2dropdownselecteditemindex + ":null" + "," + "-1:null,-1:null)";
    var cmd = '{"Command" : "ScriptArg2Selected","Args":'+'"'+'-1,'+commanddropdownselecteditemindex+':null,'+componentdropdownselecteditemindex+':null,'+arg1dropdownselecteditemindex+':null,'+arg2dropdownselecteditemindex+':null,'+'-1:null,-1:null'+'"'+'}'
    this.SocketService.sendMessage(cmd);
  }

  onChangeofArg2ScriptScriptResponse(){

    this.arg4Arr = [];
    this.arg3Arr = [];

    for (let i = 0; i < this.getArg2Resp.length; i++) {
      if (this.getArg2Resp[i].Name == 'Component') {

        if (this.getArg2Resp[i].Row != 'Disabled') {
          if (this.getArg2Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg2Resp[i].Row.split(",").length; k++) {
              this.componentArr.push(this.getArg2Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
            }
          }
          else {

            this.componentArr = this.getArg2Resp[i].Row.split(",");
            this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
          }

        }
        else {
          this.scriptsForm.get('compData').setValue("");
          this.scriptsForm.get('compData').disable();
        }


      }
      if (this.getArg2Resp[i].Name == 'Arg1') {
        if (this.getArg2Resp[i].Row != 'Disabled') {
          if (this.getArg2Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg2Resp[i].Row.split(",").length; k++) {

              this.arg1Arr.push(this.getArg2Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
            }
          }
          else {

            this.arg1Arr = this.getArg2Resp[i].Row.split(",");
            this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg1Data').setValue("");
          this.scriptsForm.get('arg1Data').disable();
        }

      }
      else if (this.getArg2Resp[i].Name == 'Arg2') {
        if (this.getArg2Resp[i].Row != 'Disabled') {
          if (this.getArg2Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg2Resp[i].Row.split(",").length; k++) {

              this.arg2Arr.push(this.getArg2Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
            }
          }
          else {

            this.arg2Arr = this.getArg2Resp[i].Row.split(",");
            this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg2Data').setValue("");
          this.scriptsForm.get('arg2Data').disable();
        }


      }
      else if (this.getArg2Resp[i].Name == 'Arg3') {
        if (this.getArg2Resp[i].Row != 'Disabled') {
          if (this.getArg2Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg2Resp[i].Row.split(",").length; k++) {

              this.arg3Arr.push(this.getArg2Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
            }
          }
          else {

            this.arg3Arr = this.getArg2Resp[i].Row.split(",");
            this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg3Data').setValue("");
          this.scriptsForm.get('arg3Data').disable();
        }

      }
      else if (this.getArg2Resp[i].Name == 'Arg4') {
        if (this.getArg2Resp[i].Row != 'Disabled') {
          if (this.getArg2Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg2Resp[i].Row.split(",").length; k++) {

              this.arg4Arr.push(this.getArg2Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
            }
          }
          else {

            this.arg4Arr = this.getArg2Resp[i].Row.split(",");
            this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg4Data').setValue("");
          this.scriptsForm.get('arg4Data').disable();
        }
      }
    }
  }
  //On selection of Arg3
  onChangeofArg3ScriptScript(i) {
    var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    var componentdropdownselecteditemindex = $("#mySelectCompScript").prop('selectedIndex');
    var arg1dropdownselecteditemindex = $("#mySelectArg1Script").prop('selectedIndex');
    var arg2dropdownselecteditemindex = $("#mySelectArg2Script").prop('selectedIndex');
    var arg3dropdownselecteditemindex = $("#mySelectArg3Script").prop('selectedIndex');
    //var cmd = "ScriptArg3Selected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + componentdropdownselecteditemindex + ":null" + "," + arg1dropdownselecteditemindex + ":null" + "," + arg2dropdownselecteditemindex + ":null" + "," + arg3dropdownselecteditemindex + ":null" + "," + "-1:null)";
    var cmd = '{"Command" : "ScriptArg3Selected","Args":'+'"'+'-1,'+commanddropdownselecteditemindex+':null,'+componentdropdownselecteditemindex+':null,'+arg1dropdownselecteditemindex+':null,'+arg2dropdownselecteditemindex+':null,'+arg3dropdownselecteditemindex+':null,'+'-1:null'+'"'+'}'
    this.SocketService.sendMessage(cmd);
  }

  onChangeofArg3ScriptScriptResponse(){
    // var commanddropdownselecteditemindex = $("#mySelectCmdScript").prop('selectedIndex');
    // var componentdropdownselecteditemindex = $("#mySelectCompScript").prop('selectedIndex');
    // var arg1dropdownselecteditemindex = $("#mySelectArg1Script").prop('selectedIndex');
    // var arg2dropdownselecteditemindex = $("#mySelectArg2Script").prop('selectedIndex');
    // var arg3dropdownselecteditemindex = $("#mySelectArg3Script").prop('selectedIndex');
    // var cmd = "ScriptArg3Selected(-1" + "," + commanddropdownselecteditemindex + ":null" + "," + componentdropdownselecteditemindex + ":null" + "," + arg1dropdownselecteditemindex + ":null" + "," + arg2dropdownselecteditemindex + ":null" + "," + arg3dropdownselecteditemindex + ":null" + "," + "-1:null)";


    this.arg4Arr = [];
    for (let i = 0; i < this.getArg3Resp.length; i++) {
      if (this.getArg3Resp[i].Name == 'Component') {

        if (this.getArg3Resp[i].Row != 'Disabled') {
          if (this.getArg3Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg3Resp[i].Row.split(",").length; k++) {
              this.componentArr.push(this.getArg3Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
            }
          }
          else {

            this.componentArr = this.getArg3Resp[i].Row.split(",");
            this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
          }

        }
        else {
          this.scriptsForm.get('compData').setValue("");
          this.scriptsForm.get('compData').disable();
        }


      }
      if (this.getArg3Resp[i].Name == 'Arg1') {
        if (this.getArg3Resp[i].Row != 'Disabled') {
          if (this.getArg3Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg3Resp[i].Row.split(",").length; k++) {

              this.arg1Arr.push(this.getArg3Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
            }
          }
          else {

            this.arg1Arr = this.getArg3Resp[i].Row.split(",");
            this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg1Data').setValue("");
          this.scriptsForm.get('arg1Data').disable();
        }

      }
      else if (this.getArg3Resp[i].Name == 'Arg2') {
        if (this.getArg3Resp[i].Row != 'Disabled') {
          if (this.getArg3Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg3Resp[i].Row.split(",").length; k++) {

              this.arg2Arr.push(this.getArg3Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
            }
          }
          else {

            this.arg2Arr = this.getArg3Resp[i].Row.split(",");
            this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg2Data').setValue("");
          this.scriptsForm.get('arg2Data').disable();
        }


      }
      else if (this.getArg3Resp[i].Name == 'Arg3') {
        if (this.getArg3Resp[i].Row != 'Disabled') {
          if (this.getArg3Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg3Resp[i].Row.split(",").length; k++) {

              this.arg3Arr.push(this.getArg3Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
            }
          }
          else {

            this.arg3Arr = this.getArg3Resp[i].Row.split(",");
            this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg3Data').setValue("");
          this.scriptsForm.get('arg3Data').disable();
        }

      }
      else if (this.getArg3Resp[i].Name == 'Arg4') {
        if (this.getArg3Resp[i].Row != 'Disabled') {
          if (this.getArg3Resp[i].Row.includes(':')) {
            for (let k = 0; k < this.getArg3Resp[i].Row.split(",").length; k++) {

              this.arg4Arr.push(this.getArg3Resp[i].Row.split(",")[k].slice(0, -1).replace(/([^:]*):/g, '$1'));
              this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
            }
          }
          else {

            this.arg4Arr = this.getArg3Resp[i].Row.split(",");
            this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
          }
        }
        else {
          this.scriptsForm.get('arg4Data').setValue("");
          this.scriptsForm.get('arg4Data').disable();
        }
      }
    }
  }

  ScriptStatusRes(status){
    var endsWithString = "script";
    var ScriptStatusInPrgress = 0;
    var ScriptStatusFailed = 1;
    var ScriptStatusSuccesful = 2;
    var ScriptStatusInvalid = 3;
    var ScriptStatusNotsupported = 4;
    var ScriptStatusStopGfxWorkload = 5;
    var stop_gfx_workload = 6;
    var ScriptExecutionInPrgressMsg = "Execution In-Progress";
    var ScriptExecutionFailedMsg = "Execution Failed";
    var ScriptExecutionSuccesfulMsg = "Execution Successful";
    var ScriptExecutionInvalid = "Invalid Script";
    var ScriptExecutionnotSupported = "Not Supported";
    this.scriptStatusCode =status[0].Row;
    this.isScriptStatus = true; 
    if(status[0].Row == ScriptStatusInPrgress){
      this.scriptStatus = ScriptExecutionInPrgressMsg;
    }
    else if (status[0].Row == ScriptStatusStopGfxWorkload){
      }
    else if(status[0].Row == ScriptStatusFailed){
      this.StopGfxWorkload(endsWithString);
      this.scriptStatus = ScriptExecutionFailedMsg;
    }
    else if(status[0].Row == ScriptStatusSuccesful){
      this.StopGfxWorkload(endsWithString);
      this.scriptStatus = ScriptExecutionSuccesfulMsg;
    }
    else if(status[0].Row == ScriptStatusInvalid){
      this.scriptStatus = ScriptExecutionInvalid;
    }
    else if (status == stop_gfx_workload){
			this.StopGfxWorkload(endsWithString);
		}

    

    /*var count =0;		
    $(xmlData).find('Count').each(function() {
      count  = $(this).text();
    });	
    if(count>0){
      launchGFXWorkloadFromUI(xmlData, count, endsWithString );
    }*/
  }

  
launchGfxWorkload(filepath,divid,frameid){
	$("#"+frameid).attr('src', filepath);
  $("#"+frameid).css({'height': '98%', 'width': '100px', 'border': 'none'});
	$("#"+divid).dialog({
		width: 150,
		height: 470,
		overflow: "hidden",
		modal: false,
		dialogClass: "no-close",
		closeOnEscape: false,
		close: function () {
			$("#"+frameid).attr('src', "about:blank");
		}
	});
  $("#"+divid).css('z-index:10000');
  $(".ui-dialog-titlebar-close").hide();
	return false;
}

StopGfxWorkload(gfxDialogIdEndsWith){
		var gfxDlgLen = this.g_GfxDialogId.length;
	for(var i=0;i<gfxDlgLen;i++){
		var strId = "";
		strId = this.g_GfxDialogId[i]+"";
		var result = strId.search(gfxDialogIdEndsWith);
		if(result > -1){
			var gfxDivId = this.g_GfxDialogId[i];
			var gfxFrameId = gfxDivId.replace("frame","div");
			var div = document.getElementById(gfxDivId);
			$("#"+gfxDivId).dialog('close');
			$('#'+gfxFrameId).empty();
			$("#"+gfxDivId).remove();			
			this.g_GfxDialogId.splice(i,1);			
		}
		else{
			i++;
		}
	}
}



launchGFXWorkloadFromUI(gfxfilename, gfxarguments, count, endsWithString ){
	var filename = [];
		var args = [];
		var workloadCount =0;
   
		for(workloadCount =0; workloadCount < count ; workloadCount++){
		//$(xml_string).find('Filename').each(function() {
			filename[workloadCount] = gfxfilename;
		//});
		//$(xml_string).find('Arguments').each(function() {
			args[workloadCount] = gfxarguments;
	//	});
		var gfxDivId = "divGfx" + workloadCount +"_"+ endsWithString;
		var gfxFrameId = "frameGfx" + workloadCount +"_"+ endsWithString;
		
		var filepath = filename[workloadCount]+'?str='+args[workloadCount];
		
		var gfxContainerDiv = document.createElement('div');
		gfxContainerDiv.setAttribute('id', gfxDivId);  
		gfxContainerDiv.setAttribute('class', "gfxDivStyle"); 
		
		var gfxContainerFrame = document.createElement('iframe');
		gfxContainerFrame.setAttribute('id', gfxFrameId);  
		gfxContainerFrame.setAttribute('class',"gfxFrameStyle"); 
		
		var body = document.getElementById("pageBody");
		body.appendChild(gfxContainerDiv);
		gfxContainerDiv.appendChild(gfxContainerFrame);
		gfxContainerDiv.setAttribute('title', "GFX Workload");
		this.launchGfxWorkload(filepath,gfxDivId,gfxFrameId);
		this.g_GfxDialogId.push(gfxDivId);
	}
}

}
