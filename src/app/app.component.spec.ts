import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { FilmeService } from './filme.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{
        provide: FilmeService,
        useValue: { listar: () => of([]) }
      }]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'CineVibe' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('CineVibe');
  });

  it('should render the simplified catalog heading', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#catalog-title')?.textContent).toContain('Catálogo de filmes');
  });

  it('should display the movie poster provided by the API', () => {
    const posterUrl = 'https://example.com/poster.jpg';
    const filmeService = TestBed.inject(FilmeService);
    spyOn(filmeService, 'listar').and.returnValue(of([{
      titulo: 'Filme de teste',
      genero: 'Drama',
      sinopse: 'Sinopse de teste',
      imagemUrl: posterUrl
    }]));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const poster = fixture.nativeElement.querySelector('.movie-poster img') as HTMLImageElement;
    expect(poster.getAttribute('src')).toBe(posterUrl);
  });
});
