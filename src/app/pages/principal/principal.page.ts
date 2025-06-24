import { Component, inject, OnInit } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { BarcodeScanningModalComponent } from 'src/app/core/components/barcode-scanning-modal/barcode-scanning-modal.component';
import { ApiService } from 'src/app/core/services/api.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ResultModalService } from 'src/app/core/services/result-modal.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: false
})
export class PrincipalPage implements OnInit {

  private dialog = inject(DialogService);
  private api = inject(ApiService);
  private resultModal = inject(ResultModalService);
  scanning = false;

  constructor() { }
  ngOnInit() { }
  async validarQR() {
    this.scanning = true;
    // const barcode = await this.escanearQR();
    debugger

    const barcode = 'BEGIN:VCARD VERSION:3.0 EMAIL;TYPE=INTERNET:cpinom@inacap.cl END:VCARD';


    if (barcode) {
      if (this.esVCard(barcode)) {
        const emailMatch = barcode.match(/EMAIL.*?:([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        const email = emailMatch ? emailMatch[1] : undefined;

        if (email) {
          await this.validarCorreo(email);
        }
      }
      else {
        await this.validarToken(barcode);
      }
    }

    this.scanning = false;
  }
  async validarCorreo(correo: string) {
    const result = await this.api.validarCorreo({ correo: correo });

    if(result.success && result.code == 200) {
      this.resultModal.showSuccessModal(2);
    }
  }
  async validarToken(token: string) {
    const result = await this.api.validarToken({ token: token });
    debugger

    if(result.success && result.code == 200) {
      this.resultModal.showSuccessModal(2);
    }
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
  esVCard(barcode: string) {
    if (typeof barcode !== 'string') return false;

    const tieneInicio = barcode.includes('BEGIN:VCARD');
    const tieneFin = barcode.includes('END:VCARD');
    const tieneVersion = /VERSION:\d+\.\d+/.test(barcode);

    return tieneInicio && tieneFin && tieneVersion;
  }

}
