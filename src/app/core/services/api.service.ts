import { inject, Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  global = inject(AppGlobal);
  baseUrl = `${inject(AppGlobal).Api}/api`;

  constructor() { }

  private post = async (url: string, params: any) => {
    const options: HttpOptions = {
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.global.ApiKey,
      },
      data: params
    };

    const response = await CapacitorHttp.post(options);

    if (response.status == 200) {
      return response.data;
    }

    return Promise.reject(response);
  }

  validarToken(params: any) {
    return this.post(`${this.baseUrl}/v1/validar-token`, params);
  }

  validarCorreo(params: any) {
    return this.post(`${this.baseUrl}/v1/validar-correo`, params);
  }

}
