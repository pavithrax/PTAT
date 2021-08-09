import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { SocketService } from '../db/socket.service';
@Component({
   selector: 'app-savescript',
   templateUrl: './savescript.component.html',
   styleUrls: ['./savescript.component.css']
})
export class SavescriptComponent implements OnInit {
   saveForm: FormGroup;
   display = 'none';
   messageShow = false;
   scriptFilePath = '';
   disableScriptPath = true;
   getToolInfoResponse: any;
   osInformation:any;

   constructor(fb: FormBuilder, private SocketService: SocketService) {
      this.saveForm = fb.group({
         filePathVal: [null, [Validators.required]]

      })
   }


   ngOnInit() {
      this.SocketService.getToolInfo().subscribe(message => {
         if (message) {
            this.getToolInfoResponse = message;
           // console.log(this.getToolInfoResponse);
            for (var i = 0; i < this.getToolInfoResponse.length; i++) {
               if (this.getToolInfoResponse[i].key == 'ScriptFilePath') {
                   this.scriptFilePath = this.getToolInfoResponse[i].value;
               }else if(this.getToolInfoResponse[i].key == 'OSVersion'){
                  if(this.getToolInfoResponse[i].value == "Windows 10 Enterprise"){
                     this.osInformation = "windows"
                  }else{
                     this.osInformation = "others"
                  }
                 }
            }
         }
      });

      this.SocketService.getSaveScripts().subscribe(message => {
         if (message) {
            this.saveForm.reset();
         }
      });
   }

   // Opens modal pop up
   openSaveModal() {
      this.display = 'block';
   }

   // Closes modal pop up
   closeModal() {
      this.display = 'none';
      this.saveForm.reset();
      this.messageShow = false;
   }

   // File name validation only allow text
   keyPressalphabOnly(evt) {
      this.messageShow = false;
      evt = (evt) ? evt : event;
      var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :
         ((evt.which) ? evt.which : 0));
      if (charCode > 31 && (charCode < 65 || charCode > 90) &&
         (charCode < 97 || charCode > 122) && (charCode < 48 || charCode > 57)) {

         return false;
      }
      return true;
   }


   //On click save button send cmd 
   submitSaveForm() {
      if (this.saveForm.valid) {
         var filePathVal = this.saveForm.getRawValue().filePathVal;
         var actualfileName = filePathVal + '.xml';
         var filePath = this.scriptFilePath + actualfileName;
         var finalFilePath = ""
         if(this.osInformation = "windows"){
            finalFilePath = filePath.replace(/\\/g,"\\\\");
         }else{
            finalFilePath = filePath.replace(/\\/g,"////");
         }
        // var cmd = "SaveScript(" + this.scriptFilePath + actualfileName + ")";
         var cmd = '{"Command" : "SaveScript","Args":'+'"'+finalFilePath+'"'+'}'
         this.SocketService.sendMessage(cmd);
         this.display = 'none';
         this.messageShow = false;
       
      }
      else {
         this.messageShow = true;
      }
   }
}
