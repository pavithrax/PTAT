import { Component,ViewChild,OnInit } from '@angular/core';
import * as $ from 'jquery';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import { HostListener } from "@angular/core";
import {MatSidenav} from '@angular/material/sidenav'; 
import { AppComponent } from '../app.component';
import * as data from './control-resp.json';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {
  @ViewChild('sidenav',{static: false}) sidenav: MatSidenav;
  //controlLoadArray:any;
  dataType: any = '';
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

  controltable: any = '';
  controltree: any = '';

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
  constructor(private SocketService: SocketService,private spinner: NgxSpinnerService,private app: AppComponent) { }

  cmdSetControl = "SetControl(#componentName,#componentIndex,#controlName,#controlIndex,#instanceName,#instanceIndex,#newvalue)";

  ngOnInit() {
    // if(this.app.platform == 'server') {
    //   this.dataType = 'Serverside';
    // } else {
    //   this.dataType = 'Clientside';
    // }

    this.SocketService.getToolInfo().subscribe(message => {
      if (message) {
         this.getToolInfoResponse = message;
         for (var i = 0; i < this.getToolInfoResponse.length; i++) {
            if (this.getToolInfoResponse[i].key == 'ShowControlWarning') {
               this.controlWarningPopupStatus = this.getToolInfoResponse[i].value;
            } else if(this.getToolInfoResponse[i].key == 'platform_sku'){
              if(this.getToolInfoResponse[i].value == 'server') {
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



    this.SocketService.getControlDataRes().subscribe(message => {
      if (message) {
        this.controlResponse = message.Data;
        let data:any = {};
        data.Data = message.Data
        // this.controlResponse = data.Data;
        console.log(this.controlResponse);
        console.log(data.Data[0].Index);
        
        this.controlResponse.forEach(element => {
          if(element.Name == 'CPU Component') {
            element.DropDownList.forEach(element1 => {
              if(element1.Name == 'Integrated Graphics') {
                if(element1.TableData[0].param.currentLevel == 0) {
                  element1.TableData[0].param.currentLevel = 'No Limit'
                }
                element1.TableData[0].param.DropDownValue[0]='No Limit'
              }
            });
          }
        });
        
        var firstContolName = data.Data[0].DropDownList[0].Name;
        console.log(firstContolName);
        console.log(data.Data[0].Index.toString()+data.Data[0].DropDownList[0].Index.toString() +';'+firstContolName);
        setTimeout(() => {
          if(this.controltable== '' || this.controltree == '') {
            this.controlTree(data.Data[0].Index +data.Data[0].DropDownList[0].Index.toString() +';'+firstContolName);
          } else  {
            $('.controlTableCC').addClass('hide');
            $('.controlTreeCC').removeClass('colorSelectedTree');
            $(this.controltree).addClass('colorSelectedTree');  
            $(this.controltable).removeClass('hide');
           
          }
          
          this.spinner.hide();
        }, 0); 
      }
    });

    this.SocketService.updateControlDataRes().subscribe(message => {
      console.log(message);
      
      if (message) {
        //this.controlId = splitResponse[0];
        // this.firstItemName = splitResponse[1];
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
      console.log(message);
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

  controlTree(response){

    console.log(response);;
    
    var splitResponse = response.split(";");

    this.controlId = splitResponse[0];
    this.firstItemName = splitResponse[1];

    this.controlName = this.firstItemName;
    let controlTable = "controlTable" + this.controlId;
    let controlTree = "controlTree" + this.controlId;
    $('.controlTableCC').addClass('hide');
    $('.controlTreeCC').removeClass('colorSelectedTree');
    $("."+controlTree).addClass('colorSelectedTree');  
    $("."+controlTable).removeClass('hide');
    this.controltable = "."+controlTable
    this.controltree = "."+controlTree

    
  }
  
  setControl(arg,arg1,arg2,arg3,arg4,arg5,name,parent){
    console.log(arg,arg1,arg2,arg3,arg4,arg5);
    console.log(parent);
    
    // not used to be deleted later
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
     let referenceCommand = ''
      console.log(arg1.slider);
      
      let sliderVal = Math.floor(arg1.slider/arg1.param.Stepsize);
      if(sliderVal == NaN || sliderVal === NaN || arg1.slider == undefined) {
        sliderVal = arg1.param.Min;
      }
      console.log(sliderVal);
      referenceCommand = '{"Command": "StartControl","params": [{"control":"'+ parent.controlInfo+ '", "set_level": [{"test": "'+arg1.param.commandInfo+'", "level": '+sliderVal+'} ]}]}'
      console.log(referenceCommand);
     this.setControlCommonCommand = referenceCommand;
      if(this.controlWarningPopupStatus == 0){
        this.SocketService.sendMessage(this.setControlCommonCommand);
      }

    }else if(arg === "dropdown"){
      var receivedRowReferance = name.split(':');
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
      
      // use the below format
      // let referenceCommand = '{"scriptCmds": [{"Command": "StartControl","params": [{"control": "cpu_od_clk_mod","set_level": [{"test": "core 0", "level": 2} ]}]}]}'
      let referenceCommand = '';
      referenceCommand = '{"Command": "StartControl","params": [{"control":"'+ parent.controlInfo + '", "set_level": [{"test": "'+arg1.param.commandInfo+'", "level": '+dropDownIndex+',"Index":"3"} ]}]}';
      console.log(referenceCommand);
      this.setControlCommonCommand = referenceCommand;
      if(this.controlWarningPopupStatus == 0){
        this.SocketService.sendMessage(this.setControlCommonCommand);
      }
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
