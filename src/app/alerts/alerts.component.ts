import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { UtilityServiceService } from '../services/utility-service.service';
import{DatePipe} from '@angular/common'; 
import { SocketService } from '../db/socket.service';
import { Command } from 'selenium-webdriver';
import * as $ from 'jquery';
import { NgxSpinnerService } from "ngx-spinner";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[DatePipe]  
})
export class AlertsComponent implements OnInit {
  dataType = '';
  alertSecShowHide = false;
  alertInputData:any = [];
  alertInputType:any = []
  selectedOptionNumber:any = "";
  selectedOptionString:any = "";
  alertInputValue:any = "";
  alertCombination = ["&&", "||",")&&("];
  alertSummaryTableView = false;
  summaryData:any=[];
  expCount = 1;
  editIndex = -1;
  errorType= "Info";
  startAlert = 1;
  alertBtnVal = "Start Alerts";
  startLoggingDisable = 2;
  openSummaryFile:any = 1;
  startStopToolTip = "click here to start alerts";
  addAlert = false;
  recenetAlertDiv = false;
  intelIconClass = "intelicon-menu";
  recentAlertData = [];
  errorInputBox:boolean = false;
  getParamArrayId:any;
  addUpdateAlertFlag:number = 1;
  alertSummaryExpressions:any;
  alertSummaryexpStr:any;
  alertSummaryErrorType:any;
  alertMessage:any = "";
  editRowIndex:any;
  editRowPosition:any;
  rowUidList:any;
  alertPath:any;
  currentIpAddress:any;
  alertOpenFile:any;
  alertSummaryResponse:any;
  underScoreString:any = "_";
  alertIconToolTip:any = "Open Recent Alerts"
  osInformation:any = "";
  // data = 
  stringType = [
    {
      "id": 0,
      "name": "Containing",
      "symbol": "@"
    },
    {
      "id": 1,
      "name": "Not Containing",
      "symbol": "#"
    }
  ]
  numberType = [
    {
      "id": 0,
      "name": "Equals To",
      "symbol": "=="
    },
    {
      "id": 1,
      "name": "Greater Than",
      "symbol": ">"
    },
    {
      "id": 2,
      "name": "Less Than",
      "symbol": "<"
    }
  ];
  objArray:any = [];
  data: any;
  keys: any;
  selectedKey:any = '';
  selectedComponent;
  featuresArray : any =[];
  firstChildArray = [];
  secondChildArray = [];
  selectedFirstChildComponent:any = 'select';
  selectedSecondChildComponent:any = 'select';
  selectedFeature:any = 'select';
  cdkDropConnectedToList:Array<String>;
  constructor(private util: UtilityServiceService, private datePipe:DatePipe,private SocketService:SocketService,private spinner: NgxSpinnerService,
    private app: AppComponent) { 
    this.cdkDropConnectedToList = util.getCdkDropConnectedToList();
    this.createFormGroup();
  }

