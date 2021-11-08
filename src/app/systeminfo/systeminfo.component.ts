import { Component, ViewChild, OnInit } from '@angular/core';
import { SocketService } from '../db/socket.service';
import { MatSidenav } from '@angular/material/sidenav';
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-systeminfo',
  templateUrl: './systeminfo.component.html',
  styleUrls: ['./systeminfo.component.css']
})
export class SysteminfoComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  systemInfoData: any;
  selectedContainer: any;
  hideComponentDropDown: boolean = false;
  systemInfoTree: Array<any> = [];
  systemInfoTableData: Array<any> = [];
  toggleIconRightLeft: boolean = true;
  activeTreeNodeName: string = "";
  receivedData: boolean = false;
  constructor(private SocketService: SocketService) { }

  ngOnInit() {
    this.getSyetemInfoData();
  }

  getSyetemInfoData() {
    this.SocketService.GetCommonDataRes().subscribe(message => {
      if (message) {
        if (message.CommandStatus.Status == 'Success') {
          if (!this.receivedData) {
            this.receivedData = true;
            this.setSystemInfoData(message.Data);
          }

        } else {

        }
      }
    });
  }
  setSystemInfoData(data) {
    this.systemInfoData = data;
    if (this.systemInfoData) {
      this.createTreeForSystemInfo();
    }
  }
  createTreeForSystemInfo() {
    this.systemInfoData.forEach(element => {
      this.systemInfoTree.push(element.pluginName);
    });
    //console.log("SystemTree",this.systemInfoTree);
    this.createTableDataForSystemInfo(this.systemInfoTree[0]);
  }
  createTableDataForSystemInfo(data) {
    this.activeTreeNodeName = data;
    this.systemInfoData.forEach(element => {
      if (element.pluginName == data) {
        this.systemInfoTableData = element.Information;
      }
    });
    //console.log("InfoTable",this.systemInfoTableData);
  }
  toggleIcon() {
    this.toggleIconRightLeft = !this.toggleIconRightLeft;
  }


  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    var scrHeight = window.innerHeight;
    var scrWidth = window.innerWidth;
    if (scrWidth < 700) {
      this.sidenav.close();
      this.toggleIconRightLeft = false;
    }
  }

  collapseOrExpand(item) {
    item.expand = !item.expand;
  }

}
