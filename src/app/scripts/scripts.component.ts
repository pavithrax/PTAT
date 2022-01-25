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
  dropdownresponse:any;
  getComponentResp:any;
  componentArr = [];
  arg1Arr = [];
  arg2Arr = [];
  arg3Arr = [];
  arg4Arr = [];
  key = 0;
  removeState = '0';
  saveState = '0';
  executeState = '0';
  resetState = '1';
  selectedFeatures: any = [];
  selectedFeatures1: any = [];
  arr = [];
  isAllChecked = false;
  enableStop = false;
  isScriptStatus = false;
  scriptStatusCode = 0;
  stopRequested = false;
  scriptStatus = '';
  getArg2Resp: any;
  getArg4Resp: any;
  getArg3Resp: any;
  getArg1Resp: any;
  scriptDeleteList = [];
  getLoadScriptResp = [];
  getScriptResponse: any;
  getComponentResp1: any;
  getArg2Resp1: any;
  getArg3Resp1: any;
  getArg4Resp1: any;
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
        var data = message.Data;
        var count = message.Count;
        var gfxFileName = message.Filename;
        var gfxArguments = message.Arguments;
        var endsWithString = "script";
        if(count !=undefined){
          gfxFileName = "assets//" + gfxFileName;
          this.launchGFXWorkloadFromUI(gfxFileName,gfxArguments, count, endsWithString );
        }
        else{
          var endsWithString = "script";
          // this.ScriptStatusRes(status);
          this.isScriptStatus = true; 
          
          if(data.Status == 'Execution In-Progress') {
            this.scriptStatusCode = 0;
          } else if(data.Status == 'Execution Successful') {
            this.scriptStatusCode = 2;
          } else  {
            this.scriptStatusCode = 1;
          }
          this.scriptStatus = data.Status;
          if(data.Status == 'Success' || data.Status == 'Failed' ) {
            this.StopGfxWorkload(endsWithString);
          }
        }
      }
    });

    this.SocketService.GetScriptDataRes().subscribe(message => {
      if (message) {
        this.getScriptResponse = message.Data;
        this.componentArr = [];
        this.arg1Arr = [];
        this.arg2Arr = [];
        this.arg3Arr = [];
        this.arg4Arr = [];
        this.scriptsForm.get('compData').disable();
        this.scriptsForm.get('arg1Data').disable();
        this.scriptsForm.get('arg2Data').disable();
        this.scriptsForm.get('arg3Data').disable();
        this.scriptsForm.get('arg4Data').disable();
        this.addState = '0';
        if(message.Data.length > 0) {
          this.respScriptArr = message.Data;
          this.scriptsForm.get('selectedOption').setValue(message.Data[this.key])
        }
        
      }
    });

    this.SocketService.ScriptCommandSelectedRes().subscribe(message => {
      if (message) {
        // this.dropdownresponse = message.Data[0].DropDownList;
        this.dropdownresponse = message.Data;
        // this.dropdownresponse.length == 0 || 
        if(this.dropdownresponse.Command == 'None'){
          this.scriptsForm.reset();
          this.scriptsForm.get('selectedOption').setValue(this.respScriptArr[this.key]);
          this.scriptsForm.get('compData').disable();
          this.scriptsForm.get('arg1Data').disable();
          this.scriptsForm.get('arg2Data').disable();
          this.scriptsForm.get('arg3Data').disable();
          this.scriptsForm.get('arg4Data').disable();
          this.addState = "0";
        } else {
          this.ReceiveScriptResp();
        }
       

      }
    });

    this.SocketService.ScriptComponentSelectedRes().subscribe(message => {
      if (message) {
        this.getComponentResp = message.Data;
        if (this.getComponentResp) {
          this.onChangeofCmdScriptScriptResponse();
        }
      }
    });

    this.SocketService.ScriptArg1SelectedRes().subscribe(message => {
      if (message) {
        this.getArg1Resp1 = message.Data;
        if (this.getArg1Resp1) {
          this.getArg1Resp = this.getArg1Resp1;
          this.onChangeofArg1ScriptScriptResponse();
        }

      }
    });

    this.SocketService.ScriptArg2SelectedRes().subscribe(message => {
      if (message) {
        this.getArg2Resp1 = message.Data;
        if (this.getArg2Resp1) {
          this.getArg2Resp = this.getArg2Resp1;
          this.onChangeofArg2ScriptScriptResponse();
        }
      }
    });

    this.SocketService.ScriptArg3SelectedRes().subscribe(message => {
      if (message) {
        this.getArg3Resp1 = message.Data;
        if (this.getArg3Resp1) {
          this.getArg3Resp = this.getArg3Resp1;
          this.onChangeofArg3ScriptScriptResponse();
        }
      }
    });

    this.SocketService.ScriptArg4SelectedRes().subscribe(message => {
      if (message) {
        this.getArg4Resp1 = message.Data;
        if (this.getArg4Resp1) {
          this.getArg4Resp = this.getArg4Resp1;
          this.onChangeofArg4ScriptScriptResponse();
        }
      }
    });
    this.SocketService.ScriptAddRowRes().subscribe(message => {
      if (message) {
        var scriptsArr =
        {
          "Command": this.scriptsForm.get('selectedOption').value, "Component": this.scriptsForm.get('compData').value, "Arg1": this.scriptsForm.get('arg1Data').value, "Arg2": this.scriptsForm.get('arg2Data').value, "Arg3": this.scriptsForm.get('arg3Data').value, "Arg4": this.scriptsForm.get('arg4Data').value, "selected": false, "executestatus": ""

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

    this.SocketService.getExecuteScripts().subscribe(message => {
      if(message) { 
        this.enableStop = true;
        
      }
    })
    this.SocketService.getExecuteScriptsError().subscribe(message => {
      this.resetState = '1';
      if (message) {
        // this.scriptStatus = "Invalid Script";
        this.scriptStatus = message.CommandStatus.Message
 this.scriptStatusCode = 1; 
 this.isScriptStatus =true;
 this.enableStop = false; 
      }
    });

    this.SocketService.getRowStatus().subscribe(message => {
      if (message) {
        // var arrStatus =  message.Data[0].Row.split(",");
        this.rowStatusIndex = message.Data.Row;
        this.enableStop = true;
        // {"Command":"RowStatus","CommandStatus":{"Status":"Success","Message":""},"Data":[{"Row":"0,Success"}]}
      }
    });
    this.SocketService.getScriptCommandLineStatus().subscribe(message => {
      if (message) {
        if(message.Data.Status == 'Failed') {
          this.selectedFeatures[message.Data.Row].executestatus = message.Data.Status;
        } else {
          this.selectedFeatures[this.rowStatusIndex].executestatus = message.Data.Status;
        }
        
        if(message.Data.Component == "gfx"){
          this.StopGfxWorkload("script");
        }
      }
    });

    this.SocketService.getStopScriptsStatus().subscribe(message => {
      this.resetState = '1';
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
    var cmd = '{"Command": "ScriptCommandSelected","Args": {"Command": "'+this.scriptsForm.get('selectedOption').value +'","Component": "","Arg1": "","Arg2": "","Arg3": "","Arg4": ""}}'
      
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
    
    // else {
      if(this.dropdownresponse.Component.length > 0 && this.dropdownresponse.Component != '') {
        this.componentArr = this.dropdownresponse.Component; // adding data to component array
        this.scriptsForm.get('compData').setValue(this.componentArr[this.key]);
      }else {
        this.scriptsForm.get('compData').setValue("");
        this.scriptsForm.get('compData').disable();
      }


      if(this.dropdownresponse.Arg1.length > 0 && this.dropdownresponse.Arg1 != '') {
        this.arg1Arr = this.dropdownresponse.Arg1; // adding data to Arg1 array
        this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
      }else {
        this.scriptsForm.get('arg1Data').setValue("");
        this.scriptsForm.get('arg1Data').disable();
      }

      if(this.dropdownresponse.Arg2.length > 0 && this.dropdownresponse.Arg2 != '') {
        this.arg2Arr = this.dropdownresponse.Arg2; // adding data to Arg2 array
        this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
      }else {
        this.scriptsForm.get('arg2Data').setValue("");
        this.scriptsForm.get('arg2Data').disable();
      }

      if(this.dropdownresponse.Arg3.length > 0 && this.dropdownresponse.Arg3 != '') {
        this.arg3Arr = this.dropdownresponse.Arg3; // adding data to Arg3 array
        this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.arg3Arr.length - 1]);
      }else {
        this.scriptsForm.get('arg3Data').setValue("");
        this.scriptsForm.get('arg3Data').disable();
      }

      if(this.dropdownresponse.Arg4.length > 0 && this.dropdownresponse.Arg4 != '') {
        this.arg4Arr = this.dropdownresponse.Arg4; // adding data to Arg4 array
        this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
      }else {
        this.scriptsForm.get('arg4Data').setValue("");
        this.scriptsForm.get('arg4Data').disable();
      }
    
  }


  //Adding Script to table data
  addScript() {

    var scriptsArr =
    {
      "Command": this.scriptsForm.get('selectedOption').value, "Component": this.scriptsForm.get('compData').value, "Arg1": this.scriptsForm.get('arg1Data').value, "Arg2": this.scriptsForm.get('arg2Data').value, "Arg3": this.scriptsForm.get('arg3Data').value, "Arg4": this.scriptsForm.get('arg4Data').value, "selected": false, "executestatus": ""

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

   
    var cmd = '{"Command": "ScriptAddRow","Args": {"Command": "'+this.scriptsForm.get('selectedOption').value +'","Component": "'+this.scriptsForm.get('compData').value +'","Arg1": "'+this.scriptsForm.get('arg1Data').value +'","Arg2": "'+this.scriptsForm.get('arg2Data').value +'","Arg3": "'+this.scriptsForm.get('arg3Data').value +'","Arg4": "'+this.scriptsForm.get('arg4Data').value +'"}}'

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
          var cmd = '{"Command" : "ScriptRemoveRows","Args":'+'['+this.arr+']'+'}'
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
    
    var cmd = '{"Command":"ScriptRowsDragAndDrop","Args":{"previousIndex":'+event.previousIndex+',"currentIndex":'+event.currentIndex+'}}';
    this.SocketService.sendMessage(cmd);
    

  }
 
  //On button click of execute flow send cmd
  executeScript() {
    this.resetState = '0';
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
    this.resetState = '1';
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
      if(message.CommandStatus.Status == "Failure" || message.CommandStatus.Status == 'error'){
        this.scriptStatus = message.CommandStatus.Message;
        this.isScriptStatus = true;
        this.scriptStatusCode = 1; 
      }else{
        this.scriptStatus = message.CommandStatus.Message;
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
    
    var cmd = '{"Command": "ScriptComponentSelected","Args": {"Command": "'+this.scriptsForm.get('selectedOption').value +'","Component": "'+this.scriptsForm.get('compData').value +'","Arg1": "","Arg2": "","Arg3": "","Arg4": ""}}'
    this.SocketService.sendMessage(cmd);
  }
  onChangeofCmdScriptScriptResponse(){
   
    this.arg4Arr = [];
    this.arg3Arr = [];
    this.arg2Arr = [];
    this.arg1Arr = [];

    if(this.getComponentResp.Arg1.length > 0 && this.getComponentResp.Arg1 != '') {
      this.arg1Arr = this.getComponentResp.Arg1; // adding data to Arg1 array
      this.scriptsForm.get('arg1Data').setValue(this.arg1Arr[this.key]);
    }else {
      this.scriptsForm.get('arg1Data').setValue("");
      this.scriptsForm.get('arg1Data').disable();
    }

    if(this.getComponentResp.Arg2.length > 0 && this.getComponentResp.Arg2 != '') {
      this.arg2Arr = this.getComponentResp.Arg2; // adding data to Arg2 array
      this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
    }else {
      this.scriptsForm.get('arg2Data').setValue("");
      this.scriptsForm.get('arg2Data').disable();
    }

    if(this.getComponentResp.Arg3.length > 0 && this.getComponentResp.Arg3 != '') {
      this.arg3Arr = this.getComponentResp.Arg3; // adding data to Arg3 array
      this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.arg3Arr.length - 1]);
    }else {
      this.scriptsForm.get('arg3Data').setValue("");
      this.scriptsForm.get('arg3Data').disable();
    }

    if(this.getComponentResp.Arg4.length > 0 && this.getComponentResp.Arg4 != '') {
      this.arg4Arr = this.getComponentResp.Arg4; // adding data to Arg4 array
      this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
    }else {
      this.scriptsForm.get('arg4Data').setValue("");
      this.scriptsForm.get('arg4Data').disable();
    }
    
  }

  //On selection of Arg1

  onChangeofArg1ScriptScript(i) {
    
    var cmd = '{"Command": "ScriptArg1Selected","Args": {"Command": "'+this.scriptsForm.get('selectedOption').value +'","Component": "'+this.scriptsForm.get('compData').value +'","Arg1": "'+this.scriptsForm.get('arg1Data').value +'","Arg2": "","Arg3": "","Arg4": ""}}'
    this.SocketService.sendMessage(cmd);
  }

  onChangeofArg1ScriptScriptResponse() {
  
    this.arg4Arr = [];
    this.arg3Arr = [];
    this.arg2Arr = [];

    if(this.getArg1Resp.Arg2.length > 0 && this.getArg1Resp.Arg2 != '') {
      this.arg2Arr = this.getArg1Resp.Arg2; // adding data to Arg2 array
      this.scriptsForm.get('arg2Data').setValue(this.arg2Arr[this.key]);
    }else {
      this.scriptsForm.get('arg2Data').setValue("");
      this.scriptsForm.get('arg2Data').disable();
    }

    if(this.getArg1Resp.Arg3.length > 0 && this.getArg1Resp.Arg3 != '') {
      this.arg3Arr = this.getArg1Resp.Arg3; // adding data to Arg3 array
      this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.arg3Arr.length - 1]);
    }else {
      this.scriptsForm.get('arg3Data').setValue("");
      this.scriptsForm.get('arg3Data').disable();
    }

    if(this.getArg1Resp.Arg4.length > 0 && this.getArg1Resp.Arg4 != '') {
      this.arg4Arr = this.getArg1Resp.Arg4; // adding data to Arg4 array
      this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
    }else {
      this.scriptsForm.get('arg4Data').setValue("");
      this.scriptsForm.get('arg4Data').disable();
    }
    
  }




  //On selection of Arg2
  onChangeofArg2ScriptScript(i) {
    
    var cmd = '{"Command": "ScriptArg2Selected","Args": {"Command": "'+this.scriptsForm.get('selectedOption').value +'","Component": "'+this.scriptsForm.get('compData').value +'","Arg1": "'+this.scriptsForm.get('arg1Data').value +'","Arg2": "'+this.scriptsForm.get('arg2Data').value +'","Arg3": "","Arg4": ""}}'
    this.SocketService.sendMessage(cmd);
  }

  onChangeofArg2ScriptScriptResponse(){

    this.arg4Arr = [];
    this.arg3Arr = [];

    if(this.getArg2Resp.Arg3.length > 0 && this.getArg2Resp.Arg3 != '') {
      this.arg3Arr = this.getArg2Resp.Arg3; // adding data to Arg3 array
      this.scriptsForm.get('arg3Data').setValue(this.arg3Arr[this.arg3Arr.length - 1]);
    }else {
      this.scriptsForm.get('arg3Data').setValue("");
      this.scriptsForm.get('arg3Data').disable();
    }

    if(this.getArg2Resp.Arg4.length > 0 && this.getArg2Resp.Arg4 != '') {
      this.arg4Arr = this.getArg2Resp.Arg4; // adding data to Arg4 array
      this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
    }else {
      this.scriptsForm.get('arg4Data').setValue("");
      this.scriptsForm.get('arg4Data').disable();
    }
   
  }
  //On selection of Arg3
  onChangeofArg3ScriptScript(i) {
    
    var cmd = '{"Command": "ScriptArg3Selected","Args": {"Command": "'+this.scriptsForm.get('selectedOption').value +'","Component": "'+this.scriptsForm.get('compData').value +'","Arg1": "'+this.scriptsForm.get('arg1Data').value +'","Arg2": "'+this.scriptsForm.get('arg2Data').value +'","Arg3": "'+this.scriptsForm.get('arg3Data').value +'","Arg4": ""}}'
    this.SocketService.sendMessage(cmd);
  }

  onChangeofArg3ScriptScriptResponse(){
    
    this.arg4Arr = [];
    

    if(this.getArg3Resp.Arg4.length > 0 && this.getArg3Resp.Arg4 != '') {
      this.arg4Arr = this.getArg3Resp.Arg4; // adding data to Arg4 array
      this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
    }else {
      this.scriptsForm.get('arg4Data').setValue("");
      this.scriptsForm.get('arg4Data').disable();
    }
    
  }

  onChangeofArg4ScriptScriptResponse(){
    

    this.arg4Arr = [];
    

    if(this.getArg3Resp.Arg4.length > 0 && this.getArg3Resp.Arg4 != '') {
      this.arg4Arr = this.getArg3Resp.Arg4; // adding data to Arg4 array
      this.scriptsForm.get('arg4Data').setValue(this.arg4Arr[this.key]);
    }else {
      this.scriptsForm.get('arg4Data').setValue("");
      this.scriptsForm.get('arg4Data').disable();
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



launchGFXWorkloadFromUI(gfxfilename, gfxarguments, count, endsWithString ){ // used for platforms other than windows
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
