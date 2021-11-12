import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-turbo",
  templateUrl: "./turbo.component.html",
  styleUrls: ["./turbo.component.css"]
})
export class TurboComponent implements OnInit {

  constructor() { }
  startInterval:any;
  count:number = 0;

  tableHeader = ["CPU","#Cores","CFreq (Act)", "CFreq (Exp)", "UFreq (Act)","UFreq (Exp)", "Power","TDP", "Temp","Volt"];
  tableData1 = [["as","sa","sa","sa","sa","sa","sa","sa","sa","sa"],["as","sa","sa","sa","sa","sa","sa","sa","sa","sa"]]

  tabPanelHeader = ["IA/SSE","AVX2","AVX512"];

  data:any= [
		{
			"CPU": "1000",
			"#Cores": "f230fh0g3",
			"CFreq (Act)": "Bamboo Watch",
			"CFreq (Exp)": "Product Description",
			"UFreq (Act)": "bamboo-watch.jpg",
			"UFreq (Exp)": 65,
			"Temp": "Accessories",
			"TDP": 24,
			"Volt": "INSTOCK",
			"Power": 5
		},
		{
			"CPU": "1001",
			"#Cores": "nvklal433",
			"CFreq (Act)": "Black Watch",
			"CFreq (Exp)": "Product Description",
			"UFreq (Act)": "black-watch.jpg",
			"UFreq (Exp)": 72,
			"Temp": "Accessories",
			"TDP": 61,
			"Volt": "INSTOCK",
			"Power": 4
		}
	]

  selectedProducts:any;

  cols = [
    { field: "CPU", header: "CPU" },
    { field: "#Cores", header: "#Cores" },
    { field: "CFreq (Act)", header: "CFreq (Act)" },
    { field: "CFreq (Exp)", header: "CFreq (Exp)" },
    { field: "UFreq (Act)", header: "UFreq (Act)" },
    { field: "UFreq (Exp)", header: "UFreq (Exp)" },
    
    { field: "Power", header: "Power" },
    { field: "TDP", header: "TDP" },
    { field: "Temp", header: "Temp" },
    { field: "Volt", header: "Volt" }
  ]
  
  ngOnInit() {
    this.startInterval = setInterval(() => {
                    this.update();
    }, 10000);
  }

  update() {
    this.count++;
    this.tableData1.push(["as","sa","","","sa","sa","sa","sa","sa","sa"]);
    this.data.push({
			"CPU": "1009111",
			"#Cores": "cm230f032",
			"CFreq (Act)": "Gaming Set",
			"CFreq (Exp)": "Product Description",
			"UFreq (Act)": "gaming-set.jpg",
			"UFreq (Exp)": 299,
			"Temp": "Electronics",
			"TDP": 63,
			"Volt": "INSTOCK",
			"Power": 3
		})
    console.log(this.tableData1);
    console.log(this.count);
    
    if(this.count == 5) {
      console.log("Hi");
      clearInterval(this.startInterval);
    }
  }

}
