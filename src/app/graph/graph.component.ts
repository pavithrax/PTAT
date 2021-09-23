import { Component, OnInit } from '@angular/core';
// import * as $ from 'jquery';
declare let $: any;
import * as CanvasJS from '../../assets/canvasjs.min'; 
import { DataService } from '../services/data.service';
import { NotifierService } from "angular-notifier";
import { FileSaverService } from 'ngx-filesaver';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import {UtilityServiceService} from '../services/utility-service.service';
// import  * as dataFormat from './GetMonitorDataNew.json';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  dataType = ''
  offlineGraphParameter:any;
  offlineGraphIndexList:any = [];
  offlineGraphNameList:any = [];
  offlineDeleteList:any = [];
  offlineAllDeleteList:any = [];
  offlineGraphStaticGraphId  = [];
  offlineGraphStaticGraphName = [];
  offlineGraphDirection = [];
  offlineGraphParsedData = [];
  liveGraphList:any = [];
  count:any;
  dataPoints = [];
  chart:any;
  data:any = [];
  duplicateCheck:any =[];
  component:any = "";
  argOne:any = "";
  argTwo:any = "select";
  argThree:any = "Left";
  argThreeIndex:any = 1;
  graphName:any;
  followList:any = [];
  offlineChart: any;
  timeInterval:any = 1000;
  graphDataResponse:any ;
  refreshTime:any;
  initialRefreshTime:any;
  // Live Graph ***********
  liveGraphCompArr:any = [];
  liveGraphArg1Arr:any = [];
  liveGraphArg2Arr:any = [];
  liveGraphUIDList:any = [];
  isPlayPauseDisabled:boolean = false;
  play:boolean = false;
  liveGraphButtonsDisabled:boolean = true;
  liveGraphFinalData:any;
  globalGraphdata:any = [];
  liveGraphDataArray:any = [];
  plotLiveChart:any;
  xVal:number = 0
  liveGraphDate:any = "";
  interval : any = "";
  //Offline Graph **********
  logFilePath:any = [];
  filesInDir:any = [];
  isOfflineAddDisabled:boolean = true;
  isOfflineSaveDisabled:boolean = true;
  offlineGraphDetails:any = [];
  offLineGraphFinalData:any;
  offlineGraphLogFileCount:any = 0;
  graphDisplayName:any;
  showHideOfflineGraphModal:boolean = false;
  offlineGraphDuplicatError:any;
  liveGraphDuplicatError:any;
  IsStartGraph2Sent = false;
  disableOfflineGraphRemoveBtn:any = 0;
  liveGraphWidth:any;
  liveGraphHeight:any;
  offlineGraphWidth:any;
  offlineGraphHeight:any;
  InstalledPath:any;

//Live Graph Global variable:
isDynamic:any = true;
// xVal:any;
xVal1:any;
liveGraph:any;
scrollPane:any;
scrollbar:any;
handleHelper:any;
StaticGraph:any;
dynamicWidth:any;
current:any = 0;
graphCount:any;
viewportSize:any = 60;
graph1StartStatusReceived = false; 
isHugeData:boolean = false;
isBulkData:boolean= false;

osInformation:any = "";
argThread: any = "select";
argFeature:any = "";
liveGraphThread:any = [];
liveGraphFeature:any = [];

