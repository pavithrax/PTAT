import { Component, OnInit, ViewChild, Directive, Input } from '@angular/core';
import * as $ from 'jquery';
import {UtilityServiceService} from '../services/utility-service.service';
import { DataService } from '../services/data.service';
import { SocketService } from '../db/socket.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-monitoralertstree',
  templateUrl: './monitoralertstree.component.html',
  styleUrls: ['./monitoralertstree.component.css']
})

export class MonitoralertstreeComponent implements OnInit {

  
  showFiller = false;
  dataArr:any;
  hasclass:any=false;
  cdkDropConnectedToList:Array<String>;

  constructor(private data : UtilityServiceService, private DataService:DataService, private SocketService: SocketService, private spinner:NgxSpinnerService) { 
   this.cdkDropConnectedToList = data.getCdkDropConnectedToList();
  }

  stringify(obj) {
    return JSON.stringify(obj);
    
  }
  ngOnInit() {
   //this.dataArr = this.DataService.getData();


   this.SocketService.getMonitorDataRes().subscribe(message => {
      if (message) {
       this.dataArr = message.Data;
      let cnt = this.countofCheckbox();
      this.data.passData(cnt);

      //TO FIX SELECT MONITOR ALL
      this.dataArr[0].isSelected = this.dataArr[0].Treelist.every(function (itemChild: any) {
            return itemChild.isSelected == true;
        });
      

      }
    });

  }

  
  converfn(val){

   return Boolean(JSON.parse(val));

 }
  
countofCheckbox(){
   setTimeout(function(){
      var count = $('input[type="checkbox"]:checked').length;
      //console.log($('input[type="checkbox"]:checked').length);
      return count;
   },100);
}


expandCollapse(item1){
   item1.expand = !item1.expand;
}

parentCheck(parentObj,superparent) {

   //FIRST LEVEL
   superparent.isSelected = superparent.Treelist.every(function (itemChild: any) {
      return itemChild.isSelected == true;
   });

   //SECOND LEVEL
   var secLevelLen = parentObj.Treelist.length
   for (var i = 0; i < secLevelLen; i++) {
      parentObj.Treelist[i].isSelected = parentObj.isSelected;

      //THIRD LEVEL 
      var thirdLevelLen = parentObj.Treelist[i].SubTreeList.length
      for(var k = 0; k<thirdLevelLen; k++){
         parentObj.Treelist[i].SubTreeList[k].isSelected = parentObj.isSelected;
      }
    
   }

  }

superparentCheck(parentObj){
   var levelOneLen = parentObj.Treelist.length;
   for (var i = 0; i < levelOneLen; i++) {
      parentObj.Treelist[i].isSelected = parentObj.isSelected;
      var levelTwoLen = parentObj.Treelist[i].Treelist.length;
      for(var k = 0; k<levelTwoLen; k++){
         parentObj.Treelist[i].Treelist[k].isSelected = parentObj.isSelected;
         var levelThreeLen = parentObj.Treelist[i].Treelist[k].SubTreeList.length;
         for(var l = 0; l<levelThreeLen; l++){
            parentObj.Treelist[i].Treelist[k].SubTreeList[l].isSelected = parentObj.isSelected;
         }
      }
   }
}

parentCheck1(superparentObj,parentObj1,parentObj,childObj) {
  
   setTimeout(function(){
      superparentObj.isSelected = superparentObj.Treelist.every(function (itemChild: any) {
         return itemChild.isSelected == true;
      })
   
   },100)
   
   parentObj.isSelected = parentObj1.every(function (itemChild: any) {
      return itemChild.isSelected == true;
   })

   var len = childObj.SubTreeList.length;
   for (var i = 0; i < len; i++) {
   childObj.SubTreeList[i].isSelected = childObj.isSelected;
   }
}

//Click event on child checkbox  
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

   
      // parentObj.isSelected = parentObj.Treelist.every(function (itemChild: any) {
      //    return itemChild.isSelected == true;
      // });
   
   
      // setTimeout(function(){
      //    subparent.isSelected = childObj.every(function (itemChild: any) {
      //       return itemChild.isSelected == true;
      //    });
      // },200)
     
   
   
      //TO MAKE SUPER PARENT OBJECT SELECTED
      //  setTimeout(function(){
      //    superparentObj.isSelected = superparentObj.Treelist.every(function (itemChild: any) {
      //       return itemChild.isSelected == true;
      //    });
      // },1000);
  

}


fnToggle(){
   $('#sidebar').toggleClass('active');
}


drop($event: any) {
   //console.log("Dropped in Tree", $event);
}


