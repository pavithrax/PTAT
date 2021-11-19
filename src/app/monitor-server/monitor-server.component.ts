import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';

import { TabView, TabPanel } from 'primeng/tabview';
import { SocketService } from '../db/socket.service';
declare var $: any;

@Component({
    selector: 'app-monitor-server',
    templateUrl: './monitor-server.component.html',
    styleUrls: ['./monitor-server.component.css'],
    styles: [`
        :host ::ng-deep .priority-2, 
        :host ::ng-deep .priority-3,
        :host ::ng-deep .visibility-sm {
            display: none;
        }

        @media screen and (max-width: 39.938em) {
            :host ::ng-deep .visibility-sm {
                display: inline;
            }
        }

        @media screen and (min-width: 40em) {
            :host ::ng-deep .priority-2 {
                display: table-cell;
            }
        }

        @media screen and (min-width: 64em) {
            :host ::ng-deep .priority-3 {
                display: table-cell;
            }
        }

        .kb-row {
            
        }

        .kb-cell {
            font-weight: 700;
        }
    `]
})



export class MonitorServerComponent implements OnInit {
    serverData: TreeNode[];
    tabData = [];//["CPU", "PCH", "MEM"];
    selectedIndex = 0;
    selectedTab = "";
    @ViewChild(TabView, { static: false }) tabView: TabView;


    cols: any[];
    selectedColumns: any[];

    //start monitor and start logging button
    btnFlag: boolean = false;
    btnFlag1: boolean = false;
    starmonitorflag = 0;
    //start monitor and start logging button

    loading: boolean;

    showMonitorLogginModal:boolean;
    showHideStartLoggingCheckBoxStatus: boolean = false;

    constructor(private SocketService: SocketService) { }


    //VARIABLE DECLARATION
    tblcount: any;
    table1Data: Array<any> = [];
    table2Data: Array<any> = [];
    table3Data: Array<any> = [];
    tableError = false;
    tableErrorName: any = "";
    dataArr: any;
    componentData: any;
    selectedcount: any;
    counter: number = 1;

    colHeaders: any = [];
    systemDataHeaders:any = [];