  ngOnInit() {
    
    if(this.app.platform == 'server') {
      this.dataType = 'Serverside';
    } else {
      this.dataType = 'Clientside';
    }
    this.objArray = [];
    this.alertSecShowHide = true;
    
    // getting the data from monitor resp for both client and server
    this.SocketService.getMonitorDataRes().subscribe(message => {
      this.data = message;
      if(this.dataType === 'Serverside') {

        this.data.Data.forEach(element => {
            
            Object.keys(element).forEach(key => this.objArray.push({
            name: key,
            child: element[key]
            }));
          
            this.selectedKey = this.objArray[0];
            this.selectedComponent = this.objArray[0].child[0];
           
            this.featuresArray = this.objArray[0].child[0].data.Features;
            this.firstChildArray = this.objArray[0].child[0].children;
        });
      } else {
        this.dataType = 'Clientside';
        this.objArray = this.data.Data[0].Treelist;
        this.secondChildArray = this.data.Data[0].Treelist[0].Treelist;
       
        this.selectedKey = this.data.Data[0].Treelist[0];
        this.selectedFirstChildComponent = this.data.Data[0].Treelist[0].Treelist[0];
        this.firstChildArray = this.data.Data[0].Treelist[0].Treelist;
        this.featuresArray = this.data.Data[0].Treelist[0].Treelist[0].SubTreeList;
        
      }
    })
    this.SocketService.isLoadAlertsDataStatus().subscribe(message => {
      if (message) {
        if(this.alertBtnVal == "Stop Alerts"){
          var command = '{"Command" : "StopAlert"}'
          this.SocketService.sendMessage(command);
          // this.SocketService.sendMessage("StopAlert()");
        }
        this.cancelAlert();
        if(message.CommandStatus.Status.toLowerCase() == "success"){
          this.summaryData.length=0;
          this.recentAlertData.length = 0;
          if(message.Data.length > 0){
            this.startAlert = 0;            
          }else{
            this.startAlert = 1;
            this.spinner.hide();
          }

          var loadAlertResponse = message.Data;

          for (let count=0;count<=loadAlertResponse.length-1;count++){
            let expSummary = {
              "name": "",
              "errorType": "",
              "expressions": [],
              "expStr": "",
              "rowUidList":"",
              "alertCount":"NA"
              
            };
            expSummary.name = "Expression"+loadAlertResponse[count].RowIndex;
            if(loadAlertResponse[count].RowIndex == 1){
              expSummary.errorType = "Info";
            }else if(loadAlertResponse[count].RowIndex == 2){
              expSummary.errorType = "Warning";
            }else{
              expSummary.errorType = "Error";
            }
            expSummary.expressions = loadAlertResponse[count].Expressions;
            expSummary.expStr = loadAlertResponse[count].AlertExpression;
            
            // Received values i stored in the below variable
            var alertExpression =  loadAlertResponse[count].AlertExpression
            var alertExpressionWithUid =  loadAlertResponse[count].AlertExpressionwithuid
            
            //Neha's code *****************************
            var output=[];
            var theArray = alertExpressionWithUid.split('$');
              for (let i=0;i<theArray.length;i++)
              {
                if(i%2 !== 0){
                  output.push(theArray[i]);
                }
              } 
            expSummary.rowUidList = output.join(';');
            expSummary.rowUidList = expSummary.rowUidList +";";
            //output.push(";");
            var conditions = [];
	          var conditionsCounter =0;
            var exp = alertExpression;
            var split1 = exp.split(")||(");
            for(var a=0; a<split1.length; a++){
              var split2 = split1[a].split(")&&(");
              for(var b=0; b<split2.length; b++){
                var split3 = split2[b].split("&&");
                for(var c=0; c<split3.length; c++){
                  var split4 = split3[c].split("||");{
                    for(var d=0; d<split4.length; d++){
                      conditions[conditionsCounter] = split4[d];
                      conditionsCounter++;
                    }		
                  }
                }
              }

            }
            var str = exp;
            var ind1 = exp.indexOf(")||("); //index of ")||("
            var ind2 = exp.indexOf(")&&("); //index of ")&&("
            var ind3 = exp.indexOf("||"); //index of "||"
            var ind4 = exp.indexOf("&&"); //index of "&&"
            var arr = [];
            while (ind1!=-1 || ind2!=-1 || ind3!=-1 || ind4!=-1){
              var min = -1;
              if(ind1 == -1){ ind1 = 10000; } 
              if(ind2 == -1){ ind2 = 10000; } 
              if(ind3 == -1){ ind3 = 10000; } 
              if(ind4 == -1){ ind4 = 10000; } 
              min = Math.min(ind1,ind2,ind3,ind4);
              if(ind1 == min){ arr.push(")||("); min=min+4;} 
              if(ind2 == min){ arr.push(")&&("); min=min+4;} 
              if(ind3 == min){ arr.push("||"); min=min+2;} 
              if(ind4 == min){ arr.push("&&"); min=min+2;} 
              str=str.slice(min);
              ind1 = str.indexOf(")||("); //index of ")||("
              ind2 = str.indexOf(")&&("); //index of ")&&("
              ind3 = str.indexOf("||"); //index of "||"
              ind4 = str.indexOf("&&"); //index of "&&"
            }
            
            
            conditions[0] = conditions[0].slice(1);
            conditions[conditionsCounter-1] = conditions[conditionsCounter-1].slice(0,conditions[conditionsCounter-1].length-1);
            var addalerthtml = "";
            for(let i=0; i<conditions.length; i++){
              var paramname ="";
              var index =-1;
              if(i>0){
                expSummary.expressions[i].expSymbol= arr[i-1];
              }
              expSummary.expressions[i].itemIndex = output[i];
              var type = 1; //1=string 2 = integer
              if(conditions[i].includes(">") == true){
                index = conditions[i].indexOf(">");
                expSummary.expressions[i].conditionType= "1";
                type =2;
                expSummary.expressions[i].itemType =type.toString();
                expSummary.expressions[i].selectedInputVal = conditions[i].substr(index+1);			
              }		
              else if(conditions[i].includes("<") == true){
                index = conditions[i].indexOf("<");
                expSummary.expressions[i].conditionType= "2" ;	
                type =2;			
                expSummary.expressions[i].itemType =type.toString();
                expSummary.expressions[i].selectedInputVal = conditions[i].substr(index+1);		
              }
              else if(conditions[i].includes("==")  == true){
                index = conditions[i].indexOf("==");
                expSummary.expressions[i].conditionType= "0" ;
                type =2;
                expSummary.expressions[i].itemType =type.toString();
                expSummary.expressions[i].selectedInputVal = conditions[i].substr(index+1);
              }
              else if(conditions[i].includes("#")  == true){ //Not Containing
                index = conditions[i].indexOf("#");
                expSummary.expressions[i].conditionType= "1" ;
                type =1;
                expSummary.expressions[i].itemType =type.toString();
                expSummary.expressions[i].selectedInputVal = conditions[i].substr(index+1);
              }
              else if(conditions[i].includes("@")  == true){ //Containing
                index = conditions[i].indexOf("@");
                expSummary.expressions[i].conditionType= "0" ;
                type =1;
                expSummary.expressions[i].itemType =type.toString();
                expSummary.expressions[i].selectedInputVal = conditions[i].substr(index+1);
              }
              
              paramname = conditions[i].substr(0,index);
              var paramNameSplit = paramname.split("_");
              expSummary.expressions[i].itemPname = paramNameSplit[0];
              var paramNameWithUnitSplit = paramNameSplit[1].split("(");
              expSummary.expressions[i].itemName = paramNameWithUnitSplit[0];
              if(paramNameWithUnitSplit.length > 1){
                expSummary.expressions[i].itemUnit = "(" + paramNameWithUnitSplit[1];
              }
              


            //****************************************** 
              //console.log(expSummary);
             this.summaryData[count] = expSummary;
          }
          this.spinner.hide();
          this.alertSummaryTableView=true;
        }
         
        }else{
          this.spinner.hide();
        }
      }
    });



    this.SocketService.isGetParamTypeStatus().subscribe(message => {
      if (message) {
        this.alertInputData[this.getParamArrayId].itemType = message.Data;
        this.alertInputData[this.getParamArrayId].conditionType = message.Data == 1 ? this.stringType[0].id : this.alertInputData[this.getParamArrayId].conditionType = this.numberType[0].id;
      }
    });

    this.SocketService.isAddToAlertListStatus().subscribe(message => {
      if (message) {
        if(message.CommandStatus.Status.toLowerCase() == "success"){
          this.alertMessage = "";
          var rowIndex = 0;
           if(this.summaryData.length > 0){
             rowIndex = this.summaryData.length;
           }
         var receivedRowIndex = message.Data;
          // var rowIndex = message.Data[0];

          let expSummary = {
            "name": "Expression" + receivedRowIndex,
            "errorType": this.alertSummaryErrorType,
            "expressions": [],
            "expStr": "",
            "rowUidList":"",
            "alertCount":"NA"
          };
          expSummary.expressions.length = 0;
          expSummary.expressions = this.alertSummaryExpressions;
          expSummary.expStr = "("+this.alertSummaryexpStr+")";
          expSummary.rowUidList = this.rowUidList;
          this.summaryData[rowIndex] = expSummary;
          this.alertSecShowHide = false;
          if(this.alertSecShowHide == false || this.alertSummaryTableView == true){
            this.startAlert = 0;
          }
          this.alertInputData = [];
          this.createFormGroup();
        }else{
          this.alertMessage = message.CommandStatus.Message;
        }
      }
    });

    this.SocketService.isUpdateAlertListStatus().subscribe(message => {
      if (message) {
        if(message.CommandStatus.Status.toLowerCase() == "success"){
          // this.summaryData[this.editRowIndex].length = 0;
          this.alertMessage = "";
          var receivedRowIndex = message.Data.RowIndex;
          let expSummary = {
            "name": "Expression" + receivedRowIndex,
            "errorType": this.alertSummaryErrorType,
            "expressions": [],
            "expStr": "",
            "rowUidList":"",
            "alertCount":"NA"
          };
          expSummary.expressions.length = 0;
          expSummary.expressions = this.alertSummaryExpressions;
          expSummary.expStr = "("+this.alertSummaryexpStr+")";
          expSummary.rowUidList = this.rowUidList;
          this.summaryData[this.editRowPosition] = expSummary;
          this.alertSecShowHide = false;
          if(this.alertSecShowHide == false || this.alertSummaryTableView == true){
            this.startAlert = 0;
          }
          this.alertInputData = [];
          this.createFormGroup();
        }else{
          this.alertMessage = message.CommandStatus.Message;
        }
      }
    });

    this.SocketService.isRemoveFromAlertListStatus().subscribe(message => {
      if (message) {
        var expression = "Expression"+message.Data;
        let index : any = "";
        if(this.summaryData.length == 1){
          this.startAlert = 1;
        }
        for(let count =0;count<this.summaryData.length;count++){
            if(expression == this.summaryData[count].name){
             index = count;
            }
         }
         this.summaryData.splice(index,1);
      }
    });


    this.SocketService.getToolInfo().subscribe(message => {
      if (message) {
        //this.alertPath = message[8].value;
        //this.currentIpAddress = message[3].value;
        var getToolInfoResponse = message;
        var len = getToolInfoResponse.length;
        for (var i = 0; i < len; i++) {
         if (getToolInfoResponse[i].key == 'AlertPath') {
          this.alertPath = getToolInfoResponse[i].value;
         }else if(getToolInfoResponse[i].key == 'OSVersion'){
          if(getToolInfoResponse[i].value == "Windows 10 Enterprise"){
              this.osInformation = "windows"
          }else{
              this.osInformation = "others"
          }
         }else if(getToolInfoResponse[i].key == 'CurrentIpAddress'){
              this.currentIpAddress = getToolInfoResponse[i].value;
         }

        }


      } 
   });


   this.SocketService.isStartAlertStatus().subscribe(message => {
    if (message) {
      var command = '{"Command" : "GetAlertFileName"}'
      this.SocketService.sendMessage(command);
      // this.SocketService.sendMessage("GetAlertFileName()");
     }
   });

   this.SocketService.isGetAlertFileNameStatus().subscribe(message => {
    if (message) {
        this.alertOpenFile = message.Data[0];
        this.alertBtnVal = "Stop Alerts";
        this.openSummaryFile = 1;
        this.startLoggingDisable = 1;
        this.startStopToolTip = "click here to stop alerts";
        this.recentAlertData.length = 0;
     }
   });


   this.SocketService.isAlertSummaryStatus().subscribe(message => {
     console.log(message);
    if (message) {
      if(message.Data && message.Data.length > 0){
       
      
        this.alertSummaryResponse = message;
        let alertSummaryResponseData = this.alertSummaryResponse.Data;
        for(let alertCount = 0;alertCount < this.alertSummaryResponse.Data.length;alertCount++) {

          let expression = alertSummaryResponseData[alertCount].AlertExpression;
          this.recentAlertData.push(alertSummaryResponseData[alertCount]);

          for(let count =0;count<this.summaryData.length;count++) {
              if(expression == this.summaryData[count].name){
                var index = count;
                this.summaryData[index].alertCount = alertSummaryResponseData[alertCount].Count;
              }
          }
        }
      } else {
        return false
      }
      
     }
   });

   this.SocketService.isStopAlertStatus().subscribe(message => {
    if (message) {
        this.alertBtnVal = "Start Alerts";
        this.openSummaryFile = 2;
        this.startLoggingDisable = 2;
        this.startStopToolTip = "click here to start alerts";
        for(let count =0;count<this.summaryData.length;count++){
            this.summaryData[count].alertCount ="NA";
         }
      }
   });


  //  this.alertSummaryResponse = {
  //   "Command": "AlertSummary",
  //   "CommandStatus": {
  //     "Status": "Success",
  //     "Message": ""
  //   },
  //   "Data": [
  //     {
  //       "AlertExpression":"Expression1",
  //       "AlertExpressionName":"(CPU0_Frequency(MHz)&gt;100)",
  //       "Timestamp":"2/6/2020 11:23:37.415",
  //       "Count":"1",
  //       "RowIndex":"3",
  //       "AlertExpressionwithuid":"(0&lt;10)"
  //     },
  //     {
  //       "AlertExpression":"Expression2",
  //       "AlertExpressionName":"(CPU0_DTS(Degree C)&lt;1000)",
  //       "Timestamp":"2/6/2020 11:23:37.415",
  //       "Count":"1",
  //       "RowIndex":"4",
  //       "AlertExpressionwithuid":"(2759&gt;100)"	  
  //     },
  //     {
  //       "AlertExpression":"Expression3",
  //       "AlertExpressionName":"(CPU0_is CPU Throttling&lt;10)",
  //       "Timestamp":"2/6/2020 11:23:37.415",
  //       "Count":"1",
  //       "RowIndex":"5",
  //       "AlertExpressionwithuid":"(57&lt;1000)"		  
  //     }
  //   ]
  // }


  }

