import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  users = [];
  editUser: User;
  urlId = null;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService
  ) {
    // redirect to home if already logged in
    this.urlId = this.idFromUrl();
    if (this.authenticationService.currentUserValue && !this.urlId) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    if (this.urlId) {
      this.userService.getAll()
        .pipe(first())
        .subscribe(
          (users) => {
            this.users = users;
            this.editUser = this.getUserDetailById(this.urlId, this.users);
            this.registerForm = this.formBuilder.group({
              firstName: [this.editUser['firstName'], Validators.required],
              lastName: [this.editUser['lastName'], Validators.required],
              username: [this.editUser['username'], Validators.required],
              password: [this.editUser['password'], [Validators.required, Validators.minLength(6)]]
            });
          }
        );
      return;
    }
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
              this.router.navigate(['/login']);
            },
            error => {
              this.loading = false;
            });
  }

  idFromUrl() {
    const urlParts = this.router.url.split('/');
    return parseInt(urlParts[urlParts.length - 1]);
  }

  getUserDetailById(id, allUser) {
    for (var i = 0; i < allUser.length; i++) {
      if (allUser[i].id === id) {
        return allUser[i];
      }
    }
  }

  onUpdate () {
    this.userService.edit(this.urlId, this.registerForm.value) //this.editUser
        .pipe(first())
        .subscribe(
          () => this.router.navigate(['/'])
        );
  }

}
