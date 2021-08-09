import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MonitorComponent } from './monitor/monitor.component';
import { AlertsComponent } from './alerts/alerts.component';
import { MonitoralertstreeComponent } from './monitoralertstree/monitoralertstree.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './MatLib/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations'; 
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SocketService } from './db/socket.service';
import { HelpComponent } from './help/help.component';
import { HeaderComponent } from './header/header.component';
import { ScriptsComponent } from './scripts/scripts.component';
import { SettingComponent } from './setting/setting.component';
import { WorkloadComponent } from './workload/workload.component';
import { ControlComponent } from './control/control.component';
import { TatloganalysisComponent } from './tatloganalysis/tatloganalysis.component';
import { GraphComponent } from './graph/graph.component';
import { SavescriptComponent } from './savescript/savescript.component';
import { LoadscriptComponent } from './loadscript/loadscript.component';
import { LiveAnalysisComponent } from './live-analysis/live-analysis.component';
import { NotifierModule } from "angular-notifier";
import { NgxSpinnerModule } from "ngx-spinner";
import { FileSaverModule } from 'ngx-filesaver';
import { TatfeatureComponent } from './tatfeature/tatfeature.component';
import { ErrorComponent } from './error/error.component';
import { TargetHostErrorComponent } from './target-host-error/target-host-error.component';
import { SysteminfoComponent } from './systeminfo/systeminfo.component';


@NgModule({
  declarations: [
    AppComponent,
    MonitorComponent,
    AlertsComponent,
    MonitoralertstreeComponent,
    FooterComponent,
    HelpComponent,
    HeaderComponent,
    ScriptsComponent,
    SettingComponent,
    WorkloadComponent,
    ControlComponent,
    TatloganalysisComponent,
    GraphComponent,
    SavescriptComponent,
    LoadscriptComponent,
    LiveAnalysisComponent,
    TatfeatureComponent,
    ErrorComponent,
    TargetHostErrorComponent,
    SysteminfoComponent,
    
  ],
  entryComponents: [ HelpComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule,
    FormsModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    DragDropModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
           position: 'right',
           distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12
        }       
      }
    }),
    NgxSpinnerModule,
    FileSaverModule
 
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