// globalGraphdata:any = [];
  constructor(private DataService:DataService, private notifier:NotifierService, private _FileSaverService: FileSaverService,private SocketService: SocketService,private spinner: NgxSpinnerService,private utility : UtilityServiceService,
	private app: AppComponent) { }

  ngOnInit() {
	  
	this.utility.settingsRefreshValue.subscribe(data => {
		this.refreshTime = data;
	})

	this.utility.liveGraphListValue.subscribe(data => {
		if(this.liveGraphUIDList.length >0){
			this.clearallValues();
		}
	})

	this.SocketService.getSettings().subscribe(data => {
		this.initialRefreshTime = data[4].value;
	})

	$("#slider").slider();
	
	
	this.SocketService.getMonitorDataRes().subscribe(message => {
		// message = dataFormat;
		if(this.dataType == 'Clientside') {
			console.log(message.Data[0])
			this.liveGraphCompArr = message.Data[0].Treelist;
			this.component = message.Data[0].Treelist[0];

			this.liveGraphArg1Arr = message.Data[0].Treelist[0].Treelist;
			this.argOne = message.Data[0].Treelist[0].Treelist[0];

			this.liveGraphArg2Arr = message.Data[0].Treelist[0].Treelist[0].SubTreeList;
			this.argTwo = message.Data[0].Treelist[0].Treelist[0].SubTreeList[0];

			console.log(this.liveGraphCompArr, this.component );
			console.log(this.liveGraphArg1Arr, this.argOne );
			console.log(this.liveGraphArg2Arr, this.argTwo );
			this.graphName = this.argOne.Index+'_'+this.argTwo.Index;   
        	this.graphDisplayName = this.argOne.Name+'_'+this.argTwo.Name;
		} else {
			console.log(message.data);
			message.Data.forEach(element => {
				console.log(element);
            
				Object.keys(element).forEach(key => this.liveGraphCompArr.push({
				Name: key,
				child: element[key]
				}));

				this.component = this.liveGraphCompArr[0];
				console.log(this.component)

				this.liveGraphArg1Arr = this.component.child;
				this.argOne = this.liveGraphArg1Arr[0];
				this.liveGraphFeature = this.argOne.data.Features;
				this.argFeature = this.liveGraphFeature[0];
				
				this.liveGraphArg2Arr = this.argOne.children;
				// this.liveGraphThread = this.liveGraphArg2Arr[0].children
				// this.argTwo = this.liveGraphArg2Arr[0];

				// this.liveGraphThread = this.argTwo.
				// console.log(this.argTwo);


				// this.firstChildArray = this.objArray[0].child[0].children
				this.argThread = 'select';
				this.argTwo = 'select';
				this.graphDisplayName = this.argOne.data.Name + '_' + this.argFeature.Name;
				
			});

			// let message = dataFormat;
	
		// 	console.log(message.data);
		// 	message.data.forEach(element => {
		// 	console.log(element);
		
		// 	Object.keys(element).forEach(key => this.liveGraphCompArr.push({
		// 	Name: key,
		// 	child: element[key]
		// 	}));

		// 	this.component = this.liveGraphCompArr[0];
		// 	console.log(this.component)

		// 	this.liveGraphArg1Arr = this.component.child;
		// 	this.argOne = this.liveGraphArg1Arr[0];
		// 	this.liveGraphFeature = this.argOne.data.Features;
		// 	this.argFeature = this.liveGraphFeature[0];
			
		// 	this.liveGraphArg2Arr = this.argOne.children;
		// 	// this.liveGraphThread = this.liveGraphArg2Arr[0].children
		// 	// this.argTwo = this.liveGraphArg2Arr[0];

		// 	// this.liveGraphThread = this.argTwo.
		// 	// console.log(this.argTwo);


		// 	// this.firstChildArray = this.objArray[0].child[0].children
		// 	this.argThread = 'select';
		// 	this.argTwo = 'select';
		// 	this.graphDisplayName = this.argOne.data.Name + '_' + this.argFeature.Name;
			
		// });
		}
		
		

		
	})

	// this.SocketService.GetGraphDataRes().subscribe(message => {
    //     if (message) {
    //         this.graphDataResponse = message;
    //         for(let i=0; i<this.graphDataResponse.Data.length;i++){
    //             if (this.graphDataResponse.Data[i].Name == 'Component') {
    //                 this.liveGraphCompArr = this.graphDataResponse.Data[i].Row.split(",");              
    //             }
    //             else if (this.graphDataResponse.Data[i].Name == 'Arg1') {
    //                 this.liveGraphArg1Arr = this.graphDataResponse.Data[i].Row.split(",");
    //             }
    //             else if (this.graphDataResponse.Data[i].Name == 'Arg2') {
    //                 this.liveGraphArg2Arr = this.graphDataResponse.Data[i].Row.split(",");
    //             }
    //             this.component = 0; 
    //             this.argOne = 0;
    //             this.argTwo =0; 
    //             this.graphName = this.argOne+'_'+this.argTwo;   
    //             this.graphDisplayName = this.liveGraphArg1Arr[this.argOne]+'_'+this.liveGraphArg2Arr[this.argTwo];
    //         }
    //     }
    // });

	

    this.offlineGraphDetails= {
      "Command": "GetGraph2Details",
      "CommandStatus": {
        "Status": "success",
        "Message": "success message"
      },
      "Data": {
        "Name":"CSV",
        "Row":[
          
        ]
      }
	}
	
    
	// this.SocketService.GetGraphDataRes().subscribe(message => {
	// 	if (message) {
	// 		this.graphDataResponse = message;
	// 		for(let i=0; i<this.graphDataResponse.Data.length;i++){
	// 			if (this.graphDataResponse.Data[i].Name == 'Component') {
	// 				this.liveGraphCompArr = this.graphDataResponse.Data[i].Row.split(",");				
	// 			}
	// 			else if (this.graphDataResponse.Data[i].Name == 'Arg1') {
	// 				this.liveGraphArg1Arr = this.graphDataResponse.Data[i].Row.split(",");
	// 			}
	// 			else if (this.graphDataResponse.Data[i].Name == 'Arg2') {
	// 				this.liveGraphArg2Arr = this.graphDataResponse.Data[i].Row.split(",");
	// 			}
	// 			this.component = 0;	
	// 			this.argOne = 0;
	// 			this.argTwo =0;	
	// 			this.graphName = this.argOne+'_'+this.argTwo;	
	// 			this.graphDisplayName = this.liveGraphArg1Arr[this.argOne]+'_'+this.liveGraphArg2Arr[this.argTwo];
	// 		}
	// 	}
	// });


	this.SocketService.getToolInfo().subscribe(message => {
		if (message) {
			console.log(message);;
			
		   var getToolInfoResponse = message;
		   var len = getToolInfoResponse.length;
		   for (var i = 0; i < len; i++) {
			  if (getToolInfoResponse[i].key == 'LogPath') {
				 this.logFilePath = getToolInfoResponse[i].value;
	 
			  }else if(getToolInfoResponse[i].key == 'OSVersion'){
				if(getToolInfoResponse[i].value == "Windows 10 Enterprise"){
					this.osInformation = "windows"
				}else{
					this.osInformation = "others"
				}
			  }else if(getToolInfoResponse[i].key == 'InstalledPath'){
					this.InstalledPath = getToolInfoResponse[i].value;
			  }
			  else if(getToolInfoResponse[i].key == 'platform_sku'){
				if(getToolInfoResponse[i].value == 'server') {
				  this.dataType = 'Serverside';
				} else {
				  this.dataType = 'Clientside';
				}
			  }
			 
		   }
		   console.log(this.logFilePath);
		}
	 });

	this.SocketService.getFilesInDir().subscribe(message => {
		if (message) {
			this.spinner.hide();
			if(message.CommandStatus.Status == "Success" && message.Data.key == "log"){
				this.filesInDir = message.Data.List;
				if(this.filesInDir.length != 0){
					this.offlineGraphLogFileCount = 1;
				}else{
					this.offlineGraphLogFileCount = 0;
				}	
			}
		}
	});

	this.SocketService.LoadGraph2FileRes().subscribe(message => {
		if (message) {
			this.offlineGraphStaticGraphId.length = 0;
			this.offlineGraphStaticGraphName.length = 0;
			this.offlineGraphDirection.length = 0;
			this.isOfflineAddDisabled = false;
			$(".divOfflinePlottingList").empty();
			var command = '{"Command" : "GetGraph2Details"}'
			this.SocketService.sendMessage(command);
			// this.SocketService.sendMessage("GetGraph2Details()");

		}
	});

	this.SocketService.GetGraph2DetailsRes().subscribe(message => {
		if (message.CommandStatus.Status == "Success") {			 
			 this.offlineGraphDetails = message;
			 this.offlineGraphIndexList.length = 0;
			 this.offlineGraphNameList.length = 0;
			this.showHideOfflineGraphModal = true;
			this.offlineGraphDuplicatError = "";
		}
		else{
			this.showHideOfflineGraphModal = true;
			this.offlineGraphDuplicatError = message.CommandStatus.Message;
		}
	});

	this.SocketService.AddParamToGraph2Res().subscribe(message => {
		if (message) {
			let paramIndex = message.Data.UID-8;
			let paramName = $(".offlineGraphContainer ul li:nth-child("+(paramIndex+1)+")")[0].innerText;
			if (paramName == undefined || paramName == "") {
				return false;
			}
			else{					
				this.offlineGraphIndexList.push(paramIndex);
				this.offlineGraphNameList.push(paramName);
				if($('#offlinegraphDirectionSelectBox').val() == "Left"){
					$(".divOfflinePlottingList").append('<div data-id='+paramIndex+' class="form-check" style="margin-left: 10px;"><label class="form-check-label" style="color:red;"><input type="checkbox" class="form-check-input offlineGraphCheckBox" style="margin-top: 0px! important">'+paramName+'</label></div>');
				}else{
					$(".divOfflinePlottingList").append('<div data-id='+paramIndex+' class="form-check" style="margin-left: 10px;"><label class="form-check-label" style="color:#006400;"><input type="checkbox" class="form-check-input offlineGraphCheckBox" style="margin-top: 0px! important">'+paramName+'</label></div>');
				}
				
			}
		}
	});

	this.SocketService.RemoveParamFromGraph2Res().subscribe(message => {
		if (message) {
		}
	});

	this.SocketService.StartGraph2Res().subscribe(message => {
		if (message) {
			if(message.CommandStatus.Status == "Success"){
				if(this.IsStartGraph2Sent){
					this.offlineGraphValue = message;
					this.offlineGraphSubmit();		
					this.showHideOfflineGraphModal = false;
					this.isOfflineSaveDisabled = false;
					this.IsStartGraph2Sent = false;
				}
				else{
					this.offlineGraphValue = message;
					this.appendToOfflineGraph();
				}
			}else{

			}
		}
	}); 

	this.SocketService.StopGraph2Res().subscribe(message => {
		if (message) {
		}
	});

	this.SocketService.AddParamToGraph1Res().subscribe(message => {
		console.log(message);
		console.log(this.argOne.Name+'_'+this.argTwo.Name);
		if (message) {
			var graphDirection = message.Data.GraphDirection;
			var graphColor = "";
			if(graphDirection == 1){
				graphColor = "red";
			}else{
				graphColor = "#006400";
			}
			
			var dataObj = {"graphName":this.graphDisplayName,"graphColor":graphColor}
			// this.liveGraphList.push(this.graphDisplayName);
			this.liveGraphList.push(dataObj);
			let data = message.Data;
			let UID = data.UID;
			this.liveGraphUIDList.push(UID);
		}
	});

	this.SocketService.Graph1ComponentSelectedRes().subscribe(message => {
		if (message) {
			let  response= message;
			for(let i=0; i<response.Data.length;i++){
				if (response.Data[i].Name == 'Arg1') {
					this.liveGraphArg1Arr = response.Data[i].Row.split(",");
				}
				else if (response.Data[i].Name == 'Arg2') {
					this.liveGraphArg2Arr = response.Data[i].Row.split(",");
				}
				this.argOne = 0;
				this.argTwo =0;	
				this.graphName = this.argOne+'_'+this.argTwo;
				this.graphDisplayName = this.liveGraphArg1Arr[this.argOne]+'_'+this.liveGraphArg2Arr[this.argTwo];
			}
		}
	});

	this.SocketService.Graph1Arg1SelectedRes().subscribe(message => {
		if (message) {
			let  response= message;
			for(let i=0; i<response.Data.length;i++){
				if (response.Data[i].Name == 'Arg2') {
					this.liveGraphArg2Arr = response.Data[i].Row.split(",");
				}
				this.argTwo =0;	
				this.graphName = this.argOne+'_'+this.argTwo;
				this.graphDisplayName = this.liveGraphArg1Arr[this.argOne]+'_'+this.liveGraphArg2Arr[this.argTwo];

			}
		}
	});

	this.SocketService.Graph1Arg2SelectedRes().subscribe(message => {
		if (message) {
			this.graphName = this.argOne+'_'+this.argTwo;
			this.graphDisplayName = this.liveGraphArg1Arr[this.argOne]+'_'+this.liveGraphArg2Arr[this.argTwo];

		}
	});

	this.SocketService.StartGraph1Res().subscribe(message => {
		if (message) {
			this.play = true;
			this.liveGraphButtonsDisabled = false;
		}
	});

	this.SocketService.RemoveParamFromGraph1Res().subscribe(message => {
		console.log(message);
		console.log(this.liveGraphUIDList);
		
		if (message) {
			this.followList = [];
			let UIDList =message.Data.UID.split(",");
			for(let i =0; i<UIDList.length ; i++){
				let index = this.liveGraphUIDList.indexOf(UIDList[i]);
				if(index>-1){
					this.liveGraphDataArray.splice(index,1);
					this.liveGraphUIDList.splice(index,1);
					this.liveGraphList.splice(index,1);
					if(this.liveGraphList.length == 0){
						this.plotLiveChart.render();
						this.xVal = 0;
						this.liveGraphButtonsDisabled = true;
						var command = '{"Command" : "StopGraph1"}'
						// var command = '{"Command" : "StopGraph"}'	
						this.SocketService.sendMessage(command);
						// this.SocketService.sendMessage("StopGraph1()");
						this.play = false;
					}
				}
			}
		}
	});

	this.SocketService.PlayGraph1Res().subscribe(message => {
		if (message) {
			if(message.CommandStatus.Status == "Success"){
				this.parseLiveGraphData(message.Data);	
			}else{

			}
		}
	});

	this.SocketService.StopGraph1Res().subscribe(message => {
		if (message) {
			this.play = false;
			//this.liveGraphButtonsDisabled = true;
		}
	});

	this.SocketService.GetGraphPointsRes().subscribe(message => {
		if (message) {
			if(message.CommandStatus.Status == "Success"){
				this.liveGraphDataArray.length = 0;
				this.plotLiveChart.render();
				this.xVal = 0;
			}else{

			}
		}
	});

	this.liveGraphFinalData =  {
		zoomEnabled: true,
		rangeChanged: function (e) {
			if(e.trigger == "zoom"){
				
			}else{
				

			}
		},
		animationEnabled:true,
		creditText:"",
		title: {
			text: "",
			fontSize: 14,
		},
		toolTip: {
		  shared: true,
		  animationEnabled: true,
		},
		height:this.liveGraphHeight,
		width:this.liveGraphWidth,
		legend: {
			horizontalAlign: "center",
			verticalAlign: "bottom",
		},
		axisX:{
		"valueFormatString": " ",
        "title": "Time",
        "titleFontSize": 12,
        "labelFontSize": 10,
        "gridDashType": "dot",
        "gridThickness": 1,
        "labelMaxWidth": 55,
        "margin": -20,
        "includeZero": true,
        "viewportMinimum": 0,
        "viewportMaximum": 60
		},
		axisY:{
			includeZero: false,
			labelFontSize: 10,
			gridDashType: "dot",
			gridThickness: 1,
		},
		data:this.liveGraphDataArray
	  }
	  this.plotLiveChart = new CanvasJS.Chart('liveGraphContainer',this.liveGraphFinalData)
	  
	  this.scrollbar = $(".scroll-bar").slider({
		max:6,
		min:0,
			slide: ( event, ui )=>{
				this.isDynamic = (ui.value === (this.current-1)) ? true : false;
				if(!this.graph1StartStatusReceived){
					this.liveGraphSliderMove();
				}
				//this.liveGraphSliderMove();
				this.plotLiveChart.render();
			}
		});

		// used when we load the graph params from "load workspace"
		this.SocketService.getMonitorDataRes().subscribe(message => {
			if (this.dataType == 'Clientside' && message) {
				this.liveGraphList.length = 0;
				this.liveGraphUIDList.length = 0;
				var monitorDataRes = message.Data[0].Treelist;
				for(let i=0;i<monitorDataRes.length;i++){
					var pluginName = monitorDataRes[i].Treelist;
					for(let j=0;j<pluginName.length;j++){
						var pluginSubTreeList = pluginName[j].SubTreeList;
						for(let k=0;k<pluginSubTreeList.length;k++){
							if(pluginSubTreeList[k].GraphEnabled == "Yes"){
								var pluginSubTreeName = pluginName[j].Name;
								var subTreeName = pluginSubTreeList[k].Name;
								var graphDirection = pluginSubTreeList[k].GraphDirection;
								var graphColor = "";
								if(graphDirection == 1){
									graphColor = "red";
								}else{
									graphColor = "#006400";
								}
								var graphDisplayName = pluginSubTreeName+'_'+subTreeName;
								var dataObj = {"graphName":graphDisplayName,"graphColor":graphColor}
								this.liveGraphList.push(dataObj);
								this.liveGraphUIDList.push(pluginSubTreeList[k].Index);
							}
						}
					}
				}
			}
		});
	}

		

	addToPlotLiveList(){	
		if(this.dataType == 'Clientside')	 {
			console.log(this.argOne, this.argTwo);
		
			//   var graphNameSel = this.liveGraphArg1Arr[this.argOne]+'_'+this.liveGraphArg2Arr[this.argTwo];
			var graphNameSel =this.argOne.Name+'_'+this.argTwo.Name;
			console.log(graphNameSel);
			
			var duplicateGraphNameCounter = 0;
			for(var i=0;i<this.liveGraphList.length;i++){
				if(this.liveGraphList[i].graphName == graphNameSel){
					duplicateGraphNameCounter=duplicateGraphNameCounter+1;
				}
			}
			if(duplicateGraphNameCounter == 0){
				let compIndex = this.liveGraphCompArr.findIndex(x => x.Index === this.component.Index);
				let arg1Index = this.liveGraphArg1Arr.findIndex(x => x == this.argOne);
				let arg2Index = this.liveGraphArg2Arr.findIndex(x => x == this.argTwo);
		
				console.log(arg2Index);
				
				// var command = '{"Command" : "AddParamToGraph1","Args":'+'"'+compIndex+","+arg1Index+","+arg2Index+","+this.argThreeIndex+",-1"+'"'+'}'
				var command = '{"Command" : "AddParamToGraph1","Args":'+'"'+this.argTwo.Index+","+this.argThreeIndex+",-1"+'"'+'}'
				this.SocketService.sendMessage(command);
				//this.SocketService.sendMessage("AddParamToGraph1("+compIndex+","+arg1Index+","+arg2Index+",-1)");
				this.liveGraphDuplicatError = "";
			}else{
				//this.notifier.notify("error", "Duplicates not allowed");
				this.liveGraphDuplicatError = "Duplicate parameters are not allowed";
			}
		} else {
			// var graphNameSel =this.argOne.Name+'_'+this.argTwo.Name;
			var duplicateGraphNameCounter = 0;
			for(var i=0;i<this.liveGraphList.length;i++){
				if(this.liveGraphList[i].graphName == this.graphDisplayName){
					duplicateGraphNameCounter=duplicateGraphNameCounter+1;
				}
			}
			if(duplicateGraphNameCounter == 0) {
				// var dataObj = {"graphName":this.graphDisplayName,"graphColor":"red"}
				// this.liveGraphList.push(dataObj);
				// this.liveGraphUIDList.push(this.argFeature.Index);

				let compIndex = this.liveGraphCompArr.findIndex(x => x.Index === this.component.Index);
				let arg1Index = this.liveGraphArg1Arr.findIndex(x => x == this.argOne);
				let arg2Index = '';
				let argThread = '';
				let argFeature = '';
				
				arg2Index = this.liveGraphArg2Arr.findIndex(x => x == this.argTwo);
				argThread = this.liveGraphThread.findIndex(x => x == this.argThread);
				argFeature = this.liveGraphFeature.findIndex(x => x == this.argFeature);

				let command = '{"Command" : "AddParamToGraph1","Args":'+'"'+this.argFeature.Index+","+this.argThreeIndex+",-1"+'"'+'}'
				// let command = '{"Command" : "AddParamToGraph1","Args":'+'"'+compIndex+","+arg1Index+","+arg2Index+","+argThread+","+argFeature+","+this.argThreeIndex+",-1"+'"'+'}'
				this.SocketService.sendMessage(command);
			}else{
				//this.notifier.notify("error", "Duplicates not allowed");
				this.liveGraphDuplicatError = "Duplicate parameters are not allowed";
			}
			
		}
	

	  
	}

	onCheckItem(Id, event) {
		console.log(Id, event)
		const checked = event.target.checked; // stored checked value true or false
		if (checked) {
	   		this.followList.push(Id); 
		} else {
			const index = this.followList.findIndex(list => list== Id);//Find the index of stored id
			this.followList.splice(index, 1); // Then remove
	  	}
		console.log(this.followList);
	}

	removeSelectedFromLiveGraph(data?){
		console.log(this.followList);
		
		// if(this.dataType == 'Clientside') {}
		let lstLen = this.followList.length;
		let commandParams = "";
		for (let i =0 ;i<lstLen ; i++){
			let index = this.liveGraphList.indexOf(this.followList[i]);
			if(index > -1){
				commandParams = commandParams + this.liveGraphUIDList[index];
				if(i != lstLen-1){
				commandParams = commandParams + ",";
				}
			}
			console.log(commandParams ,this.liveGraphUIDList[index]);
		}
		
		
		// var command = '{"Command" : "RemoveParamFromGraph","Args":'+'"'+commandParams+'"'+'}'
		var command = '{"Command" : "RemoveParamFromGraph1","Args":'+'"'+commandParams+'"'+'}'
		this.SocketService.sendMessage(command);
		//var cmd = "RemoveParamFromGraph1("+commandParams+")";
	}
	clearallValues(){
		let lstLen = this.liveGraphList.length;
		let commandParams = this.liveGraphUIDList.join();
		// var command = '{"Command" : "RemoveParamFromGraph","Args":'+'"'+commandParams+'"'+'}'
		var command = '{"Command" : "RemoveParamFromGraph1","Args":'+'"'+commandParams+'"'+'}'
		this.SocketService.sendMessage(command);
		//var cmd = "RemoveParamFromGraph1("+commandParams+")";
	}
	startLiveGraph(){
		var command = '{"Command" : "StartGraph1"}'
		// var command = '{"Command" : "StartGraph"}'
		this.SocketService.sendMessage(command);
		// this.SocketService.sendMessage("StartGraph1()");
		this.graph1StartStatusReceived = true;
	}

  fnLiveGraphPlot(){
	let dataPoints = [];
    let dpsLength = 0;
	let chart = new CanvasJS.Chart("chartContainer",{
	  exportEnabled: false,
    //     title:{
    //     text: "Live Graph",
    //     fontSize: 14,
    //     fontWeight:'normal'
    //   },
      toolTip: {
		shared: true
	  },
	  zoomEnabled:true,
      legend: {
        horizontalAlign: "left",
        verticalAlign: "bottom",
      },
      axisX:{
        valueFormatString: " ",
        title: "Time",
        titleFontSize: 12,
        labelFontSize: 10,
        gridDashType: "dot",
        gridThickness: 1,
        labelMaxWidth: 55,
        margin: -20,
        includeZero: true,
      },
      axisY:{
        includeZero: false,
        labelFontSize: 10,
        gridDashType: "dot",
        gridThickness: 1,
      },
      data: [{
		type:"line",
		legendText: "CPU0_is CPU Throttling",
        dataPoints : dataPoints,
        showInLegend: true
      }]
    });

	this.data = this.DataService.getLiveGraphData();
    var data = this.DataService.getLiveGraphData();
    var data1 = this.DataService.getLiveGraphUpdatedata();

    this.count = 0;
    $.each(data, function(key, value){
      console.log(value);
      dataPoints.push({x:this.count, y:parseFloat(value.Value), label:value.DateTime});
      this.count++;
    });
	
	this.globalGraphdata = dataPoints;
	
    chart.render();
    updateChart();
    
    var k = this.count;
    function updateChart() {	
      $.each(data1, function(key, value) {
          dataPoints.push({x:k, y:parseFloat(value.Value), label:value.DateTime});
          k++;
      });
	  
      if (dataPoints.length >  20 ) {
            dataPoints.shift();				
          }
	 chart.render();
	setTimeout(()=>{updateChart()
	}, this.timeInterval);
	}
	


  }

  fnPlayPause(play){
	  if(!play){
			var command = '{"Command" : "StartGraph1"}'
			// var command = '{"Command" : "StartGraph"}'
			this.SocketService.sendMessage(command);
			//this.SocketService.sendMessage("StartGraph1()");
			this.graph1StartStatusReceived = true;
	  }
	  else{
			var command = '{"Command" : "StopGraph1"}'
			// var command = '{"Command" : "StopGraph"}'
			this.SocketService.sendMessage(command);
			//this.SocketService.sendMessage("StopGraph1()");
			this.graph1StartStatusReceived = false;
	  }
  }

  
  

  saveGraph(){
	let formattedoptions = JSON.stringify(this.liveGraphFinalData);
	var path = this.InstalledPath;
	var libraryPath = ""
	if(this.osInformation = "windows"){
		libraryPath = path+"PTATGUI\\assets\\canvasjs.min.js"
	}else{
		libraryPath = path+"PTATGUI//assets//canvasjs.min.js"
	}

	var content = "<!DOCTYPE HTML><html><head><script>window.onload = function () {" + "var chart = new CanvasJS.Chart('chartContainer', "+formattedoptions+");chart.render();}</script></head><body><div id='chartContainer' style='height: 370px; width: 100%;'></div><div id= 'scrollbar' class=' scroll-bar-wrap ui-widget-content ui-corner-bottom' style = 'visibility:hidden;'><div class='scroll-bar1 nomargin'></div></div></body><script src='"+libraryPath+"'></script><script src='canvasjs.min.js'></script></html>";
	var htmlContent = [content];
	var bl = new Blob(htmlContent, {type: "text/html"});
	this._FileSaverService.save(bl, "LiveGraph.html");
  }



  addToPlotOfflineList(){
	let paramIndex = parseInt($(".paramSelected").attr("data-index"));
	// if(this.offlineGraphIndexList.indexOf(paramIndex) > -1){
	if(this.offlineGraphStaticGraphId.indexOf(paramIndex) > -1){
		//this.notifier.notify("error", "Duplicates not allowed");
		this.offlineGraphDuplicatError = "Duplicate parameters are not allowed";
	}
	else{
		this.offlineGraphStaticGraphId.push(paramIndex);
		this.offlineGraphStaticGraphName.push($(".paramSelected").attr("data-value"));
		this.offlineGraphDirection.push($('#offlinegraphDirectionSelectBox').val());
		var latestParamIndex = paramIndex+8;
		var command = '{"Command" : "AddParamToGraph2","Args":'+'"'+latestParamIndex+'"'+'}'
		this.SocketService.sendMessage(command);
		//this.SocketService.sendMessage("AddParamToGraph2("+latestParamIndex+")");
		this.offlineGraphDuplicatError = "";
	}
  }

  liveGraphAdd(){
	let data = $('.component').val();
	if(this.duplicateCheck.indexOf(data)> -1){
	}else{
		this.duplicateCheck.push(data);
	$(".selectedliveGrpahsList").append('<div  class="form-check"><label class="form-check-label"><input type="checkbox" class="form-check-input offlineGraphCheckBox">'+data+'</label></div>');
	}
  }

  addDeleteOfflineGraphliCommon(arg){
    let addDelIndividualClass = "addDelIndividualClass";
    let actualClass = addDelIndividualClass+arg;
    $('.offlineGraphParams').removeClass('paramSelected');
    $('.'+actualClass).addClass('paramSelected');
  }

  removeFromPlotOfflineList(){
	let checkBoxCount = $('.offlineGraphCheckBox');
	let len = checkBoxCount.length;
    for(let i =0 ; i<=len ; i++){
		if($(checkBoxCount[i]).is(':checked')) {
			let paramIndex = parseInt($(checkBoxCount[i]).parent().parent().attr("data-id")); 
			// let removeIndex = this.offlineGraphIndexList.indexOf(paramIndex);
			let removeIndex = this.offlineGraphStaticGraphId.indexOf(paramIndex);
			if (removeIndex > -1) {
				// this.offlineGraphIndexList.splice(removeIndex, 1);
				this.offlineGraphStaticGraphId.splice(removeIndex, 1);
				this.offlineGraphNameList.splice(removeIndex, 1);
				this.offlineGraphDirection.splice(removeIndex, 1);
				var latestParamIndex = paramIndex+8;
				var command = '{"Command" : "RemoveParamFromGraph2","Args":'+'"'+latestParamIndex+'"'+'}'
				this.SocketService.sendMessage(command);
				//this.SocketService.sendMessage("RemoveParamFromGraph2("+latestParamIndex+")");
				$(checkBoxCount[i]).parent().parent().remove();
			}
		}
	}
  }

  clearPlotOfflineList(){
	let checkBoxCount = $('.offlineGraphCheckBox');
	//let paramIndexList = this.offlineGraphIndexList.join();
	let paramIndexList = this.offlineGraphStaticGraphId.join();
	var offlineGraphLatestIndexList = [];
	// for(let i=0;i<=this.offlineGraphIndexList.length-1;i++){
	// 	offlineGraphLatestIndexList.push(this.offlineGraphIndexList[i]+8);
	// }
	for(let i=0;i<=this.offlineGraphStaticGraphId.length-1;i++){
		offlineGraphLatestIndexList.push(this.offlineGraphStaticGraphId[i]+8);
	}
	var command = '{"Command" : "RemoveParamFromGraph2","Args":'+'"'+offlineGraphLatestIndexList+'"'+'}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("RemoveParamFromGraph2("+offlineGraphLatestIndexList+")");
	//this.offlineGraphIndexList.length = 0;
	this.offlineGraphStaticGraphId.length = 0;
	this.offlineGraphNameList.length = 0;
	this.offlineGraphDirection.length = 0;
	$(".divOfflinePlottingList").empty();
	this.disableOfflineGraphRemoveBtn = 0;
  }

   offlineGraphValue:any={
    "Command": "StartGraph2",
    "CommandStatus": {
      "Status": "success",
      "Message": "success message"
    },
    "Data": [
			{
				"Key": "2",
				"Value": "0",
				"Info": "29/10/2018 22:54:17"
			},
			{
				"Key": "8",
				"Value": "0",
				"Info": "29/10/2018 22:54:47"
			}
		]

  }

  playOfflineGraph(){

  }