  showAlertSec(){
    this.alertSecShowHide = true;
    this.addUpdateAlertFlag = 1;
  }

  // Drag And Drop Function Starts Here not used 
  dropInInput(event){
    // Sending the comand after droping starts Here

    var scrWidth = window.innerWidth;
    if(scrWidth < 650){
     $('#sidebar, #content').toggleClass('active');
    }
    console.log(event);
    
    var  command = '{"Command" : "GetParamType","Args":'+'"'+event.item.element.nativeElement.dataset.itemIndex+'"'+'}'
    // let reqCmd = "GetParamType" + '(' +event.item.element.nativeElement.dataset.itemIndex + ')';
    this.SocketService.sendMessage(command);

    // Sending the comand after droping starts Here
    let containerId:String = event.container.element.nativeElement.id;
    console.log()
    this.getParamArrayId = containerId.replace("xyz", "");
    console.log(this.getParamArrayId);
    
    this.alertInputData[this.getParamArrayId].itemIndex = event.item.element.nativeElement.dataset.itemIndex;
    this.alertInputData[this.getParamArrayId].itemPname = event.item.element.nativeElement.dataset.itemPname;
    this.alertInputData[this.getParamArrayId].itemName = event.item.element.nativeElement.innerText;
    this.alertInputData[this.getParamArrayId].itemUnit = event.item.element.nativeElement.dataset.itemUnit;
    this.alertInputData[this.getParamArrayId].underScore = "_";
   
    // this.alertInputData[this.getParamArrayId].itemIndex = event.item.element.nativeElement.dataset.itemIndex;
    // this.alertInputData[this.getParamArrayId].itemType = event.item.element.nativeElement.dataset.itemType;
    // this.alertInputData[this.getParamArrayId].conditionType = event.item.element.nativeElement.dataset.itemType == 1 ? this.stringType[0].id : this.alertInputData[this.getParamArrayId].conditionType = this.numberType[0].id;
    
    console.log(this.alertInputData);
  }
  // Drag And Drop Function Ends Here
  createFormGroup(){
    this.alertInputData.push({
      "expSymbol": "&&"
    });
    this.alertInputData[0].expSymbol = undefined;
    this.errorType = "Info";
    this.cdkDropConnectedToList.push("xyz" + (this.alertInputData.length -1));
  }
  
