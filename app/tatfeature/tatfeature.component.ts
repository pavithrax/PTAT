import { Component, OnInit } from '@angular/core';
import { SocketService } from '../db/socket.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-tatfeature',
  templateUrl: './tatfeature.component.html',
  styleUrls: ['./tatfeature.component.css']
})
export class TatfeatureComponent implements OnInit {
  showTatFeatureModal:boolean;
  tatFeatureDataReceived:any;
  getTatFeaturesStatusData:any;
  tatFeatureData:any;
  tatFeatureDataLength:any;
  slideToShowReceivedValue:number;
  slideToShow :number;
  showHideTatFeatureCheckBoxStatus: boolean = false;
  constructor(private SocketService: SocketService) { }

  ngOnInit() {
       
    this.SocketService.getTatFeatureStatus().subscribe(message => {
      if (message) {
        //alert(JSON.stringify(message));
        this.slideToShowReceivedValue = message.Data;
        if(message.CommandStatus.Message == "0")
        {
          this.showTatFeatureModal = true;
		  $(".container1").trigger("ss-rearrange");
        }else{
          this.showTatFeatureModal = false;
		  $(".container1").trigger("ss-rearrange");
        }
        var command = '{"Command" : "GetTatFeatures"}'
        this.SocketService.sendMessage(command);
        // this.SocketService.sendMessage("GetTatFeatures()");
      } else {

        this.tatFeatureData = [];
      }
    });

    this.SocketService.getTatFeatures().subscribe(message => {
      if (message) {
        this.tatFeatureDataLength =  message.GetTatFeatures.length;
        this.slideToShow = this.slideToShowReceivedValue % this.tatFeatureDataLength;
        this.tatFeatureData = message.GetTatFeatures;
        // alert(JSON.stringify(this.tatFeatureDataLength));
		$(".container1").trigger("ss-rearrange");
      } else {

        this.tatFeatureData = [];
      }
    });

    this.SocketService.getTatFeaturesStatusRes().subscribe(message => {
      if (message) {
        this.showTatFeatureModal = false;
      }
    });


  }

  closeTatFeatureModal() {
    if (this.showHideTatFeatureCheckBoxStatus == true) {
      var command = '{"Command" : "setTatFeaturesStatus","Args":'+'"'+'1'+'"'+'}'
      // this.SocketService.sendMessage("setTatFeaturesStatus(1)");
      this.SocketService.sendMessage(command);
    } else {
      this.showTatFeatureModal = false;
    }
  }




}
