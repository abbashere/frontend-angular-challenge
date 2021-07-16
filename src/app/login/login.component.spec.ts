import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { LoginComponent } from './login.component';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from '../app.component';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let spy: any;
  let el: HTMLElement;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const mockAuthenticationService = {
    currentUserSubject : new BehaviorSubject<User>(JSON.parse('{"id":1,"username":"TestUserName","firstName":"TestFirstName","lastName":"TestLname","token":"test-fake-jwt-token"}')),
    get currentUserValue(): User {
      return this.currentUserSubject.value;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to The HRS Angular Coding Challenge!');
  });

  it('should set onSubmit to true', async(() => {
    component.onSubmit();
    expect(component.onSubmit).toBeTruthy();
  }));

  it('should call the onSubmit method', () =>{
    fixture.detectChanges();
    spyOn(component,'onSubmit');
    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });


  it('form should be invalid', async(()=> {
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  }));

  it('form should be valid', async(()=> {
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('admin123');
    expect(component.loginForm.valid).toBeTruthy();
  }));

  it('login function should called if form is valid', async(()=> {
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('admin123');
    const spyLogin = spyOn(component.authenticationService, 'login').and.returnValue(of({"test":"test"}));
    component.onSubmit();
    fixture.detectChanges();
    expect(spyLogin).toHaveBeenCalledTimes(1);
  }));

});
