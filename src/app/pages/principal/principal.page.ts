import { Component, inject, OnInit } from '@angular/core';
import { BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { BarcodeScanningModalComponent } from 'src/app/core/components/barcode-scanning-modal/barcode-scanning-modal.component';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})
export class PrincipalPage implements OnInit {

  private dialog = inject(DialogService);
  scanning = false;

  constructor() { }

  ngOnInit() {
  }
  validarAcademicos() {
    this.validarQR();
  }
  validarAdministrativos() {
  }
  async validarQR() {
    this.scanning = true;
    const modal = await this.dialog.showModal({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      animated: false,
      componentProps: {
        formats: [BarcodeFormat.QrCode],
        lensFacing: LensFacing.Back,
      }
    });

    const data = await modal.onWillDismiss();
    debugger
    this.scanning = false;
  }

}