offlineGraphSubmit(){
	$('#offlineGraphContainer').empty();
	var width = parseInt($('#offlineGraphContainer').css('width'));
	var height = parseInt($('#offlineGraphContainer').css('height'));
	this.offlineGraphWidth = width;
	this.offlineGraphHeight = height;
	
	this.offlineGraphParsedData.length=0;
	let offlineGraphData = this.offlineGraphValue.Data; 
	let len = offlineGraphData.length;
    for(let i =0;i<len;i++){
	  let actualid     = parseInt(offlineGraphData[i].Key);
	  let id    = actualid-8; 
      let value = offlineGraphData[i].Value;
	  let time  = offlineGraphData[i].Info;
	  let index = this.offlineGraphStaticGraphId.indexOf(id);
	  let legendText = this.offlineGraphStaticGraphName[index];
	  let name = this.offlineGraphStaticGraphName[index];
	  let direction = this.offlineGraphDirection[index];
	  console.log("sajith",direction);
	  
	  if(typeof(this.offlineGraphParsedData[index]) == "object"){

	  }else{
		  if(direction !== "Left"){
			this.offlineGraphParsedData[index] = {type:"line",axisYType:"primary",lineDashType:"dash",markerType:"circle",showInLegend: true,animationEnabled:true,name:name,dataPoints:[]}; 
		  }else{
			this.offlineGraphParsedData[index] = {type:"line",axisYType:"secondary",markerType:"cross",showInLegend: true,animationEnabled:true,name:name,dataPoints:[]}; 
		  }
		 
	  }
	    this.offlineGraphParsedData[index].dataPoints.push({y:parseFloat(value),label:time,toolTipContent: "{label}<br/>{name}: value- " + value});
	
    }
		
    this.offLineGraphFinalData =  {
	  toolTip: {
		shared: true
	  },
	  width : parseInt($('#offlineGraphContainer').css('width')),
	  height: parseInt($('#offlineGraphContainer').css('height')),
	  zoomEnabled:true,
	  legend: {
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }

                e.chart.render();
            }
        },
      data:this.offlineGraphParsedData
	}
	
	this.offlineChart = new CanvasJS.Chart("offlineGraphContainer",this.offLineGraphFinalData)
	this.offlineChart.render();

  }

  appendToOfflineGraph(){
	let offlineGraphData = this.offlineGraphValue.Data; 
	let len = offlineGraphData.length;
    for(let i =0;i<len;i++){
	  let actualid     = parseInt(offlineGraphData[i].Key);
	  let id    = actualid-8; 
      let value = offlineGraphData[i].Value;
	  let time  = offlineGraphData[i].Info;
	  let index = this.offlineGraphStaticGraphId.indexOf(id);
	  let legendText = this.offlineGraphStaticGraphName[index];
	  let name = this.offlineGraphStaticGraphName[index];
	  
	  if(typeof(this.offlineGraphParsedData[index]) == "object"){

	  }else{
		this.offlineGraphParsedData[index] = {type:"line",showInLegend: true,animationEnabled:true,name:name,dataPoints:[]}; 
	  }
	    this.offlineGraphParsedData[index].dataPoints.push({y:parseFloat(value),label:time,toolTipContent: "{label}<br/>{name}: value- " + value});
	
    }		
	this.offlineChart.render();

  }

sendCmd5Min(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*1000*5/this.refreshTime;
	this.viewportSize = this.interval;
	var command = '{"Command" : "GetGraphPoints","Args": "5"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(5)");
	this.clearLiveGraph();
}
sendCmd15Min(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*1000*15/this.refreshTime;
	this.viewportSize = this.interval;
	var command = '{"Command" : "GetGraphPoints","Args": "15"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(15)");
	this.clearLiveGraph();
}
sendCmd30Min(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*1000*30/this.refreshTime;
	this.viewportSize = this.interval;
	var command = '{"Command" : "GetGraphPoints","Args": "39"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(39)");
}
sendCmd60Min(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*60*1000/this.refreshTime;
	this.viewportSize = this.interval;
	var command = '{"Command" : "GetGraphPoints","Args": "60"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(60)");
}

sendCmd300Min(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*60*1000*5/this.refreshTime;
	this.viewportSize = this.interval;
	var command = '{"Command" : "GetGraphPoints","Args": "300"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(300)");
}

sendCmd720Min(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*60*1000*12/this.refreshTime;
	this.viewportSize = this.interval;
	var command = '{"Command" : "GetGraphPoints","Args": "720"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(720)");
}

reset(){
	if(this.refreshTime == ""){
		this.refreshTime = this.initialRefreshTime;
	}
	this.interval = 60*1000*1/this.refreshTime;
	this.viewportSize = 60;
	var command = '{"Command" : "GetGraphPoints","Args": "1"}'
	this.SocketService.sendMessage(command);
	//this.SocketService.sendMessage("GetGraphPoints(1)");
	this.clearLiveGraph();
}

