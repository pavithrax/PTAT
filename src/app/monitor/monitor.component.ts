import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
// import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from 'angular-gridster2';
//import * as $ from 'jquery';
import {UtilityServiceService} from '../services/utility-service.service';
import { SocketService } from '../db/socket.service';
import { DataService } from '../services/data.service';
import { NgxSpinnerService } from "ngx-spinner";
import { HostListener } from "@angular/core";
declare var $: any;

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MonitorComponent implements OnInit {
   
  showHidden1table = true;
  showHidden2table = true;
  showHidden3table = true;
  monitorValue : string = "monitorValueClass";
  text = "";
  grid:any;
  btnFlag:boolean = false;
  btnFlag1:boolean = false;
  starmonitorflag = 0;
  // AddToCustomViewList:any = "AddToCustomViewList(#id)"
  customWorkspace : any = [];
  gridbuild:any;
  showHideTabularView:boolean = false;
  loadCustomViewtableId:number;
  selectedIndex:any = 1;
  hideComponentDropDown:boolean = false;
  showMonitorLogginModal:boolean;
  showHideStartLoggingCheckBoxStatus: boolean = false;


  constructor(private data : UtilityServiceService, private SocketService:SocketService, private DataService:DataService,private spinner: NgxSpinnerService,) { 

  //TO RECEIVE DATA FROM TREEVIEW CHECKBOX CLICK
  this.data.share.subscribe(data => {
    //Hide or show grid data based on treeview click
 
    setTimeout(() => {
      var count = $('#sidebar input[type="checkbox"]:checked').length;
      if(count > 0){
        this.btnFlag = false;
        this.btnFlag1 = false;
      }else{ 
        if(this.starmonitorflag == 1){
          if(this.table1Data.length>0 || this.table2Data.length>0 || this.table3Data.length>0){
          }else{
            var command = '{"Command" : "StopMonitor"}'
            this.SocketService.sendMessage(command);
            // this.SocketService.sendMessage('StopMonitor()');
            this.starmonitorflag = 0 ;
            this.btnFlag = true;
            this.btnFlag1 = true;
          }
        }else{
          this.btnFlag = true;
          this.btnFlag1 = true;
        }
      }


      // var tbody = $(".equalspacing tbody");
      // if (tbody.children().length == 0) {
      //     tbody.parents('table').parents('.equalspacing').hide();
      // }else{
      //   tbody.parents('table').parents('.equalspacing').show();
      // }
      // $(".container1").trigger("ss-rearrange");   

 
      this.tblcount = $('.tablegrid');
      let len = this.tblcount.length;
      for (var i = 0; i < len; i++) {
        if(this.tblcount[i].children[1].children.length == 0){
          let tblname =  $(this.tblcount[i]).parents('.equalspacing')[0].id;
          var tblnode = document.getElementsByClassName(tblname)[0];
          if(tblnode){
            tblnode.parentNode.removeChild(tblnode);
          }
          $(this.tblcount[i]).parents('.equalspacing').hide();
          $('#controltable tr:visible:odd').removeClass('odd').addClass('even');
          $('#controltable tr:visible:even').removeClass('even').addClass('odd');
          $(".container1").trigger("ss-rearrange");
        }else{
          $(this.tblcount[i]).parents('.equalspacing').show();
          $(".container1").trigger("ss-rearrange");
          $('#controltable tr:visible:odd').removeClass('odd').addClass('even');
          $('#controltable tr:visible:even').removeClass('even').addClass('odd');
        }
      }

    },0)
    
  //hide and show for list view based on treeview checkbox click
    var a  = data;
    var len = a.length-1;
    for(let i=0;i<=len;i++){
      let className = a[i].className;
      let status = a[i].checkedStatus;
      if(className == "" || className == undefined){
        break;
      }
      if(status == 1){
        $("."+className).removeClass('hide');
      }else{
        $("."+className).addClass('hide');
      }
     
    }

 


  })

  this.data.loadWorkSpaceFlag.subscribe(data => {
    if(data == 1){
      this.selectedIndex = 1;
      this.setTab('grid');
      this.table1Data = [];
      this.table2Data = [];
      this.table3Data = [] ;
      this.customWorkspace = []; 
      this.checkToShowHidetable();
    }
  })

}

  //VARIABLE DECLARATION
  tblcount:any;
  table1Data:Array<any> = [];
  table2Data:Array<any> = [];
  table3Data:Array<any> = [];
  tableError = false;
  tableErrorName:any = "";
  dataArr:any;
  componentData:any;
  selectedcount:any;
  counter:number = 1;
 
   //Find count child selcted status for castrocov and warencove
  checkChildStatus(data){
    let childdata = data.SubTreeList;
    var result = childdata.find(function (value) {return value.isSelected == true });
    return result;
   } 
   
  stringify(obj) {
    return JSON.stringify(obj);
  }

  fnWindowresize(){
    if (typeof(Event) === 'function') {
      window.dispatchEvent(new Event('resize'));
    } else { //FOR IE 
      var evt = window.document.createEvent('UIEvents'); 
      evt.initUIEvent('resize', true, false, window, 0); 
      window.dispatchEvent(evt); 
    }
  }

  dataPresent(){
    return false;
  }

  ngOnInit() {
    // var dat =this.DataService.getData();
  

    this.SocketService.getMonitorDataRes().subscribe(message => {
      if (message) {
        // console.log("print in console");
        // console.log(message.Data[0].Treelist);
        var command = '{"Command" : "GetCommonData"}'
        var getSettingsCommand = '{"Command" : "GetSettings"}'
        if(this.counter > 2){
          this.SocketService.sendMessage(getSettingsCommand);
        }
        this.SocketService.sendMessage(command);
     
        this.counter++
        //this.SocketService.sendMessage("GetCommonData()");
        //this.SocketService.sendMessage("GetSettings()");
        this.gridbuilder();

        this.dataArr = message.Data;
        this.dataArr.forEach(superparentObj => {
          superparentObj.Treelist.forEach(parentObj => {
            parentObj.Treelist.forEach(subparent => {
              let childObj = subparent.SubTreeList
              this.childCheck(superparentObj,parentObj,subparent,childObj)
            });
          });
        });

        // setTimeout(function(){
        //  this.dataArr = this.testData.Data; 
        // },5000);


        setTimeout(function(){
          $('.equalspacing tbody:empty').parents('table').parents('.equalspacing').hide();
          $(".container1").trigger("ss-rearrange");
        },5);
        
        var count = $('input[type="checkbox"]:checked').length;
        if(count>0){
          this.btnFlag = false;
          this.btnFlag1 = false;
            }else{
              this.btnFlag = true;
              this.btnFlag1 = true;
        }

        var pluginCount = message.Data[0].Treelist
        var pluginNameCount = 0;
        var pluginLen = pluginCount.length-1;
        for(var i = 0; i<=pluginLen; i++){ 
          var pluginName = pluginCount[i].Name.toLowerCase();
           if(pluginName == "powermeter component" || pluginName == "castrocove component" || pluginName == "warrencove component"){
            pluginNameCount = pluginNameCount +1;
           }else{
           }

          //checking for castrocove and warrencove pluginname is there
           if(pluginName == "castrocove component" || pluginName == "warrencove component" ){
            this.data.imonflagChecking(true);
           }
        }
        
        if(pluginNameCount > 0){
          this.showHideTabularView = true;
        }else{
          this.showHideTabularView = false;
        }

        setTimeout(()=>{
        this.tblcount = $('.gridTable');
        var len = this.tblcount.length;
        for(var i = 0; i<len; i++){ 
          if(this.tblcount[i].children[1].children.length == 0){
            $(this.tblcount[i]).hide();
            $(".container1").trigger("ss-rearrange");
          }else{
            $(this.tblcount[i]).show();
            $(".container1").trigger("ss-rearrange");
          }
        }
       
          this.spinner.hide();
          $(".container1").trigger("ss-rearrange");
        })
     
        var pluginName = message.Data[0].Treelist;
        var pluginNameLen = pluginName.lengthe;
        for(var i=0;i<pluginNameLen;i++){
          var pluginNameCheck =  pluginName[i].Name;
        }
      }
    });

    this.data.pub_triggerResize.subscribe(data => {
      setTimeout(()=>{
        this.fnWindowresize();
        $(".container1").trigger("ss-rearrange"); 
      },50);
    });

    // this.SocketService.GetCommonDataRes().subscribe(message => {
    //   if (message) {
    //     if(message.CommandStatus.Status == 'Success'){
    //      this.componentData = message.Data;
    //      this.selectedContainer = this.componentData[0].pluginName;
    //      if(message.Data == ""){
    //        this.hideComponentDropDown = true;
    //      }
    //     }else{
          
    //     }
    //   }
    // });

    this.SocketService.RemoveFromCustomViewListRes().subscribe(message => {
      if (message) {
        console.log(message.Data);
      }
    });

    this.SocketService.StartMonitorRes().subscribe(message => {
      if (message) {
        if(message.CommandStatus.Status == 'Success'){//once it's success change the start monitor to stop monitor
          this.monitorstatus = false;
        }
        if(message.CommandStatus.Message == ""){
        var startMonitorResponseHandler  = message.Data;
        var smrhLen=startMonitorResponseHandler.length-1;
          for(let i=0;i<=smrhLen;i++){
            let key = startMonitorResponseHandler[i].Key;
            let value = startMonitorResponseHandler[i].Value;
            let classToAppend = "monitorValue"+key;
            $("."+classToAppend).html(value);
          }
          // $(".container1").trigger("ss-rearrange"); 
          // this.fnWindowresize();
        }else{     
          
         // this.monitorstatus = !this.monitorstatus;  
        }

        if(message.ShowPopup == 1){
          if( this.showMonitorLogginModal = true){
          
          }else{
            this.showMonitorLogginModal = true;
          }
        }else if(message.ShowPopup == 0){
          this.showMonitorLogginModal = false;
        }
          
      }
    });


    this.SocketService.StopMonitorRes().subscribe(message => {
      if (message) {  
       this.monitorstatus = true; 
       $('.naCommonClass').html('NA');
      }
    });


    this.SocketService.GetLogHeaderRes().subscribe(message => {
      if (message) {
        if(message.ShowPopup == 1){
          if( this.showMonitorLogginModal = true){
          
          }else{
            this.showMonitorLogginModal = true;
          }
        }else if(message.ShowPopup == 0) {
          this.showMonitorLogginModal = false;
        }
        var command = '{"Command" : "StartLogging"}'
        this.SocketService.sendMessage(command);
        // this.SocketService.sendMessage("StartLogging()");
        this.loggingstatus = !this.loggingstatus; 
      }

    });


    this.SocketService.StartLoggingRes().subscribe(message => {
      if (message) {
      
      }
    });


    this.SocketService.StopLoggingRes().subscribe(message => {
      if (message) {
        this.loggingstatus = true;  
      }
    });


    this.SocketService.LoadCustomViewDataStatus().subscribe(message => {
      if (message) {
      this.spinner.hide();
        if(message.CommandStatus.Status == 'Success'){
          this.loadCustomWorkspace(message.Data);   
        }else{
          
        }
      }
    });


    
  }

  converfn(val){
    return Boolean(JSON.parse(val));
  }

  
//Initiate the shapeshift gird
gridbuilder(){
  $(document).ready(function(){
    setTimeout(()=>{
      var containerCount = $(".container1 > div").length;
      var visibleContainerCount = $(".container1 > div").children(":hidden").length;
      if(containerCount - visibleContainerCount > 0){
      $(".container1").shapeshift({
        columns:3,
        animated:false,
        align:'left'
      });
     }

    },0);
     
});
}

@HostListener('window:resize', ['$event'])
getScreenSize(event?) {
  var scrWidth = window.innerWidth;
  //In Small screen make grid 2 colmns
  if(scrWidth < 640){
    if($(".equalspacing:visible").length>0){
    $('.equalspacing').css('width', '98%');
    $(".container1").shapeshift({
      columns:1,
      animated:false,
      align:'left'
    });
  }
  
  if($('#sidebar').hasClass('active')){
    $('#monitorBtns').removeClass('displayNone');
  }else{
    $('#monitorBtns').addClass('displayNone');  
  }


  }else if(scrWidth < 990){
    if($(".equalspacing:visible").length>0){
    $('.equalspacing').css('width', '50%');
    $(".container1").shapeshift({
      columns:2,
      animated:false,
      align:'left'
    });
  }
  }else{
    
    if($(".equalspacing:visible").length>0){
    $('.equalspacing').css('width', '31.7%');
    $(".container1").shapeshift({
      columns:3,
      animated:false,
      align:'left'
    });
  }
  }
  // this.fnWindowresize();
  // $(".container1").trigger("ss-rearrange"); 
     
}


selectedContainer : any = "";
showAccordingly(nav){
 this.selectedContainer = nav;
}

// Drag and Drop from tree view to custom view starts here

  drop123(event) {
   // console.log(event);

   var scrWidth = window.innerWidth;
   if(scrWidth < 650){
    $('#sidebar, #content').toggleClass('active');
   }

    let sourcetableData = (event.container.id === "table1") ? this.table1Data : (event.container.id === "table2") ? this.table2Data : this.table3Data;
    if(event.container.id === event.previousContainer.id) {
      // changing in the same container
      moveItemInArray(sourcetableData, event.previousIndex, event.currentIndex);
    } else {
      let itemTable = event.container.id;
      let itemName = event.item.element.nativeElement.innerText;
      let itemIndex = event.item.element.nativeElement.dataset.itemIndex;
      let itemPName = event.item.element.nativeElement.dataset.itemPname;
      let itemUnit = event.item.element.nativeElement.dataset.itemUnit;
      
      var tableId;    
      if (itemTable == "table1"){
        tableId = 0;
      }else if(itemTable == "table2"){
        tableId = 1;
      }else{
        tableId = 2; 
      }
      let itemData = {
        "index": itemIndex,
        "pName": itemPName,
        "name": itemName,
        "unit":itemUnit
      };

      if(!this.checkDuplicate(itemData,sourcetableData)){
        sourcetableData.push(itemData);
        this.btnFlag = false;
       
        this.customWorkspace.push(tableId + "#"+ itemIndex);
        this.data.setCustomWorkSpace(this.customWorkspace);
        this.checkToShowHidetable();
      } else {
        if(itemTable == 'table1'){
          this.tableErrorName = itemData.name;
          this.tableError = true;

        }else if(itemTable == 'table2'){
          this.tableErrorName = itemData.name;
          this.tableError = true;
        } else if(itemTable == 'table3'){
          this.tableErrorName = itemData.name;
          this.tableError = true;
        }
        setTimeout(() => {
          this.tableError = false;
          this.tableErrorName = "";
        }, 2000);
      }
      // var command = this.AddToCustomViewList.replace("#id",itemIndex)
      var  command = '{"Command" : "AddToCustomViewList","Args":'+'"'+itemIndex+'"'+'}'
      this.SocketService.sendMessage(command);
      this.btnFlag = false;
    }
    
  }
  checkToShowHidetable(){
    let t1 = document.getElementById("table1");
    let t2 = document.getElementById("table2");
    let t3 = document.getElementById("table3");
    if(this.table1Data.length > 0){
      t1.classList.remove("table1ShowHide");
      this.showHidden1table  = false;
    }else {
      t1.classList.add("table1ShowHide");
      this.showHidden1table  = true;
    }
    if(this.table2Data.length > 0){
      t2.classList.remove("table2ShowHide");
      this.showHidden2table  = false;
    }else {
      t2.classList.add("table2ShowHide");
      this.showHidden2table  = true;
    }
    if(this.table3Data.length > 0){
      t3.classList.remove("table3ShowHide");
      this.showHidden3table  = false;
    }else {
      t3.classList.add("table3ShowHide");
      this.showHidden3table  = true;
    }
  }
  checkDuplicate(item,tableData){
    //console.log(item);
    return tableData.some((i) => i.index == item.index);
  }
// Drag and Drop from tree view to custom view starts here


// Removing from the list in custom view strats here
  deleteList(index,table){
    var paramInd = 0;
    var tableId = 0;
    if(table == 'table1'){
      paramInd=this.table1Data[index].index;
      tableId = 0;
      this.table1Data.splice(index, 1);
    }else if(table == 'table2'){
      paramInd=this.table2Data[index].index;
      tableId = 1;
      this.table2Data.splice(index, 1);
    }else{
      paramInd=this.table3Data[index].index;
      tableId = 2;
      this.table3Data.splice(index, 1);
    }
    var ind = this.customWorkspace.indexOf(tableId + "#"+ paramInd);    // <-- Not supported in <IE9
    if (ind !== -1) {
      this.customWorkspace.splice(ind, 1);
    }
    this.data.setCustomWorkSpace(this.customWorkspace);
    var  command = '{"Command" : "RemoveFromCustomViewList","Args":'+'"'+paramInd+'"'+'}'
    this.SocketService.sendMessage(command);
    // this.SocketService.sendMessage('RemoveFromCustomViewList('+paramInd+')');
    this.checkToShowHidetable();

    var count = $('#sidebar input[type="checkbox"]:checked').length;
    if(count == 0){
      if(this.table1Data.length == 0 && this.table2Data.length == 0 && this.table3Data.length == 0){
        this.btnFlag = true;
      }
    }

  }

  // Removing from the list in custom view ends here
  // Setting tab value to controll minimize function starts here
  setTab(val){
    if(val == 'grid'){
      this.tblcount = $('.tablegrid');
      var len = this.tblcount.length;
      for(var i = 0; i<len; i++){ 
        if(this.tblcount[i].children[1].children.length == 0){
          $(this.tblcount[i]).parents('.equalspacing').hide();
          $(".container1").trigger("ss-rearrange");
        }else{
          $(this.tblcount[i]).parents('.equalspacing').show();
          $(".container1").trigger("ss-rearrange");
        }
      }
       $('#minimizeFoot').show();
       var command = '{"Command" : "MonitorView"}'
       this.SocketService.sendMessage(command);
      // this.SocketService.sendMessage("MonitorView()");
    }else{
      
       $('#minimizeFoot').hide(); 
       this.fnWindowresize();
       if(val == 'custom') {
        var command = '{"Command" : "CustomView"}'
        this.SocketService.sendMessage(command);
        // this.SocketService.sendMessage("CustomView()");
       }else{
        var monitorViewCommand = '{"Command" : "MonitorView"}'
        this.SocketService.sendMessage(monitorViewCommand);
        // this.SocketService.sendMessage("MonitorView()");
       }
     

    }

    
  }
  // Setting tab value to controll minimize function ends here

  // Minimize and maximize function start here

  minimizeTable(tableName,parentId,ChildId){
    var element = document.createElement("div");
    element.id="minimizedElement"+parentId+ChildId;
    element.style.cssText = "display: inline-block;cursor: pointer;background-color: #005eb7;margin-left: 5px !important;color: white;margin-top: 4px;border-radius: 2px;padding-left: 2px;"
    element.setAttribute('class', "helloWrold");
    element.setAttribute('class', tableName);
    element.innerHTML = tableName+'&nbsp;'+'<i class="fa fa-window-maximize" aria-hidden="true"></i>' +'&nbsp;';
    element.addEventListener("click",()=>{this.maximizeTable(tableName)},true);
    // Creating div tag ends here
    document.getElementById('maximizeDiv').appendChild(element);
    document.getElementById(tableName).style.display = "none";
    this.fnWindowresize();
  }

  maximizeTable(table){
    document.getElementById(table).style.display = "block";
    var tblnode = document.getElementsByClassName(table)[0];
    tblnode.parentNode.removeChild(tblnode);
    this.fnWindowresize();
  }

  // Minimize and maximize function ends here

// startMonitorResponse :any = this.DataService.getStartmonitorData();
//  startMonitorResponseHandler : any = this.startMonitorResponse.Data;

// onClickMe() {
//   for(let i=0;i<=this.startMonitorResponseHandler.length-1;i++){
//      let key = this.startMonitorResponseHandler[i].key;
//      let value = this.startMonitorResponseHandler[i].Value;
//      let classToAppend = "monitorValue"+key;
//     $("."+classToAppend).html(value);
//   }
//  }

   //Start Monitor and Loggin starts
   monitorstatus: boolean = true;
   startMonitorClick(){
     if(this.monitorstatus){
      this.starmonitorflag++;
      var command = '{"Command" : "StartMonitor"}'
      this.SocketService.sendMessage(command);
      // this.SocketService.sendMessage("StartMonitor()");
     }else{
      this.starmonitorflag = 0;
      var stopMonitorCommand = '{"Command" : "StopMonitor"}'
      this.SocketService.sendMessage(stopMonitorCommand);
      // this.SocketService.sendMessage("StopMonitor()");
     } 
   }


 
   loggingstatus: boolean = true;
   startLoggingClick(){
    //  this.loggingstatus = !this.loggingstatus;  
     if(this.loggingstatus){
      var command = '{"Command" : "GetLogHeader"}'
      this.SocketService.sendMessage(command);
      //this.SocketService.sendMessage("GetLogHeader()");
     }else{
      var stopLoggingCommand = '{"Command" : "StopLogging"}'
      this.SocketService.sendMessage(stopLoggingCommand);
      //this.SocketService.sendMessage("StopLogging()");
     } 
   }
 
   onLinkClick(event) {
    // console.log({ event });

    this.tblcount = $('.tablegrid');
      var len = this.tblcount.length;
      for(var i = 0; i<len; i++){ 
        if(this.tblcount[i].children[1].children.length == 0){
          $(this.tblcount[i]).parents('.equalspacing').hide();
          $(".container1").trigger("ss-rearrange");
        }else{
          $(this.tblcount[i]).parents('.equalspacing').show();
          $(".container1").trigger("ss-rearrange");
        }
      }
      $('#controltable tbody tr:visible:odd').addClass('even');
      $('#controltable tbody tr:visible:even').addClass('odd');
     
   
    if(event.index == 1){
      this.fnWindowresize();
      if(this.monitorstatus){
        $('.naCommonClass').html('NA');
      }
    }
  }

  loadCustomWorkspace(response){
    this.table1Data = [];
    this.table2Data = [];
    this.table3Data = [] ;
    this.customWorkspace = []; 

    var loadCustomViewResponse = response;
    var loadCustomViewResponseLength = response.length;
    
    var t1 = document.getElementById("table1");
    var t2 = document.getElementById("table2");
    var t3 = document.getElementById("table3");

  setTimeout(()=>{ 
    for(let i=0; i<=loadCustomViewResponseLength -1; i++){
      var tableUiD = loadCustomViewResponse[i].value;
      var firstRowClass = 'listViewFirstRow'+tableUiD;
      var secondRowClass = 'listViewSecondRow'+tableUiD;
      var parentValue = $("."+firstRowClass).html();
      var childElementValue = $("."+secondRowClass).html();
      var SplitValue = childElementValue.split("(");
      if(SplitValue.length > 1){
        var childValue = SplitValue[0];
        var unitValue = "("+SplitValue[1];
      }else{
        var childValue = SplitValue[0];
        var unitValue = "";
      }

      let itemData = {
        "index": tableUiD,
        "pName": parentValue,
        "name": childValue,
        "unit": unitValue
      };
      if(loadCustomViewResponse[i].key == 0){
        this.table1Data.push(itemData);
        t1.classList.remove("table1ShowHide");
        this.showHidden1table = false;
        this.loadCustomViewtableId = 0;
      }else if(loadCustomViewResponse[i].key == 1){
        this.table2Data.push(itemData);
        t2.classList.remove("table2ShowHide");
        this.showHidden2table = false;
        this.loadCustomViewtableId = 1;
      }else{
        this.table3Data.push(itemData);
        t3.classList.remove("table3ShowHide");
        this.showHidden3table = false;
        this.loadCustomViewtableId = 2;
      }
      this.customWorkspace.push(this.loadCustomViewtableId + "#"+tableUiD);
      this.data.setCustomWorkSpace(this.customWorkspace);
    }
  },300);
}


closeMonitorLogginModal(){
  this.showMonitorLogginModal = false;
  if (this.showHideStartLoggingCheckBoxStatus == true) {
    var command = '{"Command" : "DisableWarnings","Args":"monitor"}'
    this.SocketService.sendMessage(command);
  } else {
    this.showMonitorLogginModal = false;
  }
}

childCheck(superparentObj,parentObj,subparent,childObj) {
  //SUBPARENT OBJ
   subparent.isSelected = childObj.every(function (itemChild: any) {
            return itemChild.isSelected == true;
   });

   //PARENT OBJECT
   parentObj.isSelected = parentObj.Treelist.every(function (itemChild: any) {
      return itemChild.isSelected == true;
   });


   //SET VALUE FOR
   setTimeout(function(){
    superparentObj.isSelected = superparentObj.Treelist.every(function(itemChild: any){
      return itemChild.isSelected == true;

    }) 

   },500);
  }
}