  // Removing Alert Form Starts Here
  removeAlertData(i){
    this.alertInputData.splice(i,1);
    this.alertInputData[0].expSymbol = undefined;
  }
  // Removing Alert Form Ends Here

  // Onclick of submit proceeding to Alert Start here
  proceedAlert(){
    if(this.alertInputData.some((item)=>item.selectedInputVal == undefined || item.selectedInputVal == "")){
      // this.errorInputBox = true;
      // setTimeout(() => {
      //   this.errorInputBox = false;
      // }, 2000);
      this.alertMessage = "Make sure none of the text boxes are empty!"
    }else{
      // this.errorInputBox = false;  
      this.alertMessage = "";
      this.alertSummaryErrorType = this.errorType;

       // console.log("After Proceed", this.alertInputData);
      // Creating an array with all details to show the summary table starts here
     
      // let expSummary = {
      //   "name": (this.editIndex > -1) ? this.summaryData[this.editIndex].name : "Expression" + this.expCount++,
      //   "errorType": this.errorType,
      //   "expressions": [],
      //   "expStr": ""
      // };

      // Creating an array with all details to show the summary table starts here

    // Creating a string to tooltip info for the whole expression starts here
    let expStr = "";
    let expId = "";
    let UidList = "";
    let expAddition = [];
    console.log(this.alertInputData);
    for(let i = 0; i < this.alertInputData.length; i++) {
      let e = this.alertInputData[i];
      let exp = {
        "expSymbol": e.expSymbol,
        "itemName": e.itemName,
        "itemPname": e.itemPname,
        "itemUnit": e.itemUnit,
        "itemType": e.itemType,
        "conditionType": e.conditionType,
        "selectedInputVal": e.selectedInputVal,
        "itemIndex" : e.itemIndex,
        "underScore": "_"
      };
      // expStr += ((exp.expSymbol) ? exp.expSymbol : "") + " " + exp.itemName + "_" + exp.itemPname + " " +
      //   ((exp.itemType == 1) ? this.stringType : this.numberType)[exp.conditionType]["symbol"] + " " +
      //   exp.selectedInputVal + " ";      //Explanantion is below
      
      expStr += ((exp.expSymbol) ? exp.expSymbol : "") + exp.itemPname+ exp.underScore + exp.itemName+exp.itemUnit+
        ((exp.itemType == 1) ? this.stringType : this.numberType)[exp.conditionType]["symbol"]+
        exp.selectedInputVal;      //Explanantion is below
      

      expId += ((exp.expSymbol) ? exp.expSymbol : "") +"$" + exp.itemIndex + "$" +((exp.itemType == 1) ? this.stringType : this.numberType)[exp.conditionType]["symbol"] +
      exp.selectedInputVal;
      // Creating a string to tooltip info for the whole expression starts here
      UidList += exp.itemIndex+";";
      // expStr ternary operator details below starts here
     // expSummary.expressions.push(exp);
     expAddition.push(exp)
     console.log(expStr,expId, UidList, exp );
     
    this.alertSummaryExpressions = expAddition;
    }
    //expSummary.expStr = expStr;
    this.alertSummaryexpStr = expStr; 
    this.rowUidList = UidList;
    console.log(this.alertSummaryexpStr, this.rowUidList);
    

    // Send Comand Before Pushing to array starts Here
    //let cmdAddAlertList = "AddToAlertList"+"("+'('+expStr+')';
    //let cmdUpdateAlertList = "UpdateAlertList"+"("+'('+expStr+')'; 
    var typeCheck = this.errorType.toLowerCase() == "info" ? 1 : (this.errorType.toLowerCase() == "warning"?2:3);
    var latestExpId = "("+expId+")";
   // var addCommandToSend = cmdAddAlertList +","+ typeCheck+"," + latestExpId+")";
    //var updateCommandToSend = cmdUpdateAlertList +","+ typeCheck+"," + latestExpId+","+this.editRowIndex+")";
    var addToAlertListCmd = '{"Command" : "AddToAlertList","Args":'+'"'+'('+expStr+")"+','+typeCheck+','+latestExpId+'"'+'}'
    var updateAlertListCmd = '{"Command" : "UpdateAlertList","Args":'+'"'+'('+expStr+')'+','+typeCheck+','+latestExpId+','+this.editRowIndex+'"'+'}'
    if(this.addUpdateAlertFlag == 1){
      this.SocketService.sendMessage(addToAlertListCmd);
    }else{
      this.SocketService.sendMessage(updateAlertListCmd);
    }

    // Send Comand Before Pushing to array ends Here


    // Checking fresh entry or edit before pushing starts here
    
    // if(this.editIndex > -1){
    //   this.summaryData[this.editIndex] = expSummary;
    // }else{
    //   this.summaryData.push(expSummary);
    // }

    // Checking fresh entry or edit before pushing starts here
    
    // To Make the add alert field one and empty for fresh entry strats here
    // this.alertInputData = [];
    // this.createFormGroup();
    // To Make the add alert field one and empty for fresh entry ends here

    // Hide/Show Alert summary table and alert section starts here
    this.alertSummaryTableView = true;
    if(this.recenetAlertDiv == true){
      this.recenetAlertDiv = false;
      this.recentAlert("intelicon-bullets-list-view");
    }
   
    //this.alertSecShowHide = false; 
    if(this.alertSecShowHide == false || this.alertSummaryTableView == true){
      this.startAlert = 0;
    }

    }    
   
   }

