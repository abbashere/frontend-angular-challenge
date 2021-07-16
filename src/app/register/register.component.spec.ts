import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { By } from 'protractor';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService;

  mockUserService = jasmine.createSpyObj('UserService', ['getAll', 'delete', 'register', 'edit']);

  const mockAuthenticationService = {
    currentUserSubject : new BehaviorSubject<User>(JSON.parse('{"id":1,"username":"TestUserName","firstName":"TestFirstName","lastName":"TestLname","token":"test-fake-jwt-token"}')),
    get currentUserValue(): User {
      return this.currentUserSubject.value;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthenticationService, useValue: mockAuthenticationService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be load form with date according to user id passed', () => {
    component.urlId = 1;
    mockUserService.getAll.and.returnValue(of(
      [
        { id: 1, username: 'username1', firstName:'firstName1', lastName: 'lastName1'},
        { id: 2, username: 'username2', firstName:'firstName2', lastName: 'lastName2'},
        { id: 3, username: 'username3', firstName:'firstName3', lastName: 'lastName3'},
        { id: 4, username: 'username4', firstName:'firstName4', lastName: 'lastName4'}
    ]
    ));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.registerForm.value).toEqual({firstName: 'firstName1', lastName: 'lastName1', username: 'username1', password: null})
  });

  it('should be load form with empty date if user id not passed', () => {
    component.urlId = null;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.registerForm.value).toEqual({firstName: '', lastName: '', username: '', password: ''})
  });

  it('should call the register method and navigate to login if form already filled', () => {
    component.registerForm.controls['firstName'].setValue('first name');
    component.registerForm.controls['lastName'].setValue('last name');
    component.registerForm.controls['username'].setValue('admin');
    component.registerForm.controls['password'].setValue('admin123');
    mockUserService.register.withArgs(component.registerForm.value).and.returnValue(of({}));
    const routerstub: Router = TestBed.get(Router);
    spyOn(routerstub, 'navigate');
    component.onSubmit();
    fixture.detectChanges();
    expect(routerstub.navigate).toHaveBeenCalledWith(['/login']);
    expect(mockUserService.register).toHaveBeenCalledWith(component.registerForm.value);
  });

  it('after onUpdate it should be navigate home', () => {
      component.registerForm.controls['firstName'].setValue('first name');
      component.registerForm.controls['lastName'].setValue('last name');
      component.registerForm.controls['username'].setValue('admin');
      component.registerForm.controls['password'].setValue('admin123');
      component.urlId = 1;
      mockUserService.edit.withArgs(component.urlId,component.registerForm.value).and.returnValue(of({}));
      component.onUpdate();
      fixture.detectChanges();
      expect(mockUserService.edit).toHaveBeenCalledWith(component.urlId, component.registerForm.value);
  });

  it('after onUpdate it should be navigate home', () => {
    component.registerForm.controls['firstName'].setValue('first name');
    component.registerForm.controls['lastName'].setValue('last name');
    component.registerForm.controls['username'].setValue('admin');
    component.registerForm.controls['password'].setValue('admin123');
    component.urlId = 1;
    mockUserService.edit.withArgs(component.urlId,component.registerForm.value).and.returnValue(of({}));
    component.onUpdate();
    fixture.detectChanges();
    expect(mockUserService.edit).toHaveBeenCalledWith(component.urlId, component.registerForm.value);
  });

  it('getUserDetailById should be filter date correctly', () => {
    let dataUser = [
      { id: 1, username: 'username1', firstName:'firstName1', lastName: 'lastName1'},
      { id: 2, username: 'username2', firstName:'firstName2', lastName: 'lastName2'},
      { id: 3, username: 'username3', firstName:'firstName3', lastName: 'lastName3'},
      { id: 4, username: 'username4', firstName:'firstName4', lastName: 'lastName4'}
    ];
    const filterData = component.getUserDetailById(1, dataUser);
    expect(filterData).toEqual({ id: 1, username: 'username1', firstName:'firstName1', lastName: 'lastName1'});
  });


});
