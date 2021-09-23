import { Component, OnInit } from '@angular/core';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Subject, Observable} from 'rxjs';
import * as $ from 'jquery';
import { UtilityServiceService } from '../services/utility-service.service';

@Component({
  selector: 'app-target-host-error',
  templateUrl: './target-host-error.component.html',
  styleUrls: ['./target-host-error.component.css']
})
export class TargetHostErrorComponent implements OnInit {
  showTargetErrorModal:boolean;
  showHostErrorModal:boolean;
  FavouriteDeviceList:any;
  targetIpdAddress:any;
  targetPortNumber:any;
  targetName:any;
  targetHosterrorMessage:any;
  hosterrorMessage:any;
  portNumber:any;
  deleteConditionFlag:any = 0;
  targetConnectionStatus:boolean = false;
  addFavListIdentifier:any = 1;
  disconnectionMessage : any = "Host not connected. Please restart PTAT Host service.";
  public isConnectPort$: Subject<any>;

  constructor(private SocketService:SocketService,private spinner: NgxSpinnerService, private util: UtilityServiceService) {
    this.isConnectPort$ = new Subject<any>();

   }


  ngOnInit() {

   this.util.TargetErrorFlag.subscribe(data => {
      if(data == true){
        this.targetHosterrorMessage = "";
        this.openRemoteConnection();
      }
   });

    this.portNumber = 9000;
    // this.portNumber = 49861;

    this.SocketService.hostNotConnectedErrorHandling().subscribe(message => {
      if (message) {
        setTimeout(function(){}, 3000);
        this.spinner.hide();
        this.showHostErrorModal = true;
        this.hosterrorMessage = this.disconnectionMessage;
      }
    });

    this.util.pub_openHostPopup.subscribe(data => {
      if (data) {
        setTimeout(function(){}, 3000);
        this.spinner.hide();
        this.showHostErrorModal = true;
        if(data==""){
          this.hosterrorMessage = this.disconnectionMessage;
        }
        else{
          this.hosterrorMessage = data;
        }
      }
    });

    this.SocketService.hostDisConnectedErrorHandling().subscribe(message => {
      if (message) {
        setTimeout(function(){}, 3000);
        this.spinner.hide();
        this.showHostErrorModal = true;
        this.hosterrorMessage = this.disconnectionMessage;
      }
    });

    this.SocketService.changeConnectionErrorHandling1().subscribe(message => {
      if (message) {
      this.showTargetErrorModal = true;
      // if(this.showTargetErrorModal == true){

      // }else{
      //   this.showTargetErrorModal = true;
      // }
        
        if(message.CommandStatus.Status == "FAILED"){
          this.targetHosterrorMessage = message.CommandStatus.Message
        }else{
          this.targetHosterrorMessage = "";
        }
        this.spinner.hide();
      }
    });

    

    this.SocketService.getChangeConn().subscribe(message => {
      if (message) {
        this.closeTargetPopup();
        this.targetConnectionStatus = true;
      }
    });

   /* this.SocketService.getTatHostService().subscribe(message => {
      if (message) {
        this.closeHostPopup();
      }
    });*/

    this.SocketService.checkTargetStatusErrorHandling().subscribe(message => {
      if (message) {
        this.spinner.hide();
        if(message.CommandStatus.Status == "Failure"){
          this.showTargetErrorModal = true;
          this.targetHosterrorMessage = message.CommandStatus.Message
          this.targetConnectionStatus = false;
        }else{
          this.targetHosterrorMessage = "";
        }
      }
    });

    this.SocketService.hideSpinner().subscribe(message => {
      if (message) {
        if (message == 1) {
          this.showTargetErrorModal = true;
        }else{
          this.showHostErrorModal = true; 
        }
        this.spinner.hide();  
      }
    });


    this.SocketService.getToolInfo().subscribe(message => {
      if (message) {
        this.targetIpdAddress = message[3].value;
        this.targetPortNumber = message[4].value;
        this.targetName = "";
      }
    });

  
    this.SocketService.addToFavConnListRes().subscribe(message => {
      if (message) {
         this.FavouriteDeviceList = message.Data;
      }
    });


    this.SocketService.getFavConnListRes().subscribe(message => {
      if (message) {
        if(message.CommandStatus.Status == "Success"){
          this.FavouriteDeviceList = message.Data;
          this.targetHosterrorMessage = "";
          if(this.addFavListIdentifier == 2){
            $(".removeActiveHeader").removeClass("active");
            $(".removeActiveBody").removeClass("active show");
            $(".addFavListActiveHeader").addClass("active");
            $(".addFavListActiveBody").addClass("active show");
          }
        }else{
          this.targetHosterrorMessage = message.CommandStatus.Message;
        }
        

      }
    });

    this.SocketService.removeFromFavConnListRes().subscribe(message => {
      if (message) {
        var index = message.Data;
        if(this.deleteConditionFlag == 1){
          this.FavouriteDeviceList.splice(message.Data, 1); 
          this.deleteConditionFlag--;
        }  
      }
    });
 
  }