   // Onclick of submit proceeding to Alert Ends here

  //  Strating/Stoping Alert Function Starts Here
   alertStartStop(val){
    // console.log(val);
    //let cmdStartStop = (val == 'Start Alerts') ? "StartAlert()" : "StopAlert()";
   // console.log(cmdStartStop);
   if(val == "Start Alerts"){
        var path = ""
        if(this.osInformation = "windows"){
          path = this.alertPath.replace(/\\/g,"\\\\");
        }else{
          path = this.alertPath.replace(/\\/g,"////");
        }
       var alertArguments = path+','+this.currentIpAddress;
      // var startAlertsCmd = 'StartAlert'+'('+alertArguments+')';
      var startAlertsCmd = '{"Command" : "StartAlert","Args":'+'"'+alertArguments+'"'+'}'
      console.log(this.alertInputData);
      this.SocketService.sendMessage(startAlertsCmd);
      
    }else{
      // var StopAlertCmd = "StopAlert()"
      var StopAlertCmd = '{"Command" : "StopAlert"}'
      this.SocketService.sendMessage(StopAlertCmd);
   }
    
    // this.alertBtnVal = (val == 'Start Alerts') ? "Stop Alerts" : "Start Alerts";
    // this.addAlert = this.alertBtnVal == 'Stop Alerts' ? true : false;
   }
   //  Strating/Stoping Alert Function Ends Here

