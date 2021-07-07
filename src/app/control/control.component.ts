import { Component,ViewChild,OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import { HostListener } from "@angular/core";
import {MatSidenav} from '@angular/material/sidenav'; 

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  @ViewChild('sidenav',{static: false}) sidenav: MatSidenav;
  //controlLoadArray:any;
  controlResponse:any;
  setControlResponse:any;
  controlName:any;
  hasClass:any=false;
  controlId:any;
  firstItemName:any;
  zindex:boolean = true;
  getToolInfoResponse: any;
  controlWarningPopupStatus:any = 0;
  setControlCommonCommand:any;
  showControlWarningModal:boolean;
  controlWarningCheckBoxStatus: boolean = false;

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if(event.target.scrollTop == 0 )   {
    this.zindex = true;
    }else{
      this.zindex = false;
    }
  }
  enableIndex(){
    this.zindex = true;
  }
  constructor(private SocketService: SocketService,private spinner: NgxSpinnerService) { }

  cmdSetControl = "SetControl(#componentName,#componentIndex,#controlName,#controlIndex,#instanceName,#instanceIndex,#newvalue)";

  ngOnInit() {

    this.SocketService.getToolInfo().subscribe(message => {
      if (message) {
         this.getToolInfoResponse = message;
         for (var i = 0; i < this.getToolInfoResponse.length; i++) {
            if (this.getToolInfoResponse[i].key == 'ShowControlWarning') {
               this.controlWarningPopupStatus = this.getToolInfoResponse[i].value;
            }
         }
      } else {

         this.getToolInfoResponse = [];
      }
   });



    this.SocketService.getControlDataRes().subscribe(message => {
      if (message) {
        this.controlResponse = message.Data;
        var firstContolName = message.Data[0].DropDownList[0].Name;
        setTimeout(() => {
          this.controlTree('00'+';'+firstContolName);
          this.spinner.hide();
        }, 0); 
      }
    });

    this.SocketService.updateControlDataRes().subscribe(message => {
      if (message) {
        //this.controlId = splitResponce[0];
        // this.firstItemName = splitResponce[1];
        // var firstContolName = message.Data[0].DropDownList[0].Name;
        this.controlResponse = message.Data;
        //var firstContolName = this.firstItemName;
        setTimeout(() => {
          // this.controlTree('00'+';'+firstContolName);
          this.controlTree( this.controlId+';'+this.firstItemName);
          this.spinner.hide();
        }, 0); 
      }
    });


    this.SocketService.SetControlRes().subscribe(message => {
      if (message) {
       this.setControlResponse = message;
      let setControlReceived = this.setControlResponse.Data.DropDownData.updateCurrentLevel;
      let parentTreeNodeId = this.setControlResponse.Data.Index;
      let childTreeNodeId = this.setControlResponse.Data.DropDownData.Index;
      var len = setControlReceived.length;
        for(let i =0 ; i< len ; i++){
          let rowAndValue = setControlReceived[i].split(';');
          let rowId = rowAndValue[0];
          let currentLevelData = rowAndValue[1];
          let classToAppend = "controlValSetResponse"+ parentTreeNodeId + childTreeNodeId+rowId;
          $("."+classToAppend).html(currentLevelData);
        }
      }
    });
   
  }

  expandCollapse(item){
    item.expand = !item.expand;
  }

  controlTree(responce){
    var splitResponce = responce.split(";");

    this.controlId = splitResponce[0];
    this.firstItemName = splitResponce[1];

    this.controlName = this.firstItemName;
    let controlTable = "controlTable" + this.controlId;
    let controlTree = "controlTree" + this.controlId;
    $('.controlTableCC').addClass('hide');
    $('.controlTreeCC').removeClass('colorSelectedTree');
    $("."+controlTree).addClass('colorSelectedTree');  
    $("."+controlTable).removeClass('hide');
  }
  
  setControl(arg,arg1,arg2,arg3,arg4,arg5){
    let componentName = arg2;
    let componentIndex = arg3;
    let controlName = arg4;
    let controlIndex = arg5;
    let buttonValue = arg1.ButtonName;
    let rowIndex = arg1.Index;
    let currentRowName = arg1.Name

    if(this.controlWarningPopupStatus == 1){
      this.showControlWarningModal = true;
    }else{
      this.showControlWarningModal = false;
    }

    if(arg === "slider"){
    let siderselectedValue = arg1.slider;
    let sliderminVal = arg1.min;
    let sliderStepping = arg1.stepping;
    var sliderValToBackend = (siderselectedValue - sliderminVal) / sliderStepping;
    if(sliderValToBackend !== sliderValToBackend){
      sliderValToBackend = 0;
    }
      var command :any = "";
      // command = this.cmdSetControl;
      //command = command.replace("#componentName",componentName).replace("#componentIndex",componentIndex).replace("#controlName",controlName).replace("#controlIndex",controlIndex).replace("#instanceName",currentRowName).replace("#instanceIndex",rowIndex).replace("#newvalue",sliderValToBackend);
      var setControlCommand = '{"Command" : "SetControl","Args":'+'"'+componentName+","+componentIndex+","+controlName+","+controlIndex+","+currentRowName+","+rowIndex+","+sliderValToBackend+'"'+'}'
      this.setControlCommonCommand = setControlCommand;
      if(this.controlWarningPopupStatus == 0){
        this.SocketService.sendMessage(this.setControlCommonCommand);
      }
      //this.SocketService.sendMessage(setControlCommand);

    }else if(arg === "dropdown"){
      var receivedRowReferance = arg1.split(':');
      var currentRowIndex = receivedRowReferance[1];
      var rowReferance = receivedRowReferance[0]+receivedRowReferance[1];
      var currentSelectedRowName = $('.controlTableFirstRow'+rowReferance).html().trim();
      let dropdownBtnVal =  $('.controlTableRow'+rowReferance).val();
      //let dropdownBtnVal = "DefaultWorkSpace.xml"
      let dropdownChildren =  $('.controlTableRow'+rowReferance)[0].children;
      var dropDownIndex:any= "";
      var len = dropdownChildren.length;
      for(let i =0;i<len;i++){
        if(dropdownChildren[i].value == dropdownBtnVal){
            dropDownIndex = i
        }
      }
      //command = this.cmdSetControl;
      //command = command.replace("#componentName",componentName).replace("#componentIndex", componentIndex).replace("#controlName", controlName).replace("#controlIndex", controlIndex).replace("#instanceName", currentSelectedRowName).replace("#instanceIndex",currentRowIndex).replace("#newvalue",dropDownIndex);
      var setControlCommand = '{"Command" : "SetControl","Args":'+'"'+componentName+","+componentIndex+","+controlName+","+controlIndex+","+currentSelectedRowName+","+currentRowIndex+","+dropDownIndex+'"'+'}'
      this.setControlCommonCommand = setControlCommand;
      if(this.controlWarningPopupStatus == 0){
        this.SocketService.sendMessage(this.setControlCommonCommand);
      }
      // this.SocketService.sendMessage(setControlCommand);
    }
  }

  continueSetControl(){
    if (this.controlWarningCheckBoxStatus == true) {
      var command = '{"Command" : "DisableWarnings","Args": "control"}'
      this.SocketService.sendMessage(command);
      this.SocketService.sendMessage(this.setControlCommonCommand);
      this.controlWarningPopupStatus = 0;
    } else {
      this.SocketService.sendMessage(this.setControlCommonCommand);
    }
    this.showControlWarningModal = false;
  }

  closeControlWarningModal(){
    this.showControlWarningModal = false;
  }
 
  toggleIcon(){
    this.hasClass = !this.hasClass;
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
        var scrHeight = window.innerHeight;
        var scrWidth = window.innerWidth;
        if(scrWidth < 700){
        this.sidenav.close();
        this.hasClass = true;
        }
  }

}
