import { Component, OnInit } from '@angular/core';
import { SocketService } from '../db/socket.service';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  display = 'none';
  ErrorMsg = 'Error';
  constructor(public socket: SocketService) { 
    
  }

  ngOnInit() {
    this.getErrorMsg();
  }
  getErrorMsg() {
    this.socket.handleError().subscribe(message => {
       if (message) {       
        this.display = 'block';
       }


    });
 }


}
