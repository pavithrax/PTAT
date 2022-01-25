import { Component, ViewChild, OnInit } from '@angular/core';
import { headersToString } from 'selenium-webdriver/http';
//import * as $ from 'jquery';
declare let $: any;
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import { HostListener } from "@angular/core";
import { MatSidenav } from '@angular/material/sidenav';
import * as  data from './getWorkload.json';
import { AppComponent } from '../app.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workload',
  templateUrl: './workload.component.html',
  styleUrls: ['./workload.component.css']
})
export class WorkloadComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  //@ViewChild(HelloComponent, {static: false}) hello: HelloComponent;
  // dataArr:any;
  selectedWorkLoadName = '';
  dropOrCheckBooleanValue = '';
  workloadArray: any;
  workloadArray1: any;
  workloadArrtibut: string = "workload";
  workLoadName: string;
  selectedLevel;
  hasClass: any = true;
  response: any;
  currentStartStopButtonClass: any;
  g_GfxDialogId: any = [];
  workLoadDataArray = [];
  zindex: boolean = true;
  dataType = '';
  threadArray = { data: [], isSelected: false };
  selectedThread;
  core: any = {}
  cpuName: string;
  val: any = []
  cpuvalues: any = [];
  memvalues: any = [];
  pmemvalues: any = [];
  coreValue: any = [];
  showWorkloadModal: boolean = false;
  startWorkloadErrorMsg = '';

  constructor(private SocketService: SocketService, private spinner: NgxSpinnerService, private app: AppComponent, private toaster: ToastrService) {
    this.dataType = this.app.platform;
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.scrollTop == 0) {
      this.zindex = true;
    } else {
      this.zindex = false;
    }
  }
  enableIndex() {
    this.zindex = true;
  }
  ngOnInit() {
    this.dataType = this.app.platform;

    this.SocketService.WorkLoadDataRes().subscribe(message => {
      if (message) {
        this.startWorkloadErrorMsg = '';
        // this.toaster.error('Hello world!', 'Toastr fun!');
        this.StopGfxWorkload("");
        this.workloadArray = message.Data;

        var firstWorkloadName = this.workloadArray[0].DropDownList[0].Name;
        this.dropOrCheckBooleanValue = '00' + ';' + firstWorkloadName;
        setTimeout(() => {
          this.workLoadTree('00' + ';' + firstWorkloadName);
          this.spinner.hide();
        }, 5);


        this.workloadArray.forEach(element => {
          element.DropDownList.forEach(element1 => {
            let element2 = element1.TableData.Row;
            element2.PackageData = this.iterator(element2.PackageStart.split(" ")[0], element2.PackageCount);
            if(element2.stepping) {
              element2.levels = this.range(element2.min, element2.max, element2.stepping);
              element2.DropDownList = [];
            } else {
              
              element2.levels = element2.DropDownList;
             
            }
            console.log(element2);
            
            if (element2.CoreStart) {
              element2.CoreData = this.iterator(element2.CoreStart.split(" ")[0], element2.CoreCount);
              if (element2.ThreadCount && element2.ThreadStart) {
                element2.ThreadData = this.iterator(element2.ThreadStart.split(" ")[0], element2.ThreadCount);
              }
              element2.PackageData.forEach(element3 => {
                element3.CoreAllSelected = true;
                element3.CoreData = this.iterator(element2.CoreStart.split(" ")[0], element2.CoreCount);
              });
            }

            
          });
        });

      }

    });

    // this.SocketService.StartWorkloadRes().subscribe(message => {
    //   console.log(message);
      
    //   if (message) {

    //     // if($('.'+"workLoadSetButton"+this.currentStartStopButtonClass).text().toLowerCase() == "start"){
    //     //   $('.'+"workLoadSetButton"+this.currentStartStopButtonClass).html("Stop");
    //     //   $('.'+"workLoadSetButton"+this.currentStartStopButtonClass).removeClass("tatButtonColour");
    //     //   $('.'+"workLoadSetButton"+this.currentStartStopButtonClass).addClass('btn-danger');
    //     // }  

    //     this.response = message;
    //     //var dummy = '{"Command":"StartWorkload","CommandStatus":{"Status":"Success","Message":""},"Data":{"Component":{"Name":"CPU Component","Index":"0"},
    //     //var dummyJSON = JSON.parse(dummy);
    //     //this.response = dummyJSON;
    //     // console.log(message);
    //     var tempData = this.response.Data;
    //     let parIndex = tempData.Component.Index;
    //     let childIndex = tempData.DropDownData.Index;
    //     let instanceIndex = tempData.Instance.Index;
    //     let instanceStatus = tempData.Instance.Status;
    //     let disableIndex = tempData.Instance.DisableList;
    //     let count = tempData.Instance.Count;
    //     let gfxFileName = tempData.Instance.Filename;
    //     let gfxArguments = tempData.Instance.Arguments;
    //     //let currentValue = "workLoadTableFourthColumn"+parIndex+childIndex+instanceIndex;

    //     if (instanceStatus.toLowerCase() == "running" || instanceStatus.toLowerCase() == "uiaction") {
    //       if ($('.' + "workLoadSetButton" + this.currentStartStopButtonClass).text().toLowerCase() == "start") {
    //         $('.' + "workLoadSetButton" + this.currentStartStopButtonClass).html("Stop");
    //         $('.' + "workLoadSetButton" + this.currentStartStopButtonClass).removeClass("greenBtnColor");
    //         $('.' + "workLoadSetButton" + this.currentStartStopButtonClass).addClass('redBtnColor');
    //       }


    //       if (count != undefined) {
    //         instanceStatus = "Running";
    //         gfxFileName = "assets//" + gfxFileName;
    //         var filename = [];
    //         var args = [];
    //         var workloadCount = 0;

    //         filename[workloadCount] = gfxFileName;

    //         args[workloadCount] = gfxArguments;

    //         var gfxDivId = "divGfx" + workloadCount + "_" + parIndex + childIndex + instanceIndex;
    //         var gfxFrameId = "frameGfx" + workloadCount + "_" + parIndex + childIndex + instanceIndex;

    //         var filepath = filename[workloadCount] + '?str=' + args[workloadCount];

    //         var gfxContainerDiv = document.createElement('div');
    //         gfxContainerDiv.setAttribute('id', gfxDivId);
    //         gfxContainerDiv.setAttribute('class', "gfxDivStyle");

    //         var gfxContainerFrame = document.createElement('iframe');
    //         gfxContainerFrame.setAttribute('id', gfxFrameId);
    //         gfxContainerFrame.setAttribute('class', "gfxFrameStyle");

    //         var body = document.getElementById("pageBody");
    //         body.appendChild(gfxContainerDiv);
    //         gfxContainerDiv.appendChild(gfxContainerFrame);
    //         gfxContainerDiv.setAttribute('title', "GFX Workload");
    //         this.launchGfxWorkload(filepath, gfxDivId, gfxFrameId);
    //         this.g_GfxDialogId.push(gfxDivId);
    //       }
    //     }


    //     this.workloadArray[parIndex].DropDownList[childIndex].TableData.Row[instanceIndex].Status = instanceStatus;
    //     if (instanceStatus.toLowerCase() == "failed") {
    //       return false;
    //     }
    //     if (disableIndex == undefined || disableIndex == null) {
    //       return false;
    //     }
    //     var disableArray = disableIndex.split(',');
    //     var len = disableArray.length;
    //     for (let i = 0; i < len; i++) {
    //       var tableClass = 'workLoadTableRow' + parIndex + childIndex + disableArray[i];
    //       $('.' + tableClass).find("button").attr("disabled", "disabled");
    //     }

    //   }
    // });

    this.SocketService.StartWorkloadRes().subscribe(message => {
      if(message) {
        this.spinner.hide();
        if(message.CommandStatus.Status !== 'error') {
          this.startWorkloadErrorMsg = '';
          $('.startstopworkload').html('Stop Workload');
          $('.startstopworkload').removeClass("greenBtnColor");
          $('.startstopworkload').addClass('redBtnColor');
          this.workLoadDataArray.forEach(item => {
            if(item.Name == message.Data.params['core-test'] && item.editIndex == message.Data.params['workload-str']) {
              item.status = 'Running';
              $('.workLoadTable' + item.editIndex.split(";")[0] + ' #addWorkLoadbtn').addClass('disabledbutton');
            }
          })
        } else {
          // this.toaster.error('Hello world!', 'Toastr fun!');
          this.startWorkloadErrorMsg = message.CommandStatus.Message;
        }
        
      }

    })


    // this.SocketService.StopWorkloadRes().subscribe(message => {
    //   if (message) {
    //     // console.log("workload Data Received");
    //     //console.log(message);

    //     if ($('.' + "workLoadSetButton" + this.currentStartStopButtonClass).text().toLowerCase() == "stop") {
    //       $('.' + "workLoadSetButton" + this.currentStartStopButtonClass).html("Start");
    //       $('.' + "workLoadSetButton" + this.currentStartStopButtonClass).removeClass('redBtnColor');
    //       $('.' + "workLoadSetButton" + this.currentStartStopButtonClass).addClass("greenBtnColor");
    //     }

    //     this.response = message;
    //     var tempData = this.response.Data;
    //     let parIndex = tempData.Component.Index;
    //     let childIndex = tempData.DropDownData.Index;
    //     let instanceIndex = tempData.Instance.Index;
    //     let instanceStatus = tempData.Instance.Status;
    //     let disableIndex = tempData.Instance.DisableList;
    //     var gfxDialogIdEndsWith = parIndex + childIndex + instanceIndex;
    //     this.StopGfxWorkload(gfxDialogIdEndsWith);
    //     //  let currentValue = "workLoadTableFourthColumn"+parIndex+childIndex+instanceIndex;
    //     //   if(instanceStatus.toLowerCase() == "running"){
    //     //    $("."+currentValue).addClass('text-success')
    //     //   }else if(instanceStatus.toLowerCase() == "failed"){
    //     //     $("."+currentValue).addClass('text-danger')
    //     //   }else{
    //     //     $("."+currentValue).removeClass('text-danger');
    //     //     $("."+currentValue).removeClass('text-success');
    //     //   }
    //     //     $("."+currentValue).html(instanceStatus);
    //     this.workloadArray[parIndex].DropDownList[childIndex].TableData.Row[instanceIndex].Status = instanceStatus;

    //     if (disableIndex == undefined || disableIndex == null) {
    //       return false;
    //     }

    //     var disableArray = disableIndex.split(',');
    //     for (let i = 0; i < disableArray.length; i++) {
    //       var tableClass = 'workLoadTableRow' + parIndex + childIndex + disableArray[i];
    //       $('.' + tableClass).find("button").removeAttr("disabled");
    //     }
    //   }
    // });

    this.SocketService.StopWorkloadRes().subscribe(message => {
      if(message) {
        this.spinner.hide();
        this.startWorkloadErrorMsg = '';
        this.workLoadDataArray.forEach(item => {
          if(item.Name == message.Data.params['core-test'] && item.editIndex == message.Data.params['workload-str']) {
            item.status = 'Stopped';
            $('.workLoadTable' + item.editIndex.split(";")[0] + ' #addWorkLoadbtn').removeClass('disabledbutton');
          }
        });
        let count = this.workLoadDataArray.filter(item => item.status == 'Running');
        if (count.length == 0) {
          $('.startstopworkload').html('Start Workload');
          $('.startstopworkload').addClass("greenBtnColor");
          $('.startstopworkload').removeClass('redBtnColor');
        }
      }else {
        this.startWorkloadErrorMsg = message.CommandStatus.Message;
      }
    })
  }


  ngAfterViewInit() {

  }

  //disableGroup(curid,item){

  // if(item.ButtonName == "Start"){
  //     item.disable=true;
  //     item.Status = "Running";
  //     item.ButtonName ="Stop";
  // }else{
  //     item.disable=false;
  //     item.Status = "Stopped";
  //     item.ButtonName ="Start";
  // }


  // var response1 = {
  //     "Command": "StartWorkload",
  //     "CommandStatus": {
  //     "Status": "success",
  //     "Message": "success message"
  //     },
  //     "Data": {"Component":{"Name":"CPU Component","Index":"0"},
  //     "DropDownData":{"Name":"CPU Power", "Index":"0"},
  //     "Instance":{"Name":"CPU0" ,"Index":"0","Status":"Running","DisableList":"1,3,0"}
  //     }  
  //     }

  //     this.SocketService.StartWorkloadRes().subscribe(message => {
  //       if (message) {
  //        console.log("StartWorkload Data Received");
  //        console.log(message);
  //        console.log(message.Data);
  //        this.response = message;
  //        var tempData     = this.response.Data;
  //        let parIndex     = tempData.Component.Index;
  //        let childIndex   = tempData.DropDownData.Index;
  //        let disableIndex = tempData.Instance.DisableList;
  //        var disableArray = disableIndex.split(',');

  //        for(let i = 0; i<disableArray.length; i++){
  //         var tableClass = 'workLoadTableRow'+parIndex+childIndex+disableArray[i];
  //         if($('.'+tableClass).find("button").text()=="Stop"){
  //         $('.'+tableClass).find("button").attr("disabled", "disabled");
  //         }else{
  //           $('.'+tableClass).find("button").removeAttr("disabled");
  //         }
  //       }

  //       }
  //     });


  //       var tempData     = this.response.Data;
  //       let parIndex     = tempData.Component.Index;
  //       let childIndex   = tempData.DropDownData.Index;
  //       let disableIndex = tempData.Instance.DisableList;
  //       var disableArray = disableIndex.split(',');

  //       setTimeout(function(){
  //         for(let i = 0; i<disableArray.length; i++){
  //           var tableClass = 'workLoadTableRow'+parIndex+childIndex+disableArray[i];
  //           if($('.'+tableClass).find("button").text()=="Stop"){
  //           $('.'+tableClass).find("button").attr("disabled", "disabled");
  //           }else{
  //             $('.'+tableClass).find("button").removeAttr("disabled");
  //           }
  //         }
  //       },100)
  //}


  expandCollapse(item) {
    item.expand = !item.expand;
  }


  //  fnToggle(){
  //   $('#sidebar1, #content1').toggleClass('active');

  //   if($('#sidebar').hasClass('active')){
  //     this.hasclass= true;
  //   }else{
  //     this.hasclass= false;
  //   }
  // }

  stringify(obj) {
    return JSON.stringify(obj);
  }
  workLoadTree(responce) {
    this.dropOrCheckBooleanValue = responce;
    this.toggleStatus();
    var splitResponce = responce.split(";");
    var workLoadId = splitResponce[0];
    var firstItemName = splitResponce[1];
    this.workLoadName = firstItemName
    let workLoadTable = "workLoadTable" + workLoadId;
    let workLoadTableCheckBox = "workLoadTableCheckBox" + workLoadId;
    let workLoadTree = "workloadTree" + workLoadId;
    $('.workLoadTableCC').addClass('hide');
    $('.workLoadTreeCC').removeClass('colorSelectedTree')
    $("." + workLoadTree).addClass('colorSelectedTree');
    $("." + workLoadTable).removeClass('hide');
    $("." + workLoadTableCheckBox).removeClass('hide');
    $(".workLoadTableDropdown" + workLoadId).removeClass('hide');
    $('.cpuTree').removeClass('colorSelectedTree1');

    let checkValue;

    this.workloadArray.forEach(element => {
      element.DropDownList.forEach(element1 => {
        if (element1.Name == this.dropOrCheckBooleanValue.split(";")[1]) {
          checkValue = element1;
          if (element1.TableData.Row.PackageData) {
            this.core = element1.TableData.Row.PackageData[0];
          }
          // if(element1.TableData.Row.levels.length == 1) { 
          //   $('.powerLevel').addClass("disabledbutton");
          // } else {
          //   $('.powerLevel').removeClass("disabledbutton");
          // }
          

        }
      });
    });
    if (!checkValue.TableData.Row.ThreadStart) {
      $('.' + workLoadTableCheckBox + " #threadSelection").hide();
    }
    let workLoadTableDropdown = "workLoadTableDropdown" + workLoadId;
    if (checkValue.Note !== '' || !(checkValue.TableData.Row.PackageData)) {
      // $('.' + workLoadTableCheckBox).hide();
      // $('.' + workLoadTableDropdown).hide();
    }

    if (this.core) {
      let cpuClicked = "cpuClicked" + workLoadId + this.core.Index;
      $("." + cpuClicked).addClass('colorSelectedTree1');
    }

  }

  // not used to be removed later ----> saved for the future reference
  workLoadStartStop(arg, arg1, arg2, arg3, arg4, arg5) {
    this.spinner.show();
    this.currentStartStopButtonClass = "";
    let componentName = arg2;
    let componentIndex = arg3;
    let controlName = arg4;
    let controlIndex = arg5;
    let buttonValue = arg1.ButtonName;
    let rowIndex = arg1.Index;
    let currentRowName = arg1.Name;

    if (arg === "slider") {
      let siderselectedValue = arg1.slider;
      let sliderminVal = arg1.min;
      let sliderStepping = arg1.stepping;
      var sliderValToBackend = (siderselectedValue - sliderminVal) / sliderStepping;
      if (sliderValToBackend !== sliderValToBackend) {
        sliderValToBackend = 0;
      }
      // var command :any = "";

      this.currentStartStopButtonClass = componentIndex + controlIndex + rowIndex;
      if ($('.' + "workLoadSetButton" + this.currentStartStopButtonClass).text().toLowerCase() == "start") {
        // command = this.cmdStartWorkload;
        // command = command.replace("#componentName", componentName).replace("#componentIndex", componentIndex).replace("#controlName", controlName).replace("#controlIndex", controlIndex).replace("#instanceName", currentRowName).replace("#instanceIndex", rowIndex).replace("#newvalue", sliderValToBackend);
        var startWorkLoadCommand = '{"Command" : "StartWorkload","Args":' + '"' + componentName + "," + componentIndex + "," + controlName + "," + controlIndex + "," + currentRowName + "," + rowIndex + "," + sliderValToBackend + '"' + '}'
        this.SocketService.sendMessage(startWorkLoadCommand);
      } else {
        // command = this.cmdStopWorkload;
        // command = command.replace("#componentName", componentName).replace("#componentIndex", componentIndex).replace("#controlName", controlName).replace("#controlIndex", controlIndex).replace("#instanceName", currentRowName).replace("#instanceIndex", rowIndex).replace("#newvalue", sliderValToBackend);
        var stopWorkLoadCommand = '{"Command" : "StopWorkload","Args":' + '"' + componentName + "," + componentIndex + "," + controlName + "," + controlIndex + "," + currentRowName + "," + rowIndex + "," + sliderValToBackend + '"' + '}'
        this.SocketService.sendMessage(stopWorkLoadCommand);
      }

    } else if (arg === "dropdown") {
      var receivedRowReferance = arg1.split(':');
      var currentRowIndex = receivedRowReferance[1];
      var rowReferance = receivedRowReferance[0] + receivedRowReferance[1];
      this.currentStartStopButtonClass = receivedRowReferance[0] + receivedRowReferance[1];
      var currentSelectedRowName = $('.workLoadTableFirstRow' + rowReferance).html()
      let dropdownBtnVal = $('.workLoadTableButton' + rowReferance).val();
      let dropdownChildren = $('.workLoadTableButton' + rowReferance)[0].children;
      var dropDownIndex: any = "";

      for (let i = 0; i < dropdownChildren.length; i++) {
        if (dropdownChildren[i].value == dropdownBtnVal) {
          dropDownIndex = i
        }
      }


      if ($('.' + "workLoadSetButton" + this.currentStartStopButtonClass).text().toLowerCase() == "start") {
        // command = this.cmdStartWorkload;
        // command = command.replace("#componentName", componentName).replace("#componentIndex", componentIndex).replace("#controlName", controlName).replace("#controlIndex", controlIndex).replace("#instanceName", currentSelectedRowName).replace("#instanceIndex", currentRowIndex).replace("#newvalue", dropDownIndex);
        var startWorLoadCommand = '{"Command" : "StartWorkload","Args":' + '"' + componentName + "," + componentIndex + "," + controlName + "," + controlIndex + "," + currentSelectedRowName + "," + currentRowIndex + "," + dropDownIndex + '"' + '}'
        this.SocketService.sendMessage(startWorLoadCommand);
      } else {
        // command = this.cmdStopWorkload;
        // command = command.replace("#componentName", componentName).replace("#componentIndex", componentIndex).replace("#controlName", controlName).replace("#controlIndex", controlIndex).replace("#instanceName", currentSelectedRowName).replace("#instanceIndex", currentRowIndex).replace("#newvalue", dropDownIndex);
        var stopWorLoadCommand = '{"Command" : "StopWorkload","Args":' + '"' + componentName + "," + componentIndex + "," + controlName + "," + controlIndex + "," + currentSelectedRowName + "," + currentRowIndex + "," + dropDownIndex + '"' + '}'
        this.SocketService.sendMessage(stopWorLoadCommand);
      }



    }

  }

  toggleIcon() {
    this.hasClass = !this.hasClass;
  }
  launchGfxWorkload(filepath, divid, frameid) { // used only on platforms that is not windows 
    $("#" + frameid).attr('src', filepath);
    $("#" + frameid).css({ 'height': '98%', 'width': '100px', 'border': 'none' });
    $("#" + divid).dialog({
      width: 150,
      height: 470,
      overflow: "hidden",
      modal: false,
      dialogClass: "no-close",
      closeOnEscape: false,
      close: function () {
        $("#" + frameid).attr('src', "about:blank");
      }
    });
    $("#" + divid).css('z-index:10000');
    $(".ui-dialog-titlebar-close").hide();
    return false;
  }

  StopGfxWorkload(gfxDialogIdEndsWith) { // used only on platforms that is not windows 
    var gfxDlgLen = this.g_GfxDialogId.length;
    for (var i = 0; i < gfxDlgLen; i++) {
      var strId = "";
      strId = this.g_GfxDialogId[i] + "";
      var result = strId.search(gfxDialogIdEndsWith);
      if (result > -1) {
        var gfxDivId = this.g_GfxDialogId[i];
        var gfxFrameId = gfxDivId.replace("frame", "div");
        var div = document.getElementById(gfxDivId);
        $("#" + gfxDivId).dialog('close');
        $('#' + gfxFrameId).empty();
        $("#" + gfxDivId).remove();
        this.g_GfxDialogId.splice(i, 1);
      }
      else {
        i++;
      }
    }
  }

  // selected = 'option2';

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    var scrHeight = window.innerHeight;
    var scrWidth = window.innerWidth;
    if (scrWidth < 700) {
      this.sidenav.close();
      this.hasClass = false;
    }
  }

  toggleStatus() {
    var workLoadId = this.dropOrCheckBooleanValue.split(";")[0];
    let workLoadTableCheckBox = "workLoadTableCheckBox" + workLoadId;
    let workLoadTableDropdown = "workLoadTableDropdown" + workLoadId;
    let checkValue;

    this.workloadArray.forEach(element => {
      element.DropDownList.forEach(element1 => {
        if (element1.Name == this.dropOrCheckBooleanValue.split(";")[1]) {
          checkValue = element1;
        }
      });
    });

    if (!checkValue.TableData.Row.DroporCheck) {
      // $('.' + workLoadTableDropdown).addClass("disabledbutton");
      $('.' + workLoadTableDropdown).find('.card').addClass("disabledbutton");
      $('.' + workLoadTableCheckBox).find('.card').removeClass("disabledbutton");
    } else {
      $('.' + workLoadTableCheckBox).find('.card').addClass("disabledbutton");
      $('.' + workLoadTableDropdown).find('.card').removeClass("disabledbutton");
    }
  }


  checkUncheckAll(event) {

    event.AtleastOnePackageSelected = false;
    event.PackageData.forEach(element => {
      element.isSelected = event.PackageAllSelected;
      element.CoreAllSelected = event.PackageAllSelected;
      element.CoreData.forEach(element => {
        element.isSelected = event.PackageAllSelected;
      });
    });
  }


  isAllSelected(data, d1, d2) {
    let count = 0;

    data.PackageData.forEach(element => {

      if (element.isSelected == true) {
        count += 1;
      }
    });
    if (count == data.PackageData.length) {
      data.PackageAllSelected = true;
    } else {
      data.PackageAllSelected = false;
    }
    if (count == 0 || count == data.PackageData.length) {
      data.AtleastOnePackageSelected = false
    } else {
      data.AtleastOnePackageSelected = true;
    }
    this.cpuClicked(d1, d2)
  }


  selectedAllThreadData(data) {
    data.AtleastOneThreadSelected = false;
    data.ThreadData.forEach(element => {
      element.isSelected = data.SelectAllThread
    });
  }
  selectedThreadData(data) {
    let count = 0;
    data.ThreadData.forEach(element => {

      if (element.isSelected == true) {
        count += 1;
      }
    });
    if (count == data.ThreadData.length) {
      data.SelectAllThread = true;
    } else {
      data.SelectAllThread = false;
    }

    if (count == 0 || count == data.ThreadData.length) {
      data.AtleastOneThreadSelected = false;
    } else {
      data.AtleastOneThreadSelected = true;
    }
  }

  cpuClicked(cpudata, maindata) {
    this.core = cpudata;
    var splitResponse1 = maindata.split(';')
    var cpuId = splitResponse1[0];
    let cpuClicked = "cpuClicked" + cpuId;
    $('.cpuTree').removeClass('colorSelectedTree1');
    $("." + cpuClicked).addClass('colorSelectedTree1');


  }
  // iterator to create sequence of package and cores
  iterator(str, count) {
    let arr: any = [];
    for (let i = 0; i < count; i++) {
      arr.push({ Index: i, Name: str + ' ' + i, isSelected: true });
    }
    return arr;
  }

  checkAndUnCheckCore(event) {
    event.AtleastOneCoreSelected = false;
    event.isSelected = event.isSelected;
    event.CoreData.forEach(element => {
      element.isSelected = event.isSelected;
    });
  }



  isAllSelectedCore(data) {
    let count = 0;
    data.CoreData.forEach(element => {
      if (element.isSelected == true) {
        count += 1;
      }
    });
    if (count == data.CoreData.length) {
      data.isSelected = true;
    } else {
      data.isSelected = false;
    }
    if (count === 0 || count == data.CoreData.length) {
      data.AtleastOneCoreSelected = false;
    } else {
      data.AtleastOneCoreSelected = true;
    }

    //to check and uncheck select all package when we check core 
    this.workloadArray.forEach(element => {
      element.DropDownList.forEach(element1 => {
        let data1 = element1.TableData.Row;
        if (data1.PackageData) {
          // this.isAllSelected(element2);        
          let count1 = 0;

          data1.PackageData.forEach(element => {

            if (element.isSelected == true) {
              count1 += 1;
            }
          });
          if (count1 == data1.PackageData.length) {
            data1.PackageAllSelected = true;
          } else {
            data1.PackageAllSelected = false;
          }
          if (count1 == 0 || count1 == data1.PackageData.length) {
            data1.AtleastOnePackageSelected = false
          } else {
            data1.AtleastOnePackageSelected = true;
          }

        }

      });
    });
  }

  cpuCheckboxClicked(cpu) {
    if (cpu.isSelected == true) {
      cpu.CoreData.forEach(element => {
        element.isSelected = false;
      });
      cpu.CoreAllSelected = false;
    } else {
      cpu.CoreData.forEach(element => {
        element.isSelected = true;
      });
      cpu.CoreAllSelected = true;
    }
  }

  startEndCores() {

  }

  //not used to be removed later
  getComboTestValue(cputest) {
    this.pmemvalues = '';
    this.cpuvalues = '';
    this.memvalues = '';
    this.workloadArray.map(element => {
      element.DropDownList.map(element => {
        if (cputest.SelectedCPU == element.Name) {
          element.TableData.Row.PackageData
            .flatMap(data => data.isSelected ? this.cpuvalues += data.Name + ' ' : this.cpuvalues += '')
        } else if (cputest.SelectedMem == element.Name) {
          element.TableData.Row.PackageData
            .flatMap(data => data.isSelected ? this.memvalues += data.Name + ' ' : this.memvalues += '')
        } else if (cputest.SelectedPMem == element.Name) {
          element.TableData.Row.PackageData
            .flatMap(data => data.isSelected ? this.pmemvalues += data.Name + ' ' : this.pmemvalues += '');
        }
      });
    });
  }

  addWorkLoad(data, parentData) {
    let inputData = data.TableData.Row;
    this.startWorkloadErrorMsg = '';
    
    let continueExe = false;
    if(inputData.DroporCheck == false ) {
      if(inputData.AtleastOnePackageSelected || inputData.PackageAllSelected) {
        continueExe = true
      }
      else {
        continueExe = false;
        this.showWorkloadModal = true;
      }
    } else {
      continueExe = true;
    }
    if(inputData.ThreadData && inputData.ThreadData.length > 0 && !inputData.SelectAllThread && !inputData.AtleastOneThreadSelected) {
      this.startWorkloadErrorMsg = 'Atleast one thread should be selected';
      continueExe = false;
    }
    if(continueExe && inputData.powerLevel!= 'select') {
      this.selectedWorkLoadName = '';
      this.disableTest(data.DisableList, 'addClass');
      if (!this.workLoadDataArray.some(item => item.Name === data.Name)) {
        this.workLoadDataArray.push(
          {
            Name: data.Name,
            ParentName: parentData.Name,
            editIndex: parentData.Index + data.Index + ';' + data.Name,
            status: "Stopped",
            DisableList: data.DisableList,
            powerLevel: inputData.powerLevel
          })
      } else {
       this.workLoadDataArray.forEach(element => {
         if(element.Name == data.Name) {
           element.powerLevel = inputData.powerLevel
         }
       })
      }

      this.workLoadDataArray.forEach(element => {
        $('.workLoadTable' + element.editIndex.split(";")[0] + ' #addWorkLoadbtn').text('Update Workload');
      })
    }

  }

  editWorkload(data) {
    this.startWorkloadErrorMsg = '';
    this.selectedWorkLoadName = data.Name;
    this.workLoadTree(data.editIndex);
  }
  removeData(data) {
    this.startWorkloadErrorMsg = '';
    this.selectedWorkLoadName = '';
    $('.workLoadTable' + data.editIndex.split(";")[0] + ' #addWorkLoadbtn').text('Add Workload');
    let arr = this.workLoadDataArray.filter(data1 => data1 !== data);
    this.workLoadDataArray = arr;
    this.disableTest(data.DisableList, 'remove');
  }

  startIndvWorkload(data) {
    this.selectedWorkLoadName = '';
    // data.status = 'Running';
    // $('.startstopworkload').html('Stop Workload');
    // $('.startstopworkload').removeClass("greenBtnColor");
    // $('.startstopworkload').addClass('redBtnColor');

    this.startWorkLoadCmd(data);
    let sendingData: any = {};

    sendingData.cmd = 'StartWorkload';
    
  }

  stopIndvWorkload(data) {
    this.startWorkloadErrorMsg = '';
    this.selectedWorkLoadName = '';
    this.stopWorkloadCmd(data);
    let count = this.workLoadDataArray.filter(item => item.status == 'Running'); // not used
    

    
  }

  // css changes basically
  startAllWorkload() {
    this.startWorkloadErrorMsg = '';
    this.selectedWorkLoadName = '';
    if ($('.startstopworkload').text().toLowerCase() == 'stop workload') {

      
      this.workLoadDataArray.forEach(item => {
        if(item.status == 'Running') {
          this.stopWorkloadCmd(item);
        }
      });

      if (this.startInterval) {
        clearInterval(this.startInterval);
      }
      
    } else {
      this.workLoadDataArray.forEach(item => {
        this.startWorkLoadCmd(item);
      });
    }

  }

  // to disable the treeviewlist when a certain test is added to workload
  disableTest(data, type) {
    if (type == 'addClass') {
      $('.workLoadTreeCC').each(function (index, item) {
        var $item = $(item);
        data.forEach(element => {
          if ($item.text().toLowerCase().replace(/ /g, "") == element.toLowerCase().replace(/ /g, "")) {
            $item.addClass('disabledbutton');
          }
        });
      });
    } else {
      $('.workLoadTreeCC').each(function (index, item) {
        var $item = $(item);
        data.forEach(element => {
          if ($item.text().toLowerCase().replace(/ /g, "") == element.toLowerCase().replace(/ /g, "")) {
            $item.removeClass('disabledbutton');
          }
        });
      });
    }
    this.workLoadDataArray.forEach(element => {
      $('.workLoadTreeCC').each(function (index, item) {
        var $item = $(item);
        if(element.DisableList) {
          element.DisableList.forEach(element1 => {
            if ($item.text().toLowerCase().replace(/ /g, "") == element1.toLowerCase().replace(/ /g, "")) {
              $item.addClass('disabledbutton');
            }
          });
        }
        
      });
    })
  }

  // iterator to create powerlevel
  range(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
      a.push(b += step || 1);
    }
    return a;


  }
  startInterval: any;

  startWorkLoadCmd(data) {
    this.spinner.show();
    this.startWorkloadErrorMsg = '';
    let selectedtest;
    let cmd: any = {}
    cmd.Command = 'StartWorkload';
    let dummyThread = [], packageStart = [], coreStart = [];
    this.workloadArray.forEach(element => {
      if (element.Name == data.ParentName) {
        element.DropDownList.forEach(child => {
          if (child.Name == data.Name) {
            selectedtest = child;
          }
        });
      }
    });
    cmd.params = [];
    let params = {
      "workload": data.ParentName, // CPU ie., parent value
      "core-test": data.Name, // TDP or Core IAsse ie., child
      "pwr-level": 0, // power level
      "pkg-range": [], //  holds selected pkgs from dropdown
      "core-range": [], //  holds selected cores from dropdown
      // 'selectedPkgs': {}, //  holds selcetd pkgs nd core from checkbox
      'selected-threads': [], // holds selcetd threads from checkbox
      'workload-str': data.editIndex
      // 'isDataSelectedFromRange': false
    }

    // for tests like tdp ie., no power level selection
    if (!selectedtest.TableData.Row.CoreCount || !selectedtest.TableData.Row.CoreCount == undefined) {
      params['pwr-level'] = 100
      let testData = selectedtest.TableData.Row
      params['pkg-range'] = this.iterator1(parseInt(testData.PackageStart.replace(/[^\d]/g, '')), parseInt(testData.PackageEnd.replace(/[^\d]/g, '')));
      
      let cmd = '{"Command": "StartWorkload","params":[{"workload":"'+params.workload+ '","core-test":"'+ params['core-test']+ '","pwr-level": 100,"pkg-range":['+params['pkg-range']+'], "core-range": [],"selected-threads": [],"workload-str":"'+ data.editIndex+'"}]}'
      this.SocketService.sendMessage(cmd);

    } else {
      let testData = selectedtest.TableData.Row;
      params['pwr-level'] = testData.powerLevel;
      if(testData.ThreadData) {
        testData.ThreadData.forEach(element => {
          if (element.isSelected) {
            dummyThread.push(parseInt(element.Name.replace(/[^\d]/g, '')))
          }
        });
        params['selected-threads'] = dummyThread;
      }
      

      // dropcheck == true ie., selection is from range(dropdown) else selection is freom checkbox
      if (testData.DroporCheck) {

        params['pkg-range'] = this.iterator1(parseInt(testData.PackageStart.replace(/[^\d]/g, '')), parseInt(testData.PackageEnd.replace(/[^\d]/g, '')));
        params['core-range'] = this.iterator1(parseInt(testData.CoreStart.replace(/[^\d]/g, '')), parseInt(testData.CoreEnd.replace(/[^\d]/g, '')));
        let cmd = '{"Command": "StartWorkload","params":[{"workload":"'+params.workload+ '","core-test":"'+ params['core-test']+ '","pwr-level":'+ params['pwr-level']+',"pkg-range":['+params['pkg-range']+'], "core-range": ['+params['core-range']+'],"selected-threads": ['+params['selected-threads']+'],"workload-str":"'+ data.editIndex+'"}]}'
        this.SocketService.sendMessage(cmd);

      } else {

        let obj = {}
        testData.PackageData.forEach(element => {
          let coreData = element.CoreData.filter(item => item.isSelected);
          if (coreData.length > 0) {
            let arr = [];
            coreData.map(item => arr.push(item.Name))
            obj[element.Name] = arr;
          }
        });
        // to be checked later when they backend is implemented for checkbox
        // console.log(obj);
        // params.selectedPkgs = obj;
      }
      
    }
    cmd.params.push(params); 
    
  }

  stopWorkloadCmd(data) {
    let cmd = '{"Command": "StopWorkload","params": [{"workload": "' +data.ParentName+'","core-test":"'+ data.Name+'","workload-str": "'+data.editIndex+'"}]}'
    this.SocketService.sendMessage(cmd);
    
  }
  closeWorkloadWarningModal() {
    this.showWorkloadModal = false;
  }

  iterator1(start, end) {
    let arr: any = [];
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr;
  }
}





















