import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AppGlobal {
  public Api = environment.apiUrl;
  public ApiKey = environment.apiKey;
  public Version = environment.version;
  public Integration = !environment.production;
  public Environment = environment.environmentTitle;
}