    ngOnInit() {
        this.loading = true;

        this.SocketService.getMonitorDataRes().subscribe(message => {
            console.log(message);
            if (message) {
                var command = '{"Command" : "GetCommonData"}'
                var getSettingsCommand = '{"Command" : "GetSettings"}'
                if (this.counter > 2) {
                    this.SocketService.sendMessage(getSettingsCommand);
                }
                this.SocketService.sendMessage(command);
                // let colHeaders1 = {
                //     'CPU':['Name','Core Frequency','Uncore Frequency','Utilization','IPC','C0','C1','C6','PC2','Temperature','DTS','Voltage','Power'],
                //     'MEM': ['Name','Dts']
            
                // };
                let colHeaders1 = message.TableHeader;
                this.systemDataHeaders = message.SystemData;
                // this.systemDataHeaders.forEach(element => {
                //     element.Value = "-";
                // });
                // let arr;
                Object.keys(colHeaders1).forEach(key => this.colHeaders.push({
                    Name: key,
                    child: colHeaders1[key]
                }));
               
                this.colHeaders.forEach(element => {
                    element.child.splice(0,0,'Name')
                });
                console.log(this.colHeaders);
                this.counter++

                //console.log(message.data);
                this.dataArr = message.Data;
                this.setUpGrid();
                
            }
        });


        this.SocketService.StartMonitorRes().subscribe(message => {
            //console.log("Received Response");
            if (message) {
                if (message.CommandStatus.Status == 'Success') {//once it's success change the start monitor to stop monitor
                    this.monitorstatus = false;
                }
                if (message.CommandStatus.Message == "") {
                    var startMonitorResponseHandler = message.Data;
                    var smrhLen = startMonitorResponseHandler.length - 1;
                    for (let i = 0; i <= smrhLen; i++) {
                        let key = startMonitorResponseHandler[i].Key;
                        let value = startMonitorResponseHandler[i].Value;
                        let classToAppend = "serverMonitorData-" + key;
                        $("." + classToAppend).html(value);
                        // $("." + classToAppend).html(key  + ' - ' + value);
                        if(startMonitorResponseHandler[i].Color) {
                            let color = startMonitorResponseHandler[i].Color
                            $("." + classToAppend).css('color',color);
                        }
                        
                    }
                } else {
                }

                // DELETE this code - below code is just to mock start monitor call
                // this.monitorstatus = false;

                // this.startInterval = setInterval(() => {
                //     this.update();
                // }, 1000);
                // DELETE this code - above code is just to mock start monitor call
            }
        });


        this.SocketService.StopMonitorRes().subscribe(message => {
            if (message) {
                this.monitorstatus = true;
                $('.naCommonClass').html('NA');




                // DELETE this code - below code is just to mock start monitor call
                //clearInterval(this.startInterval);
                // DELETE this code - above code is just to mock start monitor call
            }
        });


        this.SocketService.GetLogHeaderServerRes().subscribe(message => {
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
    }


    onTabChange($event) {
        console.log($event);
        this.cols = [];
        this.selectedIndex = $event.index;
        console.log(this.tabView.tabs[this.selectedIndex].header);
        this.selectedTab = this.tabView.tabs[this.selectedIndex].header;

        //send the command to backend to load Component specific data --- not really and to be removed

        // if (this.selectedTab == "CPU") {

        //     this.cols = [
        //         { field: 'Name', header: 'Name' },
        //         { field: 'Core Frequency', header: 'CoreFrequency' },
        //         { field: 'Uncore Frequency', header: 'UnCoreFrequency' },
        //         { field: 'Utilization', header: 'Utilization' },
        //         { field: 'IPC', header: 'IPC' },
        //         { field: 'C0', header: 'C0' },
        //         { field: 'C1', header: 'C1' },
        //         { field: 'C6', header: 'C6' },
        //         { field: 'PC2', header: 'PC2' },
        //         { field: 'Temperature', header: 'Temperature' },
        //         { field: 'DTS', header: 'DTS' },
        //         { field: 'Voltage', header: 'Voltage' },
        //         { field: 'Power', header: 'Power' }
        //     ];

        //     this.selectedColumns = this.cols;
        //     this.serverData = this.dataArr[0]["CPU"];
        // }
        // else if (this.selectedTab == "PCH") {

        //     this.cols = [
        //         { field: 'Name', header: 'Name' },
        //         { field: 'Core Frequency', header: 'CoreFrequency' },
        //         { field: 'Uncore Frequency', header: 'UnCoreFrequency' },
        //         { field: 'Utilization', header: 'Utilization' },
        //         { field: 'IPC', header: 'IPC' },
        //         { field: 'C0', header: 'C0' },
        //         { field: 'C1', header: 'C1' },
        //         { field: 'C6', header: 'C6' },
        //         { field: 'PC2', header: 'PC2' },
        //         { field: 'Temperature', header: 'Temperature' },
        //         { field: 'DTS', header: 'DTS' },
        //         { field: 'Voltage', header: 'Voltage' },
        //         { field: 'Power', header: 'Power' }
        //     ];

        //     this.selectedColumns = this.cols;
        //     this.serverData = this.dataArr[0]["PCH"];
        // }
        // else if (this.selectedTab == "MEM") {

        //     this.cols = [
        //         { field: 'Name', header: 'Name' },
        //         { field: 'Core Frequency', header: 'CoreFrequency' },
        //         { field: 'Uncore Frequency', header: 'UnCoreFrequency' },
        //         { field: 'Utilization', header: 'Utilization' },
        //         { field: 'IPC', header: 'IPC' },
        //         { field: 'C0', header: 'C0' },
        //         { field: 'C1', header: 'C1' },
        //         { field: 'C6', header: 'C6' },
        //         { field: 'PC2', header: 'PC2' },
        //         { field: 'Temperature', header: 'Temperature' },
        //         { field: 'DTS', header: 'DTS' },
        //         { field: 'Voltage', header: 'Voltage' },
        //         { field: 'Power', header: 'Power' }
        //     ];

        //     this.selectedColumns = this.cols;
        //     this.serverData = this.dataArr[0]["MEM"];
        // }
        // above code to be removed

        console.log(this.colHeaders);
        console.log(this.selectedTab);
        
        this.colHeaders.forEach(item => {
            if(item.Name == this.selectedTab) {
                item.child.forEach(element1 => {
                    console.log(element1);
                    
                    this.cols.push({field:element1,header: element1.replace(" ","") })
                });
            }
        });
       
        
        console.log(this.cols);
        this.selectedColumns = this.cols;
        this.dataArr.forEach(element => {
            // Object.entries(element) 
            let arr = Object.keys(element);
            console.log(arr);
            
            if(arr[0] == this.selectedTab) {
                this.serverData = element[arr[0]];
            }
        });
        
        // if(this.selectedTab == 'MEM') {
        //     this.serverData = this.dataArr[0]["MEM"];
        // }
        console.log(this.serverData);
        console.log(this.dataArr);
        

    }



    setUpGrid() {
        console.log(this.dataArr);
        this.dataArr.forEach(element => {
            Object.keys(element).forEach((e) => {
                console.log(e);
                this.tabData.push(e);
            });
        });
        
        console.log(this.tabData);
        this.cols = [];
        this.colHeaders.forEach(element => {
            if(element.Name == this.tabData[0]) {
                console.log(element);
                
                element.child.forEach(element1 => {
                    console.log(element1);
                    
                    this.cols.push({field:element1,header: element1.replace(" ","") })
                });
                
            }
        });
        console.log(this.cols);
        

        this.selectedColumns = this.cols;
        console.log(this.tabData);
        
        this.serverData = this.dataArr[0][this.tabData[0]];
        this.selectedTab = this.tabData[0];
        console.log(this.serverData);
        
        //this.toggleTreeView(true);
    }




    //Start Monitor and Loggin starts
    startInterval: any;
    monitorstatus: boolean = true;
    startMonitorClick() {
        console.log("Clicked on start monitor ->" + this.selectedIndex + " - " + this.selectedTab);
        if (this.monitorstatus) {
            this.starmonitorflag++;
            var command = '{"Command" : "StartMonitor"}'
            this.SocketService.sendMessage(command);
            // this.SocketService.sendMessage("StartMonitor()");

        } else {
            this.starmonitorflag = 0;
            var stopMonitorCommand = '{"Command" : "StopMonitor"}'
            this.SocketService.sendMessage(stopMonitorCommand);
            // this.SocketService.sendMessage("StopMonitor()");

        }
    }



    loggingstatus: boolean = true;
    startLoggingClick() {
        //  this.loggingstatus = !this.loggingstatus;  
        console.log("Clicked on start logging ->" + this.selectedIndex + " - " + this.selectedTab);
        if (this.loggingstatus) {
            var command = '{"Command" : "GetLogHeaderServer"}'
            this.SocketService.sendMessage(command);
            //this.SocketService.sendMessage("GetLogHeader()");
        } else {
            var stopLoggingCommand = '{"Command" : "StopLogging"}'
            this.SocketService.sendMessage(stopLoggingCommand);
            //this.SocketService.sendMessage("StopLogging()");
        }
    }



    highlightFirstLevelData(array) {
        // console.log('node '+ node);
        
        // console.log(array);
        const col = 'Name'; // the name of a field column you got from your getTable()
        if (array[col].includes('CPU')) {
            return 'highlight_grid_row';
        }
    }


    toggleTreeView(toggle: boolean) {
        this.serverData.map(node => {
            if (node.children) {
                node.expanded = toggle;
                for (let cn of node.children) {
                    this.toggleRow(cn, toggle);
                }
            }
        });
    }

    toggleRow(node: TreeNode, toogle: boolean){
        node.expanded = toogle;
    }

    // if there's a modal popup info from the response, then on
    closeMonitorLogginModal(){
        this.showMonitorLogginModal = false;
        if (this.showHideStartLoggingCheckBoxStatus == true) {
          var command = '{"Command" : "DisableWarnings","Args":"monitor"}'
          this.SocketService.sendMessage(command);
        } else {
          this.showMonitorLogginModal = false;
        }
    }
}
