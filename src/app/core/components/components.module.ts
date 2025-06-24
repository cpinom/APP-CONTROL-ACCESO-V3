import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal/barcode-scanning-modal.component';
import { ResultModalComponent } from './result-modal/result-modal.component';

@NgModule({
  declarations: [
    BarcodeScanningModalComponent,
    ResultModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
  ]
})
export class ComponentsModule { }