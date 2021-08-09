import { Component, OnInit } from '@angular/core';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";
import { UtilityServiceService } from '../services/utility-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  featureResponse: any;
   
  count = 0;
  playShow = true;
  intervalID: any;
  showHideMaximizeIcon:boolean=false;

  constructor(public socket: SocketService, private spinner: NgxSpinnerService,private util: UtilityServiceService) {

  }
  eventList: any = new Array<string>();

  ngOnInit() {
    this.socket.getTatFeatures().subscribe(message => {
      if (message) {
        this.featureResponse = message.GetTatFeatures;
        this.eventList = this.featureResponse;
       // console.log(this.featureResponse);
        this.spinner.hide();
      } else {
       
        this.featureResponse = [];
      }
    });

    this.util.minimizeVisualizationPopup.subscribe(data => {
      this.showHideMaximizeIcon=data;
    });

  }


  nextSlide() {
    if (this.count == this.featureResponse.length - 1) {
      this.count = 0;
    }
    else {
      this.count = this.count + 1;
    }
  }

  previousSlide() {
    if (this.count > 0) {
      this.count = this.count - 1;
    }
   else if(this.count == 0)
    {
      this.count = this.featureResponse.length - 1;
    }

  }
 
  playSlide() {
    this.playShow = false;
    var i = this.count;
    var lengthSlide = this.featureResponse.length - 1;
    this.intervalID = setInterval(() => {
      this.count = i;
      (i == lengthSlide) ? i = 0 : i++;
    }, 3000);

  }

  pauseSlide() {
    this.playShow = true;
    clearInterval(this.intervalID);
  }

  maximizePowerVisualization(){
    this.util.maximizePowerVisualizationPopup(true);
    this.showHideMaximizeIcon = false;
  }


}
