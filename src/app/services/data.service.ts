import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dataArray:any;
  compdata:any;
  startmonitordata:any;
  livegraphdata:any;
  livegraphUpdatedata:any;
  loadscriptsfiles: any;
  getToolInfoResponses: any;
  liveAnalysisData:any;
  solverData:any;
  dataArray1:any;

  
  constructor() {
    this.setData();
    this.setComponetData();
    this.setStartmonitorData();
    this.setLiveGraphData();
    this.setLiveGraphUpdatedata();
    this.setLoadFilesData();
    this.setToolInfo();
	 this.setLiveAnalysisData();
    this.setSolverData();
   }

setData(){
}

getData(){
 
}
   

setComponetData(){


}

GetCommonData(){
 
}

setStartmonitorData(){

}

getStartmonitorData(){
 
}
   
setLiveGraphData(){

}


getLiveGraphData(){
  
}


setLiveGraphUpdatedata(){

}

getLiveGraphUpdatedata(){

}

setLoadFilesData()
{

}
getLoadFilesData(){

}
setToolInfo()
{ 

}
getToolInfo(){
}

setLiveAnalysisData(){

}
getLiveAnalysisData(){
  
}
setSolverData(){
   
}
getSolverData(){

}


}
