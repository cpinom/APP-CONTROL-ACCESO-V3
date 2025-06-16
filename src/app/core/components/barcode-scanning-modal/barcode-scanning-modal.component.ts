import { AfterViewInit, Component, ElementRef, inject, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Barcode, BarcodeFormat, BarcodeScanner, LensFacing, StartScanOptions } from '@capacitor-mlkit/barcode-scanning';
import { InputCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanning-modal',
  templateUrl: './barcode-scanning-modal.component.html',
  styleUrls: ['./barcode-scanning-modal.component.scss'],
  standalone: false
})
export class BarcodeScanningModalComponent implements OnInit, AfterViewInit, OnDestroy {

  private dialog = inject(DialogService);
  private ngZone = inject(NgZone);
  @ViewChild('square') squareElement: ElementRef<HTMLDivElement> | undefined;
  @Input() formats: BarcodeFormat[] = [];
  @Input() lensFacing: LensFacing = LensFacing.Back;

  isTorchAvailable = false;
  minZoomRatio: number | undefined;
  maxZoomRatio: number | undefined;

  constructor() { }
  ngOnInit() {
    BarcodeScanner.isTorchAvailable().then((result) => {
      this.isTorchAvailable = result.available;
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.startScan();
    }, 500);
  }
  ngOnDestroy() {
    this.stopScan();
  }
  async startScan() {
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats,
      lensFacing: this.lensFacing,
    };

    const squareElementBoundingClientRect = this.squareElement?.nativeElement.getBoundingClientRect();
    const scaledRect = squareElementBoundingClientRect
      ? {
        left: squareElementBoundingClientRect.left * window.devicePixelRatio,
        right: squareElementBoundingClientRect.right * window.devicePixelRatio,
        top: squareElementBoundingClientRect.top * window.devicePixelRatio,
        bottom: squareElementBoundingClientRect.bottom * window.devicePixelRatio,
        width: squareElementBoundingClientRect.width * window.devicePixelRatio,
        height: squareElementBoundingClientRect.height * window.devicePixelRatio,
      }
      : undefined;
    const detectionCornerPoints = scaledRect
      ? [
        [scaledRect.left, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top + scaledRect.height],
        [scaledRect.left, scaledRect.top + scaledRect.height],
      ]
      : undefined;
    const listener = await BarcodeScanner.addListener('barcodesScanned',
      async (event: any) => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcode.cornerPoints;
          if (detectionCornerPoints && cornerPoints) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          listener.remove();
          this.closeModal(event.barcode);
        });
      },
    );
    
    await BarcodeScanner.startScan(options);

    void BarcodeScanner.getMinZoomRatio().then((result) => {
      this.minZoomRatio = result.zoomRatio;
    });
    void BarcodeScanner.getMaxZoomRatio().then((result) => {
      this.maxZoomRatio = result.zoomRatio;
    });
  }
  stopScan() {
    document.querySelector('body')?.classList.remove('barcode-scanning-active');
  }
  setZoomRatio(event: InputCustomEvent): void {
    if (!event.detail.value) {
      return;
    }
    BarcodeScanner.setZoomRatio({
      zoomRatio: parseInt(event.detail.value as any, 10),
    });
  }
  async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }
  async closeModal(barcode?: Barcode): Promise<void> {
    this.dialog.dismissModal({
      barcode: barcode,
    });
  }

}