clearLiveGraph(){
	this.liveGraphDataArray.length = 0;
	this.plotLiveChart.render();
}

liveGraphMinimzeMaximizestatus: boolean = false;
liveGraphMinimzeMaximize(){
	this.liveGraphMinimzeMaximizestatus = !this.liveGraphMinimzeMaximizestatus; 
	if(this.liveGraphMinimzeMaximizestatus){
		$('#livegraph').css({'height':'98%'});
	}else{
		$('#livegraph').css({'height':'45%'});
		this.plotLiveChart.render();	
	}
}

offlineGraphMinimzeMaximizestatus: boolean = false;
offlineGraphMinimzeMaximize(){
	this.offlineGraphMinimzeMaximizestatus = !this.offlineGraphMinimzeMaximizestatus;
	if(this.offlineGraphMinimzeMaximizestatus){
		$('#offlinegraph').css({'height':'95%'});
	}else{
		$('#offlinegraph').css({'height':'50%'});
	}
	var offLineGraphFinalData1 =  {
		toolTip: {
		  shared: true
		},
		width : parseInt($('#offlineGraphContainer').css('width')),
		height: parseInt($('#offlineGraphContainer').css('height')),
		zoomEnabled:true,
		legend: {
			  cursor: "pointer",
			  itemclick: function (e) {
				  if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					  e.dataSeries.visible = false;
				  } else {
					  e.dataSeries.visible = true;
				  }
  
				  e.chart.render();
			  }
		  },
		data:this.offlineGraphParsedData
	  }
	  
	  var offlineChartData = new CanvasJS.Chart("offlineGraphContainer",offLineGraphFinalData1)
	  offlineChartData.render();
}

