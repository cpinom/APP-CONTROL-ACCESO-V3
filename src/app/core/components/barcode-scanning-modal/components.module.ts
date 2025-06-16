import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  declarations: [
    BarcodeScanningModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    BarcodeScanningModalComponent
  ]
})
export class ComponentsModule { }
