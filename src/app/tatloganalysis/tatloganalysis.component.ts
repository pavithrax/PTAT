import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as CanvasJS from '../../assets/canvasjs.min';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-tatloganalysis',
  templateUrl: './tatloganalysis.component.html',
  styleUrls: ['./tatloganalysis.component.css']
})
export class TatloganalysisComponent implements OnInit {
  supportTatLogAnalysis: any = "";
  tatLogAnalysisLog: any;
  tableData: any;
  //tatLogAnalysisDataArray :any = [];
  expanded = false;
  tatLogFilePath: any = "";
  uploadButtonCounter: any = 0;
  tatLogAnalysiLogFile: any;
  currentSelectedTab: any;
  logAnalysisGraphOptionsArray: any = [[], [], []];
  tatLogAnalysiscounter: any = 0;
  tatLogAnalysischart: any;
  tabData: any;
  errorHandling: any;
  showIcon: any = false;
  errorOrResponse: any = 0;
  logFileCount: any = 0;
  osInformation: any = "";
  constructor(private SocketService: SocketService, private spinner: NgxSpinnerService, private FileSaverServiceRef: FileSaverService) {
  }

  stringify(obj) {
    return JSON.stringify(obj);
  }

  ngOnInit() {

    this.SocketService.getToolInfo().subscribe(message => {
      if (message) {
        this.tatLogFilePath = message[7].value;
        var getToolInfoResponse = message;
        var len = getToolInfoResponse.length;
        for (var i = 0; i < len; i++) {
          if (getToolInfoResponse[i].key == 'OSVersion') {
            if (getToolInfoResponse[i].value == "Windows 10 Enterprise") {
              this.osInformation = "windows"
            } else {
              this.osInformation = "others"
            }
          }
        }
      }
    });

    this.SocketService.GetSupportedOfflineAnalysisListStatus().subscribe(message => {
      if (message) {
        if (message.CommandStatus.Status.toLowerCase() == "success") {
          this.supportTatLogAnalysis = message.Data;
          this.spinner.hide();
        }
      }
    });

    this.SocketService.getFilesInDir().subscribe(message => {
      if (message) {
        if (message.CommandStatus.Status.toLowerCase() == "success") {
          if (message.Data.key = "log") {
            this.spinner.hide();
            this.tatLogAnalysisLog = message.Data.List;
            if (message.Data.List.length != 0) {
              this.tatLogAnalysiLogFile = message.Data.List[0].Data;
              this.logFileCount = 1;
            } else {
              this.logFileCount = 0;
            }
          }
        }
      }
    });

    this.SocketService.LoadAnalysisFromFileStatus().subscribe(message => {
      if (message) {
        if (message.CommandStatus.Status.toLowerCase() == "success") {
          var command = '{"Command" : "GetOfflineAnalysisResults"}'
          this.SocketService.sendMessage(command);
          //this.SocketService.sendMessage("GetOfflineAnalysisResults()");
        } else {
          this.showIcon = true;
          this.spinner.hide();
          this.errorHandling = "File not found";
          this.errorOrResponse = 1;
          setTimeout(() => {
            $("#tatLogAnalysisFeatureContainer").addClass("hidden");
            $("#tatLogAnalysisTabContainer").addClass("hidden");
            $("#tatLogAnalysisErrorContainer").removeClass("hidden");
            $("#tatLogAnalsisToggle").removeClass("fa-align-left");
            $("#tatLogAnalsisToggle").addClass("fa-align-right");
          }, 10)
        }
      }
    });

    this.SocketService.GetOfflineAnalysisResultsStatus().subscribe(message => {
      console.log('hello',message);
      
      if (message) {
        if (message.CommandStatus.Status.toLowerCase() == "success") {

          this.logAnalysisGraphOptionsArray[0].length = 0;
          this.logAnalysisGraphOptionsArray[1].length = 0;
          this.logAnalysisGraphOptionsArray[2].length = 0;
          this.tatLogAnalysiscounter = 0;
          this.errorOrResponse = 2;
          this.tableData = message;
          this.sendTatLogGraphCommand(message);
          this.tatLogAnalysisOfflineTableContent(message);
          this.currentSelectedTab = 0;
          this.showIcon = true;
          setTimeout(() => {
            $("#tatLogAnalsisToggle").removeClass("fa-align-left");
            $("#tatLogAnalsisToggle").addClass("fa-align-right");
            $("#tatLogAnalysisFeatureContainer").addClass("hidden");
            $("#tatLogAnalysisTabContainer").removeClass("hidden");
            $("#tatLogAnalysisErrorContainer").addClass("hidden");
          }, 10)
        } else {
          this.showIcon = true;
          this.spinner.hide();
          this.errorHandling = message.CommandStatus.Message;
          this.errorOrResponse = 1;
          setTimeout(() => {
            $("#tatLogAnalysisFeatureContainer").addClass("hidden");
            $("#tatLogAnalysisTabContainer").addClass("hidden");
            $("#tatLogAnalysisErrorContainer").removeClass("hidden");
            $("#tatLogAnalsisToggle").removeClass("fa-align-left");
            $("#tatLogAnalsisToggle").addClass("fa-align-right");
          }, 10)
        }
      }
    });

    this.SocketService.GetTatLogAnalysisGraphDataDataStatus().subscribe(message => {
      if (message) {
        if (message.CommandStatus.Status.toLowerCase() == "success") {
          var receivedIndex = message.Data.index - 1;
          var tabName = message.Data.name
          var graphIndex = "grapContainer" + receivedIndex;
          var tatLogAnalysisDataArray: any = [];
          setTimeout(() => {
            this.tatLogAnalysisGraph(graphIndex, message, receivedIndex, tabName, tatLogAnalysisDataArray);
          }, 2000)
        }

      }
    });

  }


