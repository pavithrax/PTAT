import { Component, OnInit } from '@angular/core';
import { SocketService } from '../db/socket.service';
@Component({
   selector: 'app-help',
   templateUrl: './help.component.html',
   styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
   display = 'none';
   getTargetRes: any;

   getTargetData(){
      this.SocketService.getTargetInfo().subscribe(message => {
         if (message) {
           this.getTargetRes = message;
         } else {          
           this.getTargetRes = [];
         }
       });
     }
 
   ngOnInit() {
      this.getTargetData();
   }
   constructor(private SocketService: SocketService) { }



   openModal() {
      this.display = 'block';
   }
   closeModal() {
      this.display = 'none';
   }


}
