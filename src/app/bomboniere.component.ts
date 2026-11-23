import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Bomboniere, BomboniereService } from './bomboniere.service';
// import { PedidoService } from './pedido.service';

@Component({
  selector: 'app-bomboniere',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .bomboniere-page {
      max-width: 1120px;
      margin: 0 auto;
      padding: 28px 20px 120px;
    }

    .btn-finalizar {
      background-color: #16a34a;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s ease;
  }

  .btn-finalizar:hover {
    background-color: #15803d;
  }

    .bomboniere-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 28px;
    }

    .bomboniere-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 24px;
    }

    .bomboniere-card {
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 12px;
      overflow: hidden;
      padding: 16px;
      gap: 14px;
    }

    .bomboniere-img-wrap {
      width: 100%;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bomboniere-img {
      width: 100%;
      height: 180px;
      width: 100%;
      object-fit: cover;
      display: block;
    }

    .bomboniere-img-fallback {
      font-size: 0.9rem;
      opacity: 0.7;
      padding: 12px;
      text-align: center;
    }

    .bomboniere-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .bomboniere-desc {
      margin: 0;
      opacity: 0.85;
      flex: 1;
      line-height: 1.45;
    }

    .bomboniere-divider {
      border: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      margin: 2px 0;
    }

    .bomboniere-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .bomboniere-resumo-footer {
      position: sticky;
      bottom: 16px;
      margin-top: 32px;
      padding: 18px 22px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      background: rgba(24, 24, 27, 0.96);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .bomboniere-resumo-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .bomboniere-resumo-sub {
      font-size: 0.85rem;
      opacity: 0.78;
    }

    .bomboniere-resumo-total {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .bomboniere-acoes {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
  `],
  template: `
    <div class="bomboniere-page">
      <div class="bomboniere-header">
        <div>
          <h2 class="mb-1">Bomboniere</h2>
          <p class="text-muted mb-0">Escolha seus lanchinhos</p>
        </div>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="carregarItens()">
          Atualizar lista
        </button>
      </div>

      <div *ngIf="carregando" class="alert alert-info">
        Carregando itens da bomboniere...
      </div>

      <div *ngIf="erro" class="alert alert-danger">
        {{ erro }}
      </div>

      <div class="bomboniere-grid" *ngIf="!carregando && !erro">
        <article class="bomboniere-card" *ngFor="let item of itens">
          <div class="bomboniere-img-wrap">
            <img
              *ngIf="item.imagename && !imagensIndisponiveis.has(item.id)"
              class="bomboniere-img"
              [src]="'/bomboniere/' + item.imagename"
              [alt]="item.item_nome"
              loading="lazy"
              (error)="marcarImagemIndisponivel(item.id)"
            />
            <span
              *ngIf="!item.imagename || imagensIndisponiveis.has(item.id)"
              class="bomboniere-img-fallback"
            >
              {{ item.item_nome }}
            </span>
          </div>

          <div class="bomboniere-top">
            <h5 class="card-title mb-0">{{ item.item_nome }}</h5>
            <span class="badge bg-dark fs-6">
              {{ item.vlr_unit | currency:'BRL':'symbol':'1.2-2' }}
            </span>
          </div>

          <p class="bomboniere-desc">
            {{ item.descricao }}
          </p>

          <hr class="bomboniere-divider" />

          <div class="bomboniere-controls">
            <label class="form-label mb-0 small" [for]="'qtd-' + item.id">Quantidade:</label>
            <input
              [id]="'qtd-' + item.id"
              type="number"
              min="0"
              class="form-control form-control-sm"
              style="width: 88px;"
              [(ngModel)]="quantidades[item.id]"
              (ngModelChange)="normalizarQuantidade(item.id)"
            />
          </div>
        </article>
      </div>

      <div *ngIf="!carregando && !erro && itens.length === 0" class="alert alert-warning">
        Nenhum item encontrado na bomboniere.
      </div>

      <footer class="bomboniere-resumo-footer" *ngIf="!carregando && !erro">
        <div class="bomboniere-resumo-info">
          <span class="bomboniere-resumo-sub">
            Ingressos: {{ valorIngressos | currency:'BRL':'symbol':'1.2-2' }}
            <ng-container *ngIf="subtotalBomboniere > 0">
              · Bomboniere: {{ subtotalBomboniere | currency:'BRL':'symbol':'1.2-2' }}
            </ng-container>
          </span>
          <span class="bomboniere-resumo-total">
            Subtotal: {{ subtotal | currency:'BRL':'symbol':'1.2-2' }}
          </span>
        </div>

        <div class="bomboniere-acoes">
          <button
            *ngIf="subtotalBomboniere > 0"
            type="button"
            class="btn btn-outline-light btn-sm"
            (click)="limparQuantidades()"
          >
            Limpar seleção
          </button>

          <button
            type="button"
            class="btn btn-finalizar"
          >
            Finalizar compra
          </button>
        </div>
      </footer>
    </div>
  `
})
export class BomboniereComponent implements OnInit {
  itens: Bomboniere[] = [];
  quantidades: Record<number, number> = {};
  imagensIndisponiveis = new Set<number>();
  carregando = false;
  erro = '';
  valorIngressos = 0;

  constructor(
    private bomboniereService: BomboniereService,
    // private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    // this.pedidoService.ingressos$.subscribe((valor) => {
    //   this.valorIngressos = valor;
    // });

    this.carregarItens();
  }

  carregarItens(): void {
    this.carregando = true;
    this.erro = '';

    this.bomboniereService.listarTodos().subscribe({
      next: (dados) => {
        this.itens = dados;
        for (const item of dados) {
          if (this.quantidades[item.id] === undefined || this.quantidades[item.id] < 0) {
            this.quantidades[item.id] = 0;
          }
        }
        this.sincronizarSubtotal();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os itens da bomboniere. Verifique se o backend está rodando.';
        this.carregando = false;
      }
    });
  }

  normalizarQuantidade(id: number): void {
    const qtd = Number(this.quantidades[id]);
    if (Number.isNaN(qtd) || qtd < 0) {
      this.quantidades[id] = 0;
    } else {
      this.quantidades[id] = Math.floor(qtd);
    }
    this.sincronizarSubtotal();
  }

  limparQuantidades(): void {
    for (const item of this.itens) {
      this.quantidades[item.id] = 0;
    }
    this.sincronizarSubtotal();
  }

  get subtotalBomboniere(): number {
    const total = this.itens.reduce((acc, item) => {
      const qtd = this.quantidades[item.id] || 0;
      return acc + item.vlr_unit * qtd;
    }, 0);
    return Number(total.toFixed(2));
  }

  get subtotal(): number {
    const extraBomboniere = this.subtotalBomboniere > 0 ? this.subtotalBomboniere : 0;
    return Number((this.valorIngressos + extraBomboniere).toFixed(2));
  }

  marcarImagemIndisponivel(id: number): void {
    this.imagensIndisponiveis.add(id);
  }

  private sincronizarSubtotal(): void {
    // this.pedidoService.setSubtotalBomboniere(this.subtotalBomboniere);
  }
}