  //  Edit of Alert Expression Selected Starts Here
  editExpression(arg) {
  if(this.alertBtnVal == "Stop Alerts"){

  }else{
   let index : any = "";
   this.alertMessage = "";
   for(let count =0;count<this.summaryData.length;count++){
       if(arg == this.summaryData[count].name){
        index = count;
       }
    }
    this.editRowIndex = arg.slice(10,11);
    this.editRowPosition = index;
    this.alertInputData = this.summaryData[index]["expressions"];
    this.errorType = this.summaryData[index]["errorType"];
    this.alertSecShowHide = true;
    this.addUpdateAlertFlag = 2;
   }
  }
  //  Edit of Alert Expression Selected Ends Here

  // Delete Alert Expression from ALert Summary starts Here
  deleteExpression(arg) {

    if(this.alertBtnVal == "Stop Alerts"){

    }else{

    let index : any = "";
    for(let count =0;count<this.summaryData.length;count++){
        if(arg == this.summaryData[count].name){
         index = count;
        }
     }
     var rowIndex = arg.slice(10,11);
     var rowPosition = index;
     var rowUidList = this.summaryData[rowPosition].rowUidList;
     var rowId = rowUidList.slice(0,-1)
     //var deleteCommand = "RemoveFromAlertList"+'('+rowId+','+rowIndex+")";
     var removeFromAlertListCommand = '{"Command" : "RemoveFromAlertList","Args":'+'"'+rowId+","+rowIndex+'"'+'}'
     this.SocketService.sendMessage(removeFromAlertListCommand);
    }
    // let deleteCmd = "RemoveFromAlertList"+'('+i+')';
    // this.editIndex = -1;
   // console.log(deleteCmd);

    // Delete Send Command Starts Here
    // SocketService.send(deleteCmd);
    // Delete Send Command Ends Here

    // this.summaryData.splice(i,1);
    // if(this.summaryData.length == 0){
    //   this.alertSummaryTableView = false;
    //   this.alertSecShowHide = false;
    // }
  }
  // Delete Alert Expression from ALert Summary ends Here

// Cancel Alert Button function starts here
  cancelAlert(){
    this.alertSecShowHide = false;
    this.alertInputData = [];
    this.editIndex = -1;
    this.createFormGroup();
    this.addUpdateAlertFlag = 1;
    this.alertMessage = "";
  }
// Cancel Alert Button function ends here


