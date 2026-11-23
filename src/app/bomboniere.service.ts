import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bomboniere {
  id: number;
  item_nome: string;
  descricao: string;
  vlr_unit: number;
  imagemname: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BomboniereService {
  private readonly apiUrl = 'http://localhost:8080/api/bomboniere';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Bomboniere[]> {
    return this.http.get<Bomboniere[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Bomboniere> {
    return this.http.get<Bomboniere>(`${this.apiUrl}/${id}`);
  }

  calcularSubtotal(id: number, quantidade: number): Observable<number> {
    const params = new HttpParams().set('quantidade', quantidade.toString());
    return this.http.get<number>(`${this.apiUrl}/${id}/subtotal`, { params });
  }
}