loadOfflineGraphSubmit(){
    var path = ""
	if(this.osInformation = "windows"){
		path = this.logFilePath.replace(/\\/g,"\\\\");
	}else{
		path = this.logFilePath.replace(/\\/g,"////");
	}
	var fullPath = path + $('#loadGraphFileName').val();
	var command = '{"Command" : "LoadGraph2File","Args":'+'"'+fullPath+'"'+'}'
	//let command :any = "LoadGraph2File("+this.logFilePath+$('#loadGraphFileName').val()+")";
	this.SocketService.sendMessage(command);
}

saveOfflineGraph(){
	var graphData = JSON.stringify(this.offLineGraphFinalData, null, 4);
	var path = this.InstalledPath;
	var libraryPath = ""
	if(this.osInformation = "windows"){
		libraryPath = path+"PTATGUI\\assets\\canvasjs.min.js"
	}else{
		libraryPath = path+"PTATGUI//assets//canvasjs.min.js"
	}
	var content = "<!DOCTYPE HTML><html><head><script>window.onload = function () {var chart = new CanvasJS.Chart('chartContainer', "+graphData+");chart.render();}</script></head><body><div id='chartContainer' style='height: 370px; width: 100%;'></div></body><script src='"+libraryPath+"'></script><script src='canvasjs.min.js'></script></html>";
	var htmlContent = [content];
	var generateOfflineGraphFile = new Blob(htmlContent, {type: "text/html"});
	this._FileSaverService.save(generateOfflineGraphFile, "OfflineGraph.html");      
}

