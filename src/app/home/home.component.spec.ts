import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../services/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockUserService;

  mockUserService = jasmine.createSpyObj('UserService', ['getAll', 'delete']);
  const mockAuthenticationService = {
    currentUserSubject : new BehaviorSubject<User>(JSON.parse('{"id":1,"username":"TestUserName","firstName":"TestFirstName","lastName":"TestLname","token":"test-fake-jwt-token"}')),
    get currentUserValue(): User {
      return this.currentUserSubject.value;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        HomeComponent
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthenticationService, useValue: mockAuthenticationService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should load component correctly', () => {
    expect(component).toBeTruthy();
  });

  it('should load user with passed date, test with 4 records', () => {
    mockUserService.getAll.and.returnValue(of(
      [
        { id: 1, username: 'username1', lastName: 'lastName1', "token":"fake-jwt-token1" },
        { id: 2, username: 'username2', lastName: 'lastName2', "token":"fake-jwt-token2" },
        { id: 3, username: 'username3', lastName: 'lastName3', "token":"fake-jwt-token3" },
        { id: 4, username: 'username4', lastName: 'lastName4', "token":"fake-jwt-token4" }
    ]
    ));
    fixture.detectChanges();
    expect(component.users.length).toBe(4);
  });

  it('it should delete user if delete method called', () => {
    mockUserService.getAll.and.returnValue(of(
      [
        { id: 1, username: 'username1', lastName: 'lastName1', "token":"fake-jwt-token1" },
        { id: 2, username: 'username2', lastName: 'lastName2', "token":"fake-jwt-token2" },
        { id: 3, username: 'username3', lastName: 'lastName3', "token":"fake-jwt-token3" }
      ]
    ));
    mockUserService.delete.withArgs(1).and.returnValue(of({}));
    component.deleteUser(1);
    fixture.detectChanges();
    expect(component.users.length).toBe(3);
  });

  it('should load with Title text passed into auth service current user mock', () => {
    mockUserService.getAll.and.returnValue(of(
      [
        { id: 1, username: 'username1', lastName: 'lastName1', "token":"fake-jwt-token1" },
        { id: 2, username: 'username2', lastName: 'lastName2', "token":"fake-jwt-token2" },
        { id: 3, username: 'username3', lastName: 'lastName3', "token":"fake-jwt-token3" },
        { id: 4, username: 'username4', lastName: 'lastName4', "token":"fake-jwt-token4" }
    ]
    ));
    fixture.detectChanges();
    let elm = <HTMLElement>fixture.elementRef.nativeElement;
    expect(elm.innerHTML).toContain('Hi TestFirstName!');
    expect(mockAuthenticationService.currentUserValue.username).toEqual('TestUserName');
  });


});