  nonConsolidatedResultTab(event: any, tabIndex, rowIndex) {
    var actualClass = "tatlogAnalysisTableRow" + tabIndex + rowIndex;
    if (event.currentTarget.checked) {
      $('.' + actualClass).show();
    } else {
      $('.' + actualClass).hide();
    }
  }

  consolidatedResultTab(event: any, tabIndex, rowIndex) {
    var firstRowIndex = rowIndex + 1;
    var secondRowIndex = rowIndex + 2;
    var currentRowClass = "tatlogAnalysisTableRow" + tabIndex + rowIndex;
    var firstChildRowClass = "tatlogAnalysisTableRow" + tabIndex + firstRowIndex;
    var secondChildRowClass = "tatlogAnalysisTableRow" + tabIndex + secondRowIndex;

    if (event.currentTarget.checked) {
      $('.' + currentRowClass).show();
      if ($('.' + firstChildRowClass).hasClass('consolidateHeader')) {
      } else {
        $('.' + firstChildRowClass).show();
      }
      if ($('.' + secondChildRowClass).hasClass('consolidateHeader')) {
      } else {
        $('.' + secondChildRowClass).show();
      }
    } else {
      $('.' + currentRowClass).hide();
      if ($('.' + firstChildRowClass).hasClass('consolidateHeader')) {
      } else {
        $('.' + firstChildRowClass).hide();
      }
      if ($('.' + secondChildRowClass).hasClass('consolidateHeader')) {
      } else {
        $('.' + secondChildRowClass).hide();
      }
    }
  }

  // function not called 
  showCheckboxes() {
    var checkboxes = document.getElementById("checkboxes");
    if (!this.expanded) {
      checkboxes.style.display = "none";
      this.expanded = false;
    } else {
      checkboxes.style.display = "block";
      this.expanded = true;
    }
  }

  nonConsolidatedTabDDspilt(data) {
    var actdata = data.join();
    var res = actdata.split(',');
    return res[0];
  }

  consolidatedTabDDspilt(data) {
    var actdata = data.join();
    var res = actdata.split('@');
    return res[0];
  }


  trimdata(data) {
    var res = data.split('@');
    return res[0];
  }

  toggleOfflineAnalysis(arg) {
    const hasClass = arg.target.classList.contains('fa-align-left');
    if (hasClass) {
      $("#tatLogAnalsisToggle").removeClass("fa-align-left");
      $("#tatLogAnalsisToggle").addClass("fa-align-right");

      if (this.errorOrResponse == 1) {
        $("#tatLogAnalysisFeatureContainer").addClass("hidden");
        $("#tatLogAnalysisErrorContainer").removeClass("hidden");
      } else if (this.errorOrResponse == 2) {
        $("#tatLogAnalysisFeatureContainer").addClass("hidden");
        $("#tatLogAnalysisTabContainer").removeClass("hidden");
      } else {

      }
    } else {
      $("#tatLogAnalsisToggle").removeClass("fa-align-right");
      $("#tatLogAnalsisToggle").addClass("fa-align-left");
      if (this.errorOrResponse == 1) {
        $("#tatLogAnalysisFeatureContainer").removeClass("hidden");
        $("#tatLogAnalysisErrorContainer").addClass("hidden");
      } else if (this.errorOrResponse == 2) {
        $("#tatLogAnalysisFeatureContainer").removeClass("hidden");
        $("#tatLogAnalysisTabContainer").addClass("hidden");
      } else {
      }
    }
  }



  uploadLogFile() {
    if (this.uploadButtonCounter == 0) {
      //var GetFilesInDirCommand = "GetFilesInDir("+this.tatLogFilePath+","+"log"+")";
      var path = ""
      if (this.osInformation = "windows") {
        path = this.tatLogFilePath.replace(/\\/g, "\\\\");
      } else {
        path = this.tatLogFilePath.replace(/\\/g, "////");
      }
      var GetFilesInDirCommand = '{"Command" : "GetFilesInDir","params" : {"Args":' + '"' + path + ',log' + '"' + '}}'
      // var GetFilesInDirCommand = '{"Command" : "GetFilesInDir","Args":' + '"' + path + ',log' + '"' + '}'
      this.SocketService.sendMessage(GetFilesInDirCommand);
      this.spinner.show();
    } else {
    }

    this.uploadButtonCounter = this.uploadButtonCounter + 1;
  }


  refreshUploadLogFile() {
    //var GetFilesInDirCommand = "GetFilesInDir("+this.tatLogFilePath+","+"log"+")";
    var path = ""
    if (this.osInformation = "windows") {
      path = this.tatLogFilePath.replace(/\\/g, "\\\\");
    } else {
      path = this.tatLogFilePath.replace(/\\/g, "////");
    }
    var GetFilesInDirCommand = '{"Command" : "GetFilesInDir","params" : {"Args":' + '"' + path + ',log' + '"' + '}}'
    // var GetFilesInDirCommand = '{"Command" : "GetFilesInDir","Args":' + '"' + path + ',log' + '"' + '}'
    this.SocketService.sendMessage(GetFilesInDirCommand);
  }


  submitTatLogAnalysis() {
    this.tableData = "";
    //var loadAnalysisFromFileResponse = "LoadAnalysisFromFile("+this.tatLogFilePath+this.tatLogAnalysiLogFile+")";
    var path = this.tatLogFilePath + this.tatLogAnalysiLogFile
    var finalPath = "";
    if (this.osInformation = "windows") {
      finalPath = path.replace(/\\/g, "\\\\");
    } else {
      finalPath = path.replace(/\\/g, "////");
    }
    var loadAnalysisFromFileResponse = '{"Command" : "LoadAnalysisFromFile","Args":' + '"' + finalPath + '"' + '}'
    this.SocketService.sendMessage(loadAnalysisFromFileResponse);
    this.spinner.show();
  }

  sendTatLogGraphCommand(res) {
    let response = res.Data;
    for (let count = 0; count <= response.length - 1; count++) {
      if (response[count].Type == "graph") {
        var graphCount = count + 1;
        //var graphCommand = "GetTatLogAnalysisGraphData("+graphCount+".json"+")"
        var graphCommand = '{"Command" : "GetTatLogAnalysisGraphData","Args":' + '"' + graphCount + '.json' + '"' + '}'
        this.SocketService.sendMessage(graphCommand);
      } else {
        this.logAnalysisGraphOptionsArray[0][count] = "table";
        this.logAnalysisGraphOptionsArray[1][count] = "table";
        this.logAnalysisGraphOptionsArray[2][count] = "table";
      }
    }
  }


  tatLogAnalysisGraph(graphid, receivedResponse, receivedIndex, tabName, tatLogAnalysisDataArray) {
    let graphResponce = receivedResponse;
    let graphData = graphResponce.Data.graph;
    let graphName = graphResponce.Data.name;
    let graphIndex = graphResponce.Data.index;
    let graphDataLength = graphData.length;

    for (let dataCount = 0; dataCount <= graphDataLength - 1; dataCount++) {
      let tatLogAnalysisdataList = [];
      let individualGraphName = graphData[dataCount].name;
      let graphType = graphData[dataCount].type;
      let individualGraphData = graphData[dataCount].Data;
      let individualGraphDataLength = individualGraphData.length;

      for (let dataListCount = 0; dataListCount <= individualGraphDataLength - 1; dataListCount++) {
        tatLogAnalysisdataList[dataListCount] = { label: "", y: parseFloat(individualGraphData[dataListCount]) };
      }

      tatLogAnalysisDataArray.push({
        type: graphType,
        showInLegend: true,
        markerType: "none",
        markerBorderColor: "white",
        markerBorderThickness: 2,
        name: individualGraphName,
        dataPoints: tatLogAnalysisdataList
      });
    }
    this.plotTATLogAnalysisGraph(graphid, receivedIndex, tabName, tatLogAnalysisDataArray);
  }

