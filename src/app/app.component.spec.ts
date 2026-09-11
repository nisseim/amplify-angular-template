import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodosComponent } from './todos/todos.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'amplify-angular-template' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('amplify-angular-template');
  });

  it('should render the login redirect screen', () => {
    spyOn(TodosComponent.prototype, 'ngOnInit').and.resolveTo();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-todos h3')?.textContent).toContain('リダイレクト中');
  });
});
