import { Injectable } from '@angular/core';
import { SocketService } from './db/socket.service';
@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
scriptcommandselected:any;

  constructor(private SocketService: SocketService) {   
    this.setscriptcommandselected();
  }
  setscriptcommandselected()
  {
   
    this.scriptcommandselected =
    {
      "DropDownList": [
         {
            "Name": "Component",
            "Row": "CPU Component:0,SOiX Component:1"
         },
         {
            "Name": "Arg1",
            "Row": "IA On Demand Clock Modulation:0,IA Turbo ON/OFF:1,Package:2,Integrated Graphics:3,Power Delivery:4"
         },
         {
            "Name": "Arg2",
            "Row": "CPU0:0,CPU1:1,CPU2:2,CPU3:3"
         },
         {
            "Name": "Arg3",
            "Row": "0.00, 6.25,12.50,18.75,25.00,31.25,37.50,43.75,50.00,56.25,62.50,68.75,75.00,81.25,87.50,93.75"
         },
         {
            "Name": "Arg4",
            "Row": "Disabled"
         }
      ]
   }

  }
  getscriptcommandselected(){
    return this.scriptcommandselected;
 }
 
 
}
