import { Component,ViewChild,OnInit,OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { UtilityServiceService } from '../services/utility-service.service';
import { SocketService } from '../db/socket.service';
import { HostListener } from "@angular/core";
import {MatSidenav} from '@angular/material/sidenav'; 
import { MatMenuTrigger } from '@angular/material';
declare let $: any;

@Component({
  selector: 'app-live-analysis',
  templateUrl: './live-analysis.component.html',
  styleUrls: ['./live-analysis.component.css']
})
export class LiveAnalysisComponent implements OnInit {
  @ViewChild('sidenav',{static: false}) sidenav: MatSidenav;
  @ViewChild(MatMenuTrigger,{static: false})
  
  contextMenu: MatMenuTrigger;
  g_GfxDialogId:any = [];
  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }


   onContextMenuAction1() {
    alert(`Click on Action 1 for`);
  }

  liveAnalysisTreeData;
  analysisIndex:any ="";
  analysisName:any = "";
  analysisDesc:any = "";
  analysisPreCond:any = "";
  activeClass:any = "";
  analysisBtnval:string = "Start";
  // solverRes:Array<string> = [];
  solverResult = [];
  hasClass:any=false;
  constructor(private dataService: DataService,public utility: UtilityServiceService,
    private SocketService:SocketService) { }

  ngOnInit() {

    this.utility.closeLiveAnalyContextMenu.subscribe(data => {
      if(data == true){
       this.closeContextMenu();
      }
    });

    // this.sendingCommand();
    this.SocketService.GetSolverDataRes().subscribe(message => {
      if (message) {    
        this.liveAnalysisTreeData = message.Data;
        this.expandCollapse(this.liveAnalysisTreeData[0]);
        this.addingToBox(this.liveAnalysisTreeData[0].Treelist[0]);
      }
    });

    this.SocketService.StartSolverRes().subscribe(message => {
      if (message) {
        var startSolverResponse  = message.Data;
      }
    });

    this.SocketService.SolverStatusRes().subscribe(message => {
      //var dummy = '{"Command":"SolverStatus","CommandStatus":{"Status":"Success","Message":""},"Data":{"Status":"16","count":"1","filename":"Gfxworkload.html","Arguments":"360"}}';
      //var dummyJSON = JSON.parse(dummy);
      //message = dummyJSON;
      var endsWithString = "solver";
      if (message) {
        this.solverResult.push(message.Data); 
      }
      if(message.Data.Status == "1"){
        this.StopGfxWorkload(endsWithString); 
        this.analysisBtnval = "Start";
      }
      else if(message.Data.Status == "2"){
        this.StopGfxWorkload(endsWithString); 
        this.analysisBtnval = "Start";
      }
      else if(message.Data.Status == "6"){
        this.StopGfxWorkload(endsWithString);  
      }
      else if(message.Data.Status == "16"){
      if(message.Data.count != undefined){
        message.Data.filename = "assets//" + message.Data.filename;
        this.launchGFXWorkloadFromUI(message.Data.filename, message.Data.Arguments, message.Data.count, endsWithString );
      }
    }
    });

    this.SocketService.StopSolverRes().subscribe(message => {
      var endsWithString = "solver";
      if (message) {   
        var StopSolverResponse = message.Data;
        this.StopGfxWorkload(endsWithString);    
      }
    });



  }

  // sendingCommand(){
  //   SocketService.send("GetSolverData()");
  //   SocketService.send("OtherView()");
  //   this.suscribingData();
  // }
  
  suscribingData(){
   //this.liveAnalysisTreeData = this.dataService.getLiveAnalysisData().Data;
    // console.log(this.liveAnalysisTreeData);
    // this.expandCollapse(this.liveAnalysisTreeData[0]);
    // this.addingToBox(this.liveAnalysisTreeData[0].Treelist[0]);
  }

  expandCollapse(item){
   // console.log(item);
    item.expand = !item.expand;
 }
 addingToBox(res){
  this.analysisIndex = res.Index;
  this.analysisName = res.AnalysisName;
  this.analysisDesc = res.AnalysisDescription;
  this.analysisPreCond = res.AnalysisPrecondtion;
  var actualClass = "liveAnalysisIndividual"+this.analysisIndex;
  $(".liveAnalysisTreeCC").removeClass('liveAnalysisTreeselectionColor');
  $("."+actualClass).parent().addClass('liveAnalysisTreeselectionColor');
 }

 startSolver(rcv){
   let cmd;
   if(rcv == 'Start'){
    this.analysisBtnval = "Stop";
    // cmd = 'StartSolver(' + this.analysisIndex + ')';
    cmd = '{"Command" : "StartSolver","Args":'+'"'+this.analysisIndex+'"'+'}'
   }else {
     this.analysisBtnval = "Start";
    // cmd = 'StopSolver()';
    cmd = '{"Command" : "StopSolver"}'
   }
   this.SocketService.sendMessage(cmd);
  //this.solverDataAssign();
 }

 solverDataAssign(){
    // let storeSolverData = this.dataService.getSolverData().Data;
    // var len = storeSolverData.length;
    // for(let i = 0; i < len; i++){
    //   let item = storeSolverData[i];
    //     setTimeout(() => {
    //     }, 2000*(i+1));
    // }
  }



  selectAll(){
    //(document.getElementById('liveAnaysisContainer') as HTMLInputElement).select();
   
    //$('.liveAnaysisContainer').select();
    //$(".liveAnaysisContainer").text(getSelectedText());

    var range = document.createRange();
    range.selectNode(document.getElementById("liveAnaysisContainer"));
    window.getSelection().removeAllRanges(); 
    window.getSelection().addRange(range); 
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }

  


  clearAll(){
    this.solverResult.length = 0;
  }

  toggleIcon(){
    this.hasClass = !this.hasClass;
  }

  closeContextMenu(){
    this.contextMenu.closeMenu();
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

export interface Item {
  id: number;
  name: string;
}
