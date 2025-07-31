import { Component, inject, OnInit } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { Camera } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { BarcodeScanningModalComponent } from 'src/app/core/components/barcode-scanning-modal/barcode-scanning-modal.component';
import { ApiService } from 'src/app/core/services/api.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ResultModalService } from 'src/app/core/services/result-modal.service';

const TIEMPO_ESPERA = 5; // 2 segundos

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
  private pt = inject(Platform);
  private global = inject(AppGlobal);
  scanning = false;

  constructor() { }
  ngOnInit() { }
  async validarQR() {
    this.scanning = true;
    const barcode = await this.escanearQR();
    // debugger
    // const barcode = 'BEGIN:VCARD VERSION:3.0 EMAIL;TYPE=INTERNET:cpinom@inacap.cl END:VCARD';


    if (barcode) {
      if (this.esVCard(barcode)) {
        const emailMatch = barcode.match(/EMAIL.*?:([\w.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        const email = emailMatch ? emailMatch[1] : undefined;

        if (email) {
          await this.validarCorreo(email);
        }
      }
      else {
        alert(barcode);
        await this.validarToken(barcode);
      }
    }

    this.scanning = false;
  }
  async validarCorreo(correo: string) {
    const loading = await this.dialog.showLoading({ message: 'Validando...' });

    try {
      const response = await this.api.validarCorreo({ correo: correo });

      void loading.dismiss();

      if (response.success && response.code == 200) {
        await this.resultModal.showSuccessModal(response.data, TIEMPO_ESPERA);
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      void loading.dismiss();
      await this.resultModal.showSuccessModal(null, TIEMPO_ESPERA);
    }
    finally {
      loading.dismiss();
    }
  }
  async validarToken(token: string) {
    const loading = await this.dialog.showLoading({ message: 'Validando...' });

    try {
      const response = await this.api.validarToken({ token: token });

      void loading.dismiss();

      if (response.success && response.code == 200) {
        await this.resultModal.showSuccessModal(response.data, TIEMPO_ESPERA);
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      void loading.dismiss();
      await this.resultModal.showSuccessModal(null, TIEMPO_ESPERA);
    }
    finally {
      void loading.dismiss();
    }
  }
  async escanearQR() {

    if (this.pt.is('mobileweb')) {
      // return Promise.resolve('kL74mAiT1rOoPs2UbPCmloN1CTInjWXLVxkK1JkebRU=');
      return Promise.resolve('HP+FGLYtEhuC4ZWH0Fe48Ugi31IafLVWfKEADsSct/4=');
      // return Promise.resolve('BEGIN:VCARD VERSION:3.0 EMAIL;TYPE=INTERNET:cpinom@inacap.cl END:VCARD');
    }

    let mostrarEscaneo = true;

    if (this.pt.is('capacitor')) {
      try {
        let permission = await Camera.checkPermissions();

        if (permission.camera == 'denied' || permission.camera == 'prompt') {
          // if (this.pt.is('capacitor')) {
          permission = await Camera.requestPermissions();
          // }
        }
        if (permission.camera == 'granted') {
          mostrarEscaneo = true;
        }
        else {
          mostrarEscaneo = false;
        }
      }
      catch {
        mostrarEscaneo = false;
      }
    }

    if (!mostrarEscaneo) {
      await this.showAlertCamera();
      return Promise.resolve(undefined);
    }

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
  async showAlertCamera(header: string = 'Escanear Código QR') {
    const alert = await this.dialog.showAlert({
      header: header,
      message: 'Vaya a "Ajustes > Aplicaciones > Control Acceso" y active el permiso de cámara.',
      buttons: [
        {
          text: 'Aceptar',
          role: 'destructive'
        }
      ]
    });

    return alert;
  }

  get version() {
    return this.global.Version;
  }

}
