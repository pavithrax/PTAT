import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SocketService } from '../db/socket.service';
import { DataService } from '../services/data.service';

@Component({
   selector: 'app-loadscript',
   templateUrl: './loadscript.component.html',
   styleUrls: ['./loadscript.component.css']
})
export class LoadscriptComponent implements OnInit {
   @Input() count: any;
   @Output() sendCount: EventEmitter<string> = new EventEmitter<string>();
   loadForm: FormGroup;
   loadFilestArr: any[];
   display = 'none';
   key = 0;
   disableLoadScriptPath = true;
   loadScriptFilePath = '';
   getToolInfoResponse: any;
   isLoadScript = false;
   loadScriptLogFileCount :any = 1;
   osInformation:any = "";
  
   constructor(fb: FormBuilder, private SocketService: SocketService, private DataService: DataService) {
      this.loadForm = fb.group({
         filesVal: [null]

      })

   }

   ngOnInit() {
  
      this.SocketService.getToolInfo().subscribe(message => {
         if (message) {
            this.getToolInfoResponse = message;
            var len = this.getToolInfoResponse.length;
            var loadScriptFilePathDefault = ""
            for (var i = 0; i < len; i++) {
               if (this.getToolInfoResponse[i].key == 'ScriptFilePath') {
                  loadScriptFilePathDefault = this.getToolInfoResponse[i].value;
               }else if(this.getToolInfoResponse[i].key == 'OSVersion'){
                  if(this.getToolInfoResponse[i].value == "Windows 10 Enterprise"){
                     this.osInformation = "windows"
                  }else{
                     this.osInformation = "others"
                  }
                 }
            }
            if(this.osInformation = "windows"){
               this.loadScriptFilePath = loadScriptFilePathDefault.replace(/\\/g,"\\\\");
            }else{
               this.loadScriptFilePath = loadScriptFilePathDefault.replace(/\\/g,"////");
            }
         }
      });

      this.SocketService.ScriptRemoveRowsRes().subscribe(message => {
         if (message) {
            if(this.isLoadScript == true)
            {
               this.toSendLoadScriptCmd();
            }
            
         }
      });
   }
   

   //On click of load scripts button send cmd
   openLoadModal(data) {
      //var cmd = "GetFilesInDir("+this.loadScriptFilePath+",script)";
      var command  = '{"Command" : "GetFilesInDir","Args":'+'"'+this.loadScriptFilePath+',script'+'"'+'}'
      this.SocketService.sendMessage(command);
      this.getSuccessResponse();
   }
   //On success of load scripts display pop up
   getSuccessResponse() {
     this.SocketService.getFilesInDir().subscribe(message => {
      if (message) {
      if(message.Data.List != ""){
         this.loadFilestArr = message.Data.List;
         this.loadForm.get('filesVal').setValue(this.loadFilestArr[this.key].Data);
         this.loadScriptLogFileCount = 1;
      }else{
         this.loadScriptLogFileCount = 0;
         this.loadFilestArr = [];
      }

      }
   })

      this.display = 'block';
   }
   // Closes modal pop up
   closeModal() {
      this.display = 'none';
   }

   //On click of refresh button
   refreshForm() {
      //var cmd = "GetFilesInDir("+this.loadScriptFilePath+",script)";
      var command  = '{"Command" : "GetFilesInDir","Args":'+'"'+this.loadScriptFilePath+',script'+'"'+'}'
      this.SocketService.sendMessage(command);
      this.getSuccessRefreshResponse();
   }
   getSuccessRefreshResponse() {
      this.SocketService.getFilesInDir().subscribe(message => {
         if (message) {
            if(message.Data.List != ""){
               this.loadFilestArr = message.Data.List;
               this.loadForm.get('filesVal').setValue(this.loadFilestArr[this.key].Data);
               this.loadScriptLogFileCount = 1;
            }else{
               this.loadScriptLogFileCount = 0;
               this.loadFilestArr = [];
            }
         }
      });
   }

   //On click of load button send command
   submitLoadForm() {
      let countArr = [];
      if (this.count) {
      while(this.count != 0){
         countArr.push(this.count-1);
         this.count--;
      }
      countArr.reverse();
      //var cmd = "ScriptRemoveRows(" + countArr.toString() + ")";
      var command  = '{"Command" : "ScriptRemoveRows","Args":'+'"'+countArr.toString()+'"'+'}'
      this.SocketService.sendMessage(command);
         this.isLoadScript = true;
         this.display = 'none';
      }
      else {
         //var cmd = "LoadScript(" +this.loadScriptFilePath + this.loadForm.get('filesVal').value +")";
         var path = this.loadScriptFilePath + this.loadForm.get('filesVal').value
         var command  = '{"Command" : "LoadScript","Args":'+'"'+path+'"'+'}'
         this.SocketService.sendMessage(command);
         this.display = 'none';
         this.sendCount.emit("1");
      }
   }

   //Consecutive send cmds
   toSendLoadScriptCmd() {
      //var cmd = "LoadScript(" +this.loadScriptFilePath + this.loadForm.get('filesVal').value +")";
      var path = this.loadScriptFilePath + this.loadForm.get('filesVal').value
      var command  = '{"Command" : "LoadScript","Args":'+'"'+path+'"'+'}'
      this.SocketService.sendMessage(command);

      this.sendCount.emit("1");
      this.isLoadScript = false;

   }
}
