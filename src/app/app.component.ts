import { Component, inject } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  private pt = inject(Platform);

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
    await this.pt.ready();

    if (this.pt.is('capacitor')) {

      if (this.pt.is('android')) {
        await StatusBar.setOverlaysWebView({ overlay: false }); // Evita que la webview se superponga a la barra
        await StatusBar.setStyle({ style: Style.Dark }); // O Light según tu diseño
      }

    }
  }
}
