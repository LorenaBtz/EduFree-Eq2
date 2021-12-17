import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
export class BackendService {
  rootUrl = 'http://localhost:3000/';
  token = '';
  constructor(private http: HttpClient
    ) {
    const tk = localStorage.getItem('tk');
    if (tk) {
      this.token = tk;
    }
   }

  getRequest(url: string): Observable<any> {
    return this.http.get(
      this.rootUrl + url,
      {
        headers: { 'Authorization': `Bearer ${this.token}` }
      }
      );
  }

  postRequest(controlador: string,datos: string): Observable<any> {
    const url = this.rootUrl + controlador;
    return this.http.post(
      url,
      datos, {
      headers: { 'content-type': 'application/json','Authorization': `Bearer ${this.token}`}
    });
  }

  patchRequest(controlador: string, id:string, datos: string): Observable<any> {
    const url = `${this.rootUrl}/${controlador}/${id}`;
    return this.http.patch(
      url,
      datos, {
      headers: { 'content-type': 'application/json','Authorization': `Bearer ${this.token}`}
    });
  }

  deleteRequest(controlador: string, id:string): Observable<any> {
    const url = `${this.rootUrl}/${controlador}/${id}`;
    return this.http.delete(
      url,{
      headers: { 'content-type': 'application/json','Authorization': `Bearer ${this.token}`}
    });
  }


  autenticar(credenciales: string): Observable<any> {
    /*const filter = '{"where":'+credenciales+'}';
    const filterEncode=encodeURIComponent(filter);
    return this.http.get(this.rootUrl + 'usuarios?filter='+filterEncode);*/

    return this.http.post(
      this.rootUrl + 'autenticar',
      credenciales,
      {
        headers: { 'content-type': 'application/json','Authorization': `Bearer ${this.token}`}
      }
    );
  }

  getRequestFilter(controlador: string, filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);

    return this.http.get(
      `${this.rootUrl}/${controlador}`,
      {
        headers: { 'content-type': 'application/json','Authorization': `Bearer ${this.token}`},
        params: params
      }
    );
  }

}

export interface GroupUserAttr {
  nombre: string,
  id: string
}