childNode(event) {
   let arrayOfData = [];
   let Index = event.target.getAttribute('data-index');
   let checkBoxStatus = event.currentTarget.checked;
   arrayOfData.push({"className": Index,"checkedStatus":checkBoxStatus});
   this.data.updateData(arrayOfData);
   var cmd = ""
   if(checkBoxStatus){
      //var cmd = 'AddToMonitorList('+Index+')';
       cmd = '{"Command" : "AddToMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }else{
      // var cmd = 'RemoveFromMonitorList('+Index+')';
       cmd =  '{"Command" : "RemoveFromMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }
   this.SocketService.sendMessage(cmd);
 }

 parentNode(event,obj){
   let parentCheckBoxStatus = event.currentTarget.checked;
   let Index = event.target.getAttribute('data-index');
   let parent_Index = event.target.getAttribute('data-index-parent');
   let arrayOfData = [];
   arrayOfData.push({"className": Index,"checkedStatus":parentCheckBoxStatus});
   let parentNode = "parentnode"
   var subTreeLen = obj.SubTreeList.length-1;
   for (let i = 0 ; i<=subTreeLen;i++){
      let childIndex = obj.SubTreeList[i].Index;
      arrayOfData.push({"className": childIndex,"checkedStatus":parentCheckBoxStatus});
   }
   var cmd = "";
   var minimizedId = "minimizedElement"+parent_Index+Index;
   if(parentCheckBoxStatus){
      //$('#'+minimizedId).remove();
       //cmd = 'AddToMonitorList('+parent_Index+','+Index+')';
      //  cmd = '{"Command" : "AddToMonitorList","Args":'+'"'+parent_Index+','+Index+'"'+'}'
       cmd = '{"Command" : "AddToMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }else{
	$('#'+minimizedId).remove();
      //$('#maximizeDiv').empty();
      //  cmd = 'RemoveFromMonitorList('+parent_Index+','+Index+')'; 
      // cmd = '{"Command" : "RemoveFromMonitorList","Args":'+'"'+parent_Index+','+Index+'"'+'}'
      cmd = '{"Command" : "RemoveFromMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }
   this.SocketService.sendMessage(cmd);
   this.data.updateData(arrayOfData);

 }


 
superParentNode(event,obj,superparent){
   let arrayOfData = [];
   let parentCheckBoxStatus = event.currentTarget.checked;
   let Index = event.target.getAttribute('data-index');
   var treeListLen = obj.Treelist.length-1;
   for (let i = 0 ; i<=treeListLen;i++){
      let parentIndex = obj.Treelist[i].Index;
      var minimizedId = "minimizedElement"+Index+parentIndex;
      if(parentCheckBoxStatus){
        
      }else{
         $('#'+minimizedId).remove();
      }
      
      arrayOfData.push({"className": parentIndex,"checkedStatus":parentCheckBoxStatus});
      var subTreeListLen = obj.Treelist[i].SubTreeList.length-1;
      for (let j = 0 ; j<=subTreeListLen;j++){
         let childIndex = obj.Treelist[i].SubTreeList[j].Index;
         arrayOfData.push({"className": childIndex,"checkedStatus":parentCheckBoxStatus});
         //var minimizedId = "minimizedElement"+Index+parentIndex;
         // console.log(minimizedId);
         // if(parentCheckBoxStatus){
           
         // }else{
         //    //$('#'+minimizedId).remove();
         //    if ($('#'+minimizedId).length) {
         //       $('#'+minimizedId).remove();
         //    }
         // }

      }
   }
   var cmd = "";
   if(parentCheckBoxStatus){
      $('#maximizeDiv').empty();
      // var cmd = 'AddPluginToMonitorList('+Index+')';
       cmd = '{"Command" : "AddToMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }else{
      // var cmd = 'RemovePluginFromMonitorList('+Index+')'; 
       cmd = '{"Command" : "RemoveFromMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }
   
   this.SocketService.sendMessage(cmd);
   this.data.updateData(arrayOfData);




}


 
monitorNode(event,obj){
   console.log(event);
   console.log(obj);
   
   
   let arrayOfData = [];
   let Index = obj.Index;
   let parentCheckBoxStatus = event.currentTarget.checked;
   var treeListLen = obj.Treelist.length-1;
   for (let i = 0 ; i<=treeListLen;i++){
      var level2Len = obj.Treelist[i].Treelist.length-1;
      for (let j = 0 ; j<=level2Len;j++){
         let parentIndex = obj.Treelist[i].Treelist[j].Index;
         arrayOfData.push({"className": parentIndex,"checkedStatus":parentCheckBoxStatus});
         var level3Len = obj.Treelist[i].Treelist[j].SubTreeList.length-1;
         for (let k = 0 ; k<=level3Len;k++){
            let childIndex = obj.Treelist[i].Treelist[j].SubTreeList[k].Index;
            arrayOfData.push({"className": childIndex,"checkedStatus":parentCheckBoxStatus});
         }
      }
   }
   var cmd = "";
   if(parentCheckBoxStatus){
      $('#maximizeDiv').empty();
      $('.equalspacing').show();
      // var cmd = 'AddToMonitorList()';
      // cmd = '{"Command" : "AddToMonitorList"}'
      cmd = '{"Command" : "AddToMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
   }else{
      $('#maximizeDiv').empty();
      // var cmd = 'RemoveFromMonitorList()';
      // cmd = '{"Command" : "RemoveFromMonitorList"}'
      cmd =  '{"Command" : "RemoveFromMonitorList","params" : {"Args":'+'"'+Index+'"'+'}}'
      $('.equalspacing').hide(); 
   }

   
   this.SocketService.sendMessage(cmd);

   this.data.updateData(arrayOfData);
}






}