  plotTATLogAnalysisGraph(graphid, receivedIndex, tabName, tatLogAnalysisDataArray) {
    var arrayIndex = receivedIndex;
    var graphName = tabName;
    var parentWidth = parseInt($('.tableChartParent').css('width'));
    var parentHeight = parseInt($('.tableChartParent').css('height'));
    var chartWidth = parentWidth - 50;
    var chartHeight = parentHeight - 40;
    this.logAnalysisGraphOptionsArray[2][arrayIndex] = "graph";
    this.logAnalysisGraphOptionsArray[1][arrayIndex] = graphName;
    this.tatLogAnalysischart = "";


    this.logAnalysisGraphOptionsArray[0][arrayIndex] = {
      toolTip: {
        shared: true,
      },
      width: chartWidth,
      height: chartHeight,
      zoomEnabled: true,
      axisY: {
        includeZero: false,
        labelFontSize: 10,
      },
      axisX: {
        labelAngle: 0,
        labelFontSize: 10,
      },
      legend: {
        verticalAlign: "bottom",
        horizontalAlign: "center",
        cursor: "pointer",
        fontSize: 10,
        itemclick: function (e) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }

          e.chart.render();
        }
      },
      data: tatLogAnalysisDataArray
    }
    this.tatLogAnalysischart = new CanvasJS.Chart(graphid, this.logAnalysisGraphOptionsArray[0][arrayIndex]);
    this.tatLogAnalysischart.render();

    setTimeout(() => {
      this.spinner.hide();
    }, 11000)

  }


  tabSelectionChanged(event) {
    let selectedTab = event;
    alert(selectedTab);
  }

  tatLogTabClickIndex(arg) {
    this.currentSelectedTab = arg;
  }


  tatLogAnalysisOfflineTableContent(response) {
    var receivedResponse = response.Data;
    this.tabData = '<body style="overflow: hidden;background: #183544;color: #525252;max-height:100%;font-family:Intel Clear"><div class="tab" style="border-top-left-radius: 7px !important;border-top-right-radius: 7px !important;padding-left: 30px;background-color: #e8e8e8;border-bottom-color: #fff;">';
    var tabBody = "";
    for (let tabCount = 0; tabCount < receivedResponse.length; tabCount++) {
      var graphName = receivedResponse[tabCount].TabName.trim();
      if (tabCount == 0) {
        this.tabData += "<button class='tablinks active' onclick='tatlogtab(event, " + '"' + graphName + '"' + ")'>" + graphName + "</button>";
      } else {
        this.tabData += "<button class='tablinks' onclick='tatlogtab(event, " + '"' + graphName + '"' + ")'>" + graphName + "</button>";
      }
      var grapContainer = "grapContainer";
      if (receivedResponse[tabCount].Type == "table") {
        if (tabCount == 0) {
          tabBody += "<div id='" + graphName + "' class='tabcontent' style='display: block;height: 89%;overflow-y: scroll;background-color: #fff;border-bottom-left-radius: 7px ! important;border-bottom-right-radius: 7px ! important;'>"
        } else {
          tabBody += "<div id='" + graphName + "' class='tabcontent' style='display: none;height: 89%;overflow-y: scroll;background-color: #fff;border-bottom-left-radius: 7px ! important;border-bottom-right-radius: 7px ! important;'>"
        }
        var tableHeaderData = receivedResponse[tabCount].TableData[0].Header;
        var tableBodyData = receivedResponse[tabCount].TableData[0].Row;
        var tableHeaderDataLength = tableHeaderData.length - 1;
        var tableHeaderContend = "";

        tableHeaderContend = "<div style='padding:20px;'><table style='background-color: #fff'><tr>"
        for (let tableHeaderCount = 0; tableHeaderCount < tableHeaderData.length; tableHeaderCount++) {
          // tableHeaderContend += "<th>"+tableHeaderData[tableHeaderCount]+"</th>"  
          if (tableHeaderCount == 0) {
            tableHeaderContend += "<th class='tableLeftRadius'>" + tableHeaderData[tableHeaderCount] + "</th>"
          } else if (tableHeaderCount == tableHeaderDataLength) {
            tableHeaderContend += "<th class='tableRightRadius'>" + tableHeaderData[tableHeaderCount] + "</th>"
          } else {
            tableHeaderContend += "<th>" + tableHeaderData[tableHeaderCount] + "</th>"
          }

        }
        tableHeaderContend += "</tr>"
        var tableBodyContend = "";
        for (let tableBodyCount = 0; tableBodyCount < tableBodyData.length; tableBodyCount++) {
          var childNode = tableBodyData[tableBodyCount];
          if (childNode[1] == "" && childNode[2] == "") {
            var res = childNode[0].split('@');
            childData = res[0];
            if (res[1] == "green") {
              tableBodyContend += "<tr><td colspan='4' class='green'>" + childData + "</tr></td>"
            } else if (res[1] == "red") {
              tableBodyContend += "<tr><td colspan='4' class='red'>" + childData + "</tr></td>"
            } else if (res[1] == "yellow") {
              tableBodyContend += "<tr><td colspan='4' class='yellowColor'>" + childData + "</tr></td>"
            } else if (res[1] == "Bold") {
              tableBodyContend += "<tr><td colspan='4' class='lightgrey'>" + childData + "</tr></td>"
            } else {
              tableBodyContend += "<tr><td colspan='4'>" + childData + "</tr></td>"
            }
          } else {
            tableBodyContend += "<tr>"
            for (let childNodeCount = 0; childNodeCount < childNode.length; childNodeCount++) {
              var childData = "";
              var res = childNode[childNodeCount].split('@');
              childData = res[0];
              if (res[1] == "green") {
                tableBodyContend += "<td class='green'>" + childData + "</td>"
              } else if (res[1] == "red") {
                tableBodyContend += "<td class='red'>" + childData + "</td>"
              } else if (res[1] == "yellow") {
                tableBodyContend += "<td class='yellowColor'>" + childData + "</td>"
              } else if (res[1] == "Bold") {
                tableBodyContend += "<td class='lightgrey'>" + childData + "</td>"
              } else {
                tableBodyContend += "<td>" + childData + "</td>"
              }
            }
            tableBodyContend += "</tr>"
          }
        }
        tableHeaderContend += tableBodyContend;
        tableHeaderContend += "</table></div>";
        tabBody += tableHeaderContend;
        tabBody += "</div>"
      } else {
        tabBody += "<div id='" + graphName + "' style='height: 91%;background-color: #fff;padding: 0px;border-bottom-left-radius: 7px ! important;border-bottom-right-radius: 7px ! important;' class='tabcontent'><div id=" + grapContainer + "" + tabCount + "  style='width: 100%;padding-bottom: 10px;'></div></div>"
      }

    }
    this.tabData += "</div>"
    this.tabData += tabBody;
    this.spinner.hide();
  }


  saveTATLogAnalysis() {
    console.log(this.tabData);;
    
    if (this.errorOrResponse != 1) {
      var saveLogAnalysiFileData = ""
      for (var tatLogAnalysisCount = 0; tatLogAnalysisCount < this.logAnalysisGraphOptionsArray[2].length; tatLogAnalysisCount++) {
        if (this.logAnalysisGraphOptionsArray[2][tatLogAnalysisCount] == "graph") {
          var chart = 'chart';
          var chartContainer = 'grapContainer';
          saveLogAnalysiFileData += "var " + chart + "" + tatLogAnalysisCount + " = new CanvasJS.Chart(" + chartContainer + "" + tatLogAnalysisCount + "," + JSON.stringify(this.logAnalysisGraphOptionsArray[0][tatLogAnalysisCount], null, 4) + " ); " + chart + "" + tatLogAnalysisCount + ".render();";
        }
      }
      console.log(saveLogAnalysiFileData);
      
      var saveLogAnalysiFile = "";
      saveLogAnalysiFile += "<html lang='en'><head><title>PTAT Log Analysis</title><meta charset='UTF-8'/><script>window.onload=function(){"
      saveLogAnalysiFile += saveLogAnalysiFileData;
      saveLogAnalysiFile += "}</script>";
      saveLogAnalysiFile += "<style>table {border-collapse: collapse;}table, td, th {font:1px solid #dee2e6;font-size:14px;}th{background-color:#337ab7;}.tab{overflow:hidden;border:1px solid #ccc;background-color:#fff}.tab button{color: black;height: 36px;margin: 0px;background-color:#e8e8e8;border-right: #fff;margin-top: 10px;border: #fff;min-width:150px;}.tab button.active{color: black;height: 36px;margin: 0px;background-color: #fff;border: 1px solid #AEAEAE;border-bottom: 1px solid white;margin-top: 10px;border-top-left-radius: 7px !important;border-top-right-radius: 7px !important;outline: -webkit-focus-ring-color auto 0px ! important;min-width:150px;}.tabcontent{display:none;padding:6px 12px;border:1px solid #ccc;border-top:none}.topright{float:right;cursor:pointer;font-size:28px}th{color:#ffff;background-color:#005eb7;padding:7px}table{border-collapse:collapse}table,td,th{border:1px solid #dee2e6;padding:5px}tbody{font-size:13px}.padTop20{padding-top:20px}.green{color:green}.red{color:red}.lightgrey{font-weight: 600}.yellowColor{color:#ecc325} .curvedCorners{border-radius: 7px !important;} .tab button.focus{-webkit-focus-ring-color: auto 0px ! important;}.tableLeftRadius{border-top-left-radius: 7px !important;}.tableRightRadius{border-top-right-radius: 7px !important;} ::-webkit-scrollbar {width: 12px;} ::-webkit-scrollbar-track {box-shadow: inset 0 0 6px rgba(0,0,0,0.3); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); border-radius: 10px;background: #F1F1F1;} ::-webkit-scrollbar-thumb {box-shadow: inset 0 0 6px rgba(0,0,0,0.5); border-radius: 10px;-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); background: #C1C1C1;} button{font-family: Intel Clear;}</style></head>";
      saveLogAnalysiFile += this.tabData;
      saveLogAnalysiFile += '<script>function tatlogtab(evt, tabName) {var i, tabcontent, tablinks;tabcontent = document.getElementsByClassName("tabcontent");for (i = 0; i < tabcontent.length; i++){tabcontent[i].style.display = "none";}tablinks = document.getElementsByClassName("tablinks");for(i = 0; i < tablinks.length; i++) {tablinks[i].className = tablinks[i].className.replace(" active", "");}document.getElementById(tabName).style.display = "block";evt.currentTarget.className += " active";}document.getElementById("Package Informaiton").click();</script></body>';
      saveLogAnalysiFile += "<script src='C:\\Program Files\\Intel Corporation\\Intel(R)PTAT\\PTATGUI\\assets\\canvasjs.min.js'></script><script src='canvasjs.min.js'></script></html>";

      var htmlContent = [saveLogAnalysiFile];
      var generateOfflineGraphFile = new Blob(htmlContent, { type: "text/html" });
      this.FileSaverServiceRef.save(generateOfflineGraphFile, "testtatLogAnalysisGraph.html");
    }
  }


}