  fnConnectPort(){
    this.spinner.show();
    this.SocketService.webSocketResponse(this.portNumber);
    setTimeout(()=>{
      this.showHostErrorModal = false;
    },100);
  }

 
  closeTargetPopup(){
    this.showTargetErrorModal = false;
  }

  closeHostPopup(){
    this.showHostErrorModal = false;
  }

  deleteFavList(index){
    //var command = "RemoveFromFavConnList(" +index + ')';
    var command = '{"Command" : "RemoveFromFavConnList","Args":'+'"'+index+'"'+'}'
    this.deleteConditionFlag++;
    this.SocketService.sendMessage(command);
    
  }

  selectFavList(index){
    var selectedRow = this.FavouriteDeviceList[index];
    this.targetIpdAddress = selectedRow.ipaddress;
    this.targetPortNumber = selectedRow.portno;
    this.targetName = selectedRow.name;
    //var command = "ChangeConnection(websockets,"+this.targetIpdAddress+","+this.targetPortNumber + ")";
    var command = '{"Command" : "ChangeConnection","Args":'+'"'+'websockets,'+this.targetIpdAddress+','+this.targetPortNumber+'"'+'}'
    this.SocketService.sendMessage(command);
    this.spinner.show();

    $(".removeActiveHeader").removeClass("active");
    $(".removeActiveBody").removeClass("active show");
    $(".addTargetActiveHeader").addClass("active");
    $(".addTargetActiveBody").addClass("active show");
  }
 
  addFavList(){
   var duplicateFavListCounter = 0;
    //var command  = "AddToFavConnList(" + this.targetName + ','+this.targetIpdAddress +','+this.targetPortNumber+")";
    var command = '{"Command" : "AddToFavConnList","Args":'+'"'+this.targetName+','+this.targetIpdAddress+','+this.targetPortNumber+'"'+'}'
    if(this.targetName != "" && this.targetIpdAddress != "" && this.targetPortNumber != ""){
     if(this.FavouriteDeviceList != undefined){    
      var favListArray = this.FavouriteDeviceList;
      for(let i=0; i <favListArray.length; i++){
        if(this.targetName == favListArray[i].name || this.targetIpdAddress == favListArray[i].ipaddress){
          duplicateFavListCounter++
        }
      }
     }

      if(duplicateFavListCounter > 0){
        this.targetHosterrorMessage = "This Favourite connection already exist";
      }else{
          this.SocketService.sendMessage(command);
          this.targetHosterrorMessage = "";
          this.addFavListIdentifier = 2;
      }
   
    }else{
      this.targetHosterrorMessage = "Enter IP Address , Port Number and Name"
    }

  }

  connectTarget(){
    //var command = "ChangeConnection(websockets,"+this.targetIpdAddress+","+this.targetPortNumber + ")";
    var command = '{"Command" : "ChangeConnection","Args":'+'"'+'websockets,'+this.targetIpdAddress+','+this.targetPortNumber+'"'+'}'
    if(this.targetIpdAddress != "" && this.targetPortNumber != ""){
      this.SocketService.sendMessage(command);
      this.spinner.show();
      this.targetHosterrorMessage = "";
    }else{
      this.targetHosterrorMessage = "Enter IP Address , Port Number"
    }
  }

  openRemoteConnection(){
    this.showTargetErrorModal = true;
  }

  
}
