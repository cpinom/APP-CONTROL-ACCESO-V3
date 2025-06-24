import { Component, inject, OnInit } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
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
    const barcode = await this.escanearQR();
    debugger
    this.scanning = false;
  }
  async escanearQR() {
    return new Promise<string | undefined>(async resolve => {
      const element = await this.dialog.showModal({
        component: BarcodeScanningModalComponent,
        cssClass: 'barcode-scanning-modal',
        showBackdrop: false,
        animated: false
      });

      element.onDidDismiss().then((result) => {
        const barcode: string | undefined = result.data?.barcode;
        if (barcode) {
          resolve(barcode)
        }
        else {
          resolve(undefined)
        }
      })
    });
  }

}
