import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  count: number;
  @ViewChild('template') modal: TemplateRef<any>;

  useremail: any;
  username: String;
  isRegister: Boolean;
  isLoggedIn: Boolean;

  modalRef: BsModalRef;

  okay: Boolean = false;

  constructor(private auth: AuthService, private router: Router, private userIdle: UserIdleService, private modalService: BsModalService) {

    if (performance.navigation.type === 1) {
      /* this.logout(); */
    } else {
      console.log('Not Reloaded');
    }

    (<any>window).onhashchange = () => {
      this.logout();
      return false;
    };

    this.auth.getLoggedInName.subscribe( (state: Boolean) => {
      this.isLoggedIn = state;
      console.log('loginState', state);
      if (state) {
        this.auth.getUser().subscribe((user: any) => {
          this.username = user.name;
          this.useremail = user.email;
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          // Start watching for user inactivity.
          this.userIdle.startWatching();
        });
      } else {
        this.stopWatching();
      }
      /* this.auth.getUser().subscribe(user => {
        this.username = user.name;
      }); */
    });
  }

  ngOnInit() {

    // Start watching when user idle is starting.

    this.userIdle.onTimerStart().subscribe(count => {
      if (this.isLoggedIn) {
        console.log(count);
        this.count = 30 - count;
        if (count === 1) {
          this.openModal(this.modal);
        }
      }
    });
    // Stop watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      console.log('Time is up!');
      this.modalService.hide(1);
      this.userIdle.stopWatching();
      this.logout();
    });

    /* if (window.performance) {
      console.log("window.performance works fine on this browser");
    } */
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  logout() {
    this.stopWatching();
    this.modalService.hide(1);
    if (this.auth.getAuthState()) {
      const userObj = {
        'email': this.auth.getUserFromSession().username
      };
      console.log('1', userObj);
      this.auth.logOut(userObj).subscribe((resp) => {
        this.auth.signOut().subscribe((data) => {
          this.auth.logOutSub();
          this.router.navigateByUrl('/user/login');
        }, err => {
          this.auth.logOutSub();
          this.router.navigateByUrl('/user/login');
          /* this.modalService.hide(1); */
        });
      }, err => {
        this.auth.logOutSub();
        this.router.navigateByUrl('/user/login');
      });
    } else {
      this.auth.logOutSub();
      this.router.navigateByUrl('/user/login');
    }
  }

  goToSignUp() {
    this.router.navigateByUrl('/user/register');
    this.isRegister = true;
  }
  goToLogin() {
    this.router.navigateByUrl('/user/login');
    this.isRegister = false;
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    console.log('I was called');
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
    this.modalService.hide(1);
  }

}
