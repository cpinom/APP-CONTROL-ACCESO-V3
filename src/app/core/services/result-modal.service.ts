import { inject, Injectable } from '@angular/core';
import { ResultModalComponent } from '../components/result-modal/result-modal.component';
import { DialogService } from './dialog.service';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class ResultModalService {

  private dialog = inject(DialogService);

  constructor() { }

  async showSuccessModal(durationInSeconds: number = 3): Promise<void> {
    const modal = await this.dialog.showModal({
      component: ResultModalComponent,
      cssClass: 'custom-feedback-modal',
      backdropDismiss: false,
      animated: false
    });

    await modal.present();

    // Emitir sonido y beep
    // this.audioSuccess.play();
    // this.emitBeep();

    Haptics.vibrate({
      duration: 100, // Duración de la vibración en milisegundos
    });

    // Cerrar modal después del tiempo definido
    setTimeout(() => {
      modal.dismiss();
    }, durationInSeconds * 1000);
  }
}
