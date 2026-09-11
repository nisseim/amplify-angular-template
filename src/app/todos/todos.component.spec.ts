import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { liff } from '@line/liff';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not log credential-bearing SDK errors', async () => {
    spyOn(liff, 'isInClient').and.returnValue(true);
    spyOn(liff, 'init').and.rejectWith({
      message: 'audit-only-token',
      config: { headers: { Authorization: 'Bearer audit-only-token' } },
    });
    const errorLog = spyOn(console, 'error');

    await component.ngOnInit();

    expect(errorLog).toHaveBeenCalledOnceWith('LIFF 初期化エラー');
  });
});
