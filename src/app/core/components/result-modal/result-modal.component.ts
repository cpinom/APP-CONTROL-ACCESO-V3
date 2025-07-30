import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
  standalone: false
})
export class ResultModalComponent implements OnInit {

  private dialog = inject(DialogService);
  data: any;
  

  constructor() { }

  ngOnInit() { }

  cerrar() {
    void this.dialog.dismissModal();
  }

}
