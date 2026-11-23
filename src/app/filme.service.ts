import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Filme {
  id?: number;
  titulo: string;
  genero: string;
  sinopse: string;
  imagemUrl?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FilmeService {
  private apiUrl = 'http://localhost:8080/api/filmes';

  constructor(private http: HttpClient) { }

  listar(): Observable<Filme[]> {
    return this.http.get<Filme[]>(this.apiUrl);
  }

  salvar(filme: Filme): Observable<Filme> {
    return this.http.post<Filme>(this.apiUrl, filme);
  }
}