  // Recent Alert Show/Hide with functionallity starts here
  recentAlert(rcvClass){
    // this.recentAlertData = this.summaryData;
    // for(let i = 0; i < this.recentAlertData.length; i++){
    //   this.recentAlertData[i].timeStamp = this.datePipe.transform(new Date(),'MMM d, y, h:mm:ss a');
    // }
    if(rcvClass == 'intelicon-menu'){
      this.intelIconClass = "intelicon-bullets-list-view";
      this.alertSummaryTableView = false;
      this.recenetAlertDiv = true;
      this.alertIconToolTip = "Open Alerts Summary";
    }else{
      this.intelIconClass = "intelicon-menu"
      this.alertSummaryTableView = true;
      this.recenetAlertDiv = false;
      this.alertIconToolTip = "Open Recent Alert";
    }
    
  }


  openAlertFile(){
    if(this.openSummaryFile === 2){
      var filePath = this.alertOpenFile;
      window.open(filePath, "_blank");
    }else{

    }
  }

  restrictSpecChar(e,val){
    if(val == 2){
     if(e.charCode === 101){
       return false;
     }
    }else{
    }
   }

   restrictKeyPress (event: any) {
    event.preventDefault();
  }

   
  // Recent Alert Show/Hide with functionallity ends here

  // recentlerts(){
  //    let alertSummaryResponseData = this.alertSummaryResponse.Data;
  //    this.recentAlertData = this.alertSummaryResponse.Data;
     
  //    for(let alertCount = 0;alertCount < this.alertSummaryResponse.Data.length;alertCount++){
  //     console.log("first",alertSummaryResponseData[alertCount].AlertExpression);
  //     let expression = alertSummaryResponseData[alertCount].AlertExpression;
      
  //     for(let count =0;count<this.summaryData.length;count++){
  //         if(expression == this.summaryData[count].name){
  //           var index = count;
  //           console.log("second",index);
  //           this.summaryData[index].alertCount = alertSummaryResponseData[alertCount].Count;
  //         }
  //     }
  //   }
  // }
  selectedKeyElement(data) {
    console.log(data);
    
  }
  selectedComponetData(data) {
    this.featuresArray = [];
    this.firstChildArray = [];
    this.selectedFeature = 'select';
    this.selectedSecondChildComponent='select'

    console.log(data);
    if(data!='select') {
      if(data.data.Features.length > 0 && data != 'select') {
        this.getFeaturesData(data.data.Features);
      }
      if(data.children.length > 0 && data != 'select') {
        this.getFirstChildernDataFromComponent(data.children);
      }
    }
    
  }

  getFeaturesData(data) {
    this.featuresArray = data;
    console.log(data);
    
  }

  getFirstChildernDataFromComponent(data) {
    this.firstChildArray = [];
    console.log(data);
    this.firstChildArray = data;
  }
  
  selectedFirstChildComponetData(data) {

    console.log(data);
    if(this.dataType == 'Serverside') {
      if(data == 'select') {
        this.getFeaturesData(this.selectedComponent.data.Features);
        this.selectedSecondChildComponent = 'select';
      } else {
          if(data.children.length > 0 && data != 'select') {
              this.getSecondChildernDataFromComponent(data.children)
          }
          if(data.data.Features.length > 0 && data != 'select') {
            this.getFeaturesData(data.data.Features);
          }
      }
    } 
    
    
    
  }

  getSecondChildernDataFromComponent(data) {
    this.secondChildArray = [];
    console.log(data);
    this.secondChildArray = data;
  }

  selectedSecondChildComponetData(data) {
    if(data !=='select') {
      if(data.data.Features.length > 0 && data != 'select') {
        this.getFeaturesData(data.data.Features);
    } 
    }else {
        this.getFeaturesData(this.selectedFirstChildComponent.data.Features)
      }
  }

  selectedDataForServer() {

      if(this.selectedFeature.Param.type == 'string') {
        this.selectedFeature.itemType = 1; 
      } else {
        this.selectedFeature.itemType = 2; 
      }

      let parentName = this.selectedComponent.data.Name ;
      if(this.selectedFirstChildComponent === 'select') {
        this.selectedFeature.itemPname = parentName;
      } else {
        parentName += "_"+ this.selectedFirstChildComponent.data.Name
        if(this.selectedSecondChildComponent !== 'select') {
          parentName += "_"+ this.selectedSecondChildComponent.data.Name
        }
      }
      this.selectedFeature.itemUnit = this.selectedFeature.unit;
      this.selectedFeature.underScore = "_";
      this.selectedFeature.itemName = this.selectedFeature.Name;
      this.selectedFeature.itemPname = parentName;
      this.selectedFeature.expSymbol = '';
      this.selectedFeature.itemIndex = this.selectedFeature.Index;
      if(this.alertInputData.length > 1) {
        this.selectedFeature.expSymbol = '&&'
      }
      this.alertInputData[this.alertInputData.length - 1] = this.selectedFeature;
      // if
      
  }

  selectedFirstItem(data) {
    this.firstChildArray = data.Treelist
  }
// to be used later if we dont get the itemtype in client response;

  selectedDataForClient() {
    var  command = '{"Command" : "GetParamType","Args":'+'"'+this.selectedFeature.Index+'"'+'}';
    this.SocketService.sendMessage(command);
    this.selectedFeature.conditionType = 0;
    this.selectedFeature.itemType = 2;
    this.selectedFeature.itemUnit = this.selectedFeature.unit;
    this.selectedFeature.underScore = "_";
    this.selectedFeature.itemName = this.selectedFeature.Name;
    this.selectedFeature.itemPname = this.selectedFeature.Row.split(",")[0];
    this.selectedFeature.expSymbol = '';
    this.selectedFeature.itemIndex = this.selectedFeature.Index;

    this.alertInputData[this.alertInputData.length - 1] = this.selectedFeature;
    
  }
  selectedSecondItem(data) {
    // console.log(data);
    // this.SocketService.isGetParamTypeStatus().subscribe(message => {
    //   if (message) {
    //     this.alertInputData[this.getParamArrayId].itemType = message.Data;
    //     this.alertInputData[this.getParamArrayId].conditionType = message.Data == 1 ? this.stringType[0].id : this.alertInputData[this.getParamArrayId].conditionType = this.numberType[0].id;
    //   }
    // });
  }
}