openLoadModal() {
	console.log(this.logFilePath);
	
	this.spinner.show();
	 //var cmd = "GetFilesInDir("+this.logFilePath+",log)";
	var path = ""
	if(this.osInformation = "windows"){
		path = this.logFilePath.replace(/\\/g,"\\\\");
	}else{
		path = this.logFilePath.replace(/\\/g,"////");
	}
	console.log(path);
	 var command = '{"Command" : "GetFilesInDir","Args":'+'"'+path+',log'+'"'+'}'
	 this.SocketService.sendMessage(command);
  }

  	startOfflineGraph(){
		//this.SocketService.sendMessage("StartGraph2()");
		var command = '{"Command" : "StartGraph2"}'
		this.SocketService.sendMessage(command);
		this.IsStartGraph2Sent = true;
	}

	componentChanged(){
		if(this.dataType == 'Clientside') {
			this.liveGraphArg1Arr = this.component.Treelist;
			this.argOne = this.liveGraphArg1Arr[0];
			this.liveGraphArg2Arr = this.argOne.SubTreeList;
			this.argTwo = this.liveGraphArg2Arr[0];
			this.graphDisplayName = this.argOne.Name + '_' + this.argTwo.Name;
		} else {
			console.log(this.component); //CPU
			this.liveGraphArg1Arr = this.component.child; //list of cpu 0 -10
			this.argOne = this.liveGraphArg1Arr[0]; //cpu0
			this.liveGraphFeature = this.argOne.data.Features;
			this.argFeature = this.liveGraphFeature[0];
			
			this.liveGraphArg2Arr = this.argOne.children;
			// this.liveGraphThread = this.liveGraphArg2Arr[0].children;
			this.graphDisplayName = this.argOne.data.Name + '_' + this.argFeature.Name;
			this.argTwo = 'select';
			this.argThread = 'select'
		}

		
		// /*
			// let compIndex = this.component;
			// let arg1Index = this.argOne;
			// let arg2Index = this.argTwo;
			// //this.SocketService.sendMessage("Graph1ComponentSelected("+compIndex+","+arg1Index+","+arg2Index+",-1)");
			// var command = '{"Command" : "Graph1ComponentSelected","Args":'+'"'+compIndex+","+arg1Index+","+arg2Index+","+this.argThreeIndex+",-1"+'"'+'}'
			// this.SocketService.sendMessage(command);
		// */
		
	}

	arg1Changed(){
		if(this.dataType == 'Clientside') {
			this.liveGraphArg2Arr = this.argOne.SubTreeList;
			this.argTwo = this.liveGraphArg2Arr[0];
			this.graphDisplayName = this.argOne.Name + '_' + this.argTwo.Name;
		} else {
			console.log(this.argOne); // cpu0;
			this.liveGraphArg2Arr = this.argOne.children;
			this.liveGraphFeature = this.argOne.data.Features;
			this.argFeature = this.liveGraphFeature[0];
			// this.liveGraphThread = this.liveGraphArg2Arr[0].children;
			this.graphDisplayName = this.argOne.data.Name + '_' + this.argFeature.Name;
			this.argTwo = 'select';
			this.argThread = 'select'
		}
		
		// /*
			// let compIndex = this.component;
			// let arg1Index = this.argOne;
			// let arg2Index = this.argTwo;
			// //this.SocketService.sendMessage("Graph1Arg1Selected("+compIndex+","+arg1Index+","+arg2Index+",-1)");
			// var command = '{"Command" : "Graph1Arg1Selected","Args":'+'"'+compIndex+","+arg1Index+","+arg2Index+","+this.argThreeIndex+",-1"+'"'+'}'
			// this.SocketService.sendMessage(command);
		//  */
		
	}
	
	arg2Changed(){
		console.log(this.argTwo);
		if(this.dataType == 'Clientside') {
			this.graphDisplayName = this.argOne.Name + '_' + this.argTwo.Name;
		} else {
			// this.liveGraphFeature = 
			if(this.argTwo !== 'select') {
				this.liveGraphThread = this.argTwo.children;
				this.liveGraphFeature = this.argTwo.data.Features;
				this.argFeature = this.liveGraphFeature[0];
				this.graphDisplayName = this.argOne.data.Name + '_' + this.argTwo.data.Name+ '_'+ this.argFeature.Name;
			}
			else {
				this.graphDisplayName = this.argOne.data.Name + '_' + this.argFeature.Name;
				this.liveGraphArg2Arr = this.argOne.children;
				this.liveGraphFeature = this.argOne.data.Features;
				this.argFeature = this.liveGraphFeature[0];
				this.argTwo = 'select';
				this.argThread = 'select';
				this.liveGraphThread = [];
			}
			this.argThread = 'select';
		}
		
		// console.log(this.argTwo);
		
		// /*
			// let compIndex = this.component;
			// let arg1Index = this.argOne;
			// let arg2Index = this.argTwo;
			// //this.SocketService.sendMessage("Graph1Arg2Selected("+compIndex+","+arg1Index+","+arg2Index+",-1)");
			// var command = '{"Command" : "Graph1Arg2Selected","Args":'+'"'+compIndex+","+arg1Index+","+arg2Index+","+this.argThreeIndex+",-1"+'"'+'}'
			// this.SocketService.sendMessage(command);
		//  */
		
	}

	arg3Changed(){
		let compIndex = this.component;
		let arg1Index = this.argOne;
		let arg2Index = this.argTwo;
		if(this.argThree == "Left"){
			this.argThreeIndex = 1;
		}else{
			this.argThreeIndex = 2;
		}	
		// var command = '{"Command" : "Graph1Arg2Selected","Args":'+'"'+compIndex+","+arg1Index+","+arg2Index+","+this.argThreeIndex+",-1"+'"'+'}'
		// this.SocketService.sendMessage(command);
	}

	argThreadChanged() {
		console.log(this.argThread);
		if(this.argThread !== 'select') {
			this.liveGraphFeature = this.argThread.data.Features;
			this.argFeature = this.liveGraphFeature[0];
			this.graphDisplayName = this.argOne.data.Name + '_' + this.argTwo.data.Name+'_' + this.argThread.data.Name+ '_'+ this.argFeature.Name;
		} else {
			console.log(this.argTwo);
			if(this.argTwo !== 'select') {
				this.liveGraphFeature = this.argTwo.data.Features;
				this.argFeature = this.liveGraphFeature[0];
				this.graphDisplayName = this.argOne.data.Name + '_' + this.argTwo.data.Name+'_' +  this.argFeature.Name;
			} else {
				this.argThread = 'select';
				this.liveGraphThread = [];
				this.liveGraphFeature = this.argOne.data.Features;
				this.argFeature = this.liveGraphFeature[0];
				this.graphDisplayName = this.argOne.data.Name + '_' +  this.argFeature.Name;
			}
			
		}
	}

	argFeatureChanged(event) {
		console.log('change',this.argFeature );
		console.log(event);
		var str = this.graphDisplayName.split("_");
		str[str.length - 1] = this.argFeature.Name;
		console.log(str);
		this.graphDisplayName = str.join("_");
		console.log(this.graphDisplayName);
	}
	refreshOfflineGraphLogFile(){
		//var cmd = "GetFilesInDir("+this.logFilePath+",log)";
		var path = ""
		if(this.osInformation = "windows"){
			path = this.logFilePath.replace(/\\/g,"\\\\");
		}else{
			path = this.logFilePath.replace(/\\/g,"////");
		}
		var command = '{"Command" : "GetFilesInDir","Args":'+'"'+path+",log"+'"'+'}'
		this.SocketService.sendMessage(command);
	}



	parseLiveGraphData(ReceivedData){
		console.log(ReceivedData);
		/* var graphwidth =  parseInt($('#liveGraphContainer').css('width'));
		var graphHeight =  parseInt($('#liveGraphContainer').css('height'));
		this.liveGraphWidth = graphwidth - 130;
		this.liveGraphHeight = graphHeight; */
		
		this.liveGraphWidth = parseInt($('#liveGraphContainer').css('width'));
		this.liveGraphHeight = parseInt($('#liveGraphContainer').css('height'));

		this.plotLiveChart.options.width = this.liveGraphWidth;
		this.plotLiveChart.options.height = this.liveGraphHeight;


		this.graphCount = ReceivedData.length;
		if(this.isHugeData){
			if(this.graphCount == this.liveGraphUIDList){
				this.isHugeData = false;
				this.isBulkData = false;
			}else{
				this.isBulkData = true;
			}
		}else{
			this.isBulkData = false;
		}

		
		for(let i=0;i<ReceivedData.length;i++){
			if(this.isBulkData){
				this.current = this.current+1;
			}
			var key = ReceivedData[i].Key;
			// var index = this.liveGraphUIDList.indexOf(ReceivedData[i].Key);
			var index = this.liveGraphUIDList.findIndex(data => data == ReceivedData[i].Key);
			// var index = 0;
			console.log(this.liveGraphUIDList, index);
			console.log(this.liveGraphDate);
			
			if(this.liveGraphDate != ReceivedData[i].DateTime && this.liveGraphDate != ""){
				this.xVal=this.xVal+1
			}

			// "Data":[{"Key":"0","Value":"0","Info":"1627903083546","DateTime":"2/8/2021 16:48:03.546","Direction":"1"}]
			console.log(this.liveGraphDataArray, index)
			console.log(this.liveGraphDataArray[index]);
			
			this.liveGraphDate = ReceivedData[i].DateTime;
			if(this.liveGraphDataArray[index] == undefined){
				this.liveGraphDataArray[index]= {}; 
				this.liveGraphDataArray[index].type = "line";
				this.liveGraphDataArray[index].showInLegend = true;
				this.liveGraphDataArray[index].visible = true;
				this.liveGraphDataArray[index].zoomEnabled = true;
				this.liveGraphDataArray[index].name = '';
				if(ReceivedData[i].Direction !== 1){
					this.liveGraphDataArray[index].axisYType = "primary";
					this.liveGraphDataArray[index].lineDashType = "dash";	
					this.liveGraphDataArray[index].markerType= "circle";
				
				}else{
					this.liveGraphDataArray[index].axisYType = "secondary";
					this.liveGraphDataArray[index].markerType= "cross";

				}
				console.log(this.liveGraphDataArray[index]);
				console.log(this.liveGraphList)
				this.liveGraphDataArray[index].name = this.liveGraphList[index].graphName;
				this.liveGraphDataArray[index].dataPoints = [];	
				this.liveGraphDataArray[index].dataPoints.push({x:this.xVal, y:parseFloat(ReceivedData[i].Value),label:ReceivedData[i].DateTime})				
			}else{
				this.liveGraphDataArray[index].dataPoints.push({x:this.xVal, y:parseFloat(ReceivedData[i].Value),label:ReceivedData[i].DateTime});
			}
			// console.log("sajith",parseFloat(ReceivedData[i].Value));
		 }

	//this.plotLiveChart.render();
	$('.scroll-bar').slider(); 
		this.liveGraphSliderMove();
	}

	liveGraphSliderMove(){
		if(!this.plotLiveChart.options.axisX){
			this.plotLiveChart.options.axisX={viewportMinimum:null, viewportMaximum:null};
		}
			this.adjustGraphSlider();
			this.plotLiveChart.render();
			//$(this).find('.ui-slider-handle').html("");
	} 

	adjustGraphSlider(){
		if(this.isDynamic){
			this.dynamicWidth = this.viewportSize-1;

			if((this.current - this.dynamicWidth) < 0){
				this.plotLiveChart.options.axisX.viewportMinimum = 0 ;
			}else{
				$("#scrollBarParent").css({'visibility':'visible'});
				this.plotLiveChart.options.axisX.viewportMinimum = this.current - this.dynamicWidth;
			}
			this.plotLiveChart.options.axisX.viewportMaximum = this.plotLiveChart.options.axisX.viewportMinimum + this.viewportSize;
			$( ".scroll-bar" ).slider( "option", "value", this.plotLiveChart.options.axisX.viewportMinimum + this.dynamicWidth);
		}else{
			this.plotLiveChart.options.axisX.viewportMinimum = $(".scroll-bar").slider( "option", "value" );
			this.plotLiveChart.options.axisX.viewportMaximum = this.dynamicWidth-1;
		}
		$( ".scroll-bar" ).slider("option", "max", this.current++);
		this.scrollPane = $(".scroll-panel");
		var newBarWidth = this.scrollPane.width() / this.current;
		if(newBarWidth > 20){
			this.scrollbar.find(".ui-slider-handle").css({
				width: newBarWidth,
				"margin-left": -newBarWidth / 2
			});
			if(newBarWidth == 20){
				this.handleHelper = this.scrollbar.find( ".ui-slider-handle" ).append( "<span class='ui-icon ui-icon-grip-dotted-vertical'></span>" )
			//  this.handleHelper.width( "" ).width( this.scrollbar.width() - newBarWidth );
			}
		}

		} 
	



	openOfflineAddDeleteModel(){
		this.showHideOfflineGraphModal = true;
	}
	closeOfflineGraphAddDeleteModal(){
		this.showHideOfflineGraphModal = false;
	}

	selectOfflineGraphCheckBox(){
		let checkBoxCount = $('.offlineGraphCheckBox');
		var checkedCount = 0;
		for(let i =0 ; i<=checkBoxCount.length ; i++){
			if($(checkBoxCount[i]).is(':checked')) {
				checkedCount=checkedCount+1;
			}
		}
		if(checkedCount>0){
			this.disableOfflineGraphRemoveBtn = 1;
		}else{
			this.disableOfflineGraphRemoveBtn = 0;
		}
	}
		
}


