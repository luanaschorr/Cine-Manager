import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FilmeService, Filme } from './filme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly title = 'CineVibe';

  filmes: Filme[] = [];
  carregando = true;
  erro = false;
  busca = '';
  generoSelecionado = 'Todos';
  filmeSelecionado: Filme | null = null;
  readonly postersIndisponiveis = new WeakSet<Filme>();

  constructor(private readonly filmeService: FilmeService) {}

  ngOnInit(): void {
    this.carregarFilmes();
  }

  get generos(): string[] {
    return ['Todos', ...new Set(this.filmes.map((filme) => filme.genero).filter(Boolean))];
  }

  get filmesFiltrados(): Filme[] {
    const termo = this.busca.trim().toLocaleLowerCase('pt-BR');
    return this.filmes.filter((filme) => {
      const correspondeAoGenero = this.generoSelecionado === 'Todos'
        || filme.genero === this.generoSelecionado;
      const correspondeABusca = `${filme.titulo} ${filme.genero} ${filme.sinopse}`
        .toLocaleLowerCase('pt-BR')
        .includes(termo);

      return correspondeAoGenero && correspondeABusca;
    });
  }

  carregarFilmes(): void {
    this.carregando = true;
    this.erro = false;
    this.filmeService.listar().subscribe({
      next: (dados) => {
        this.filmes = dados;
        this.carregando = false;
      },
      error: (erro: unknown) => {
        console.error('Não foi possível carregar o catálogo de filmes.', erro);
        this.erro = true;
        this.carregando = false;
      }
    });
  }

  abrirDetalhes(filme: Filme): void {
    this.filmeSelecionado = filme;
  }

  fecharDetalhes(): void {
    this.filmeSelecionado = null;
  }

  marcarPosterIndisponivel(filme: Filme): void {
    this.postersIndisponiveis.add(filme);
  }
}