import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params, RoutesRecognized } from '@angular/router';
import { AppConfig } from '../app-config';
import { HttpService } from '../service/http.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
    /*Variable decalration*/
    showlogin;
    userlogin;
    forgotlogin;
    resetlogin;
    loginmsg;
    forgotpasswordmsg;
    forgotpasswordmsgsuccess;
    loginerrmsg;
    forgotsuccessmsg;
    forgoterrmsg;
    resetpasswordmsg;
    reseterrmsg;
    uname;
    resetpasswordmsgsuccess;
    showreset;
    showforgot;
    showresetsuccess;
    status;
    APIUrl;
    forgotpassworderr;

    /*emit upon loggedin*/
    @Output() checkLogin: EventEmitter<any> = new EventEmitter();

    /*Toggle Login and forgot password*/
    showForgotPassword() {
        this.showlogin = false;
    }

    /*Handles login function*/
    loginUser(data) {
        if (!data.value.username || !data.value.password) {
            this.loginmsg = true;
            this.loginerrmsg = "Invalid user name or password!!!"
        }

        if (data.status == 'INVALID') {
            return;
        }

        if (data.value.username || data.value.password) {
            /*var loginUrl = this.APIUrl+"/login";*/
            var loginUrl = "/login";
            var secretKey = 'princexml';
            var password = CryptoJS.AES.encrypt(data.value.password, secretKey).toString();
            var inputReq = {
                username : data.value.username, password : password
                // username: data.value.username, password: data.value.password
            };
            this.httpService.restPost({ 'url': loginUrl, 'params': inputReq }).subscribe((responseData: any) => {
                var response = responseData;
                if (response && response.user && response.user.status == 'success') {
                    let currentUser = response.user;
                    currentUser['token'] = response.token;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    this.checkLogin.emit(response);
                } else {
                    this.loginmsg = true;
                    this.loginerrmsg = 'Username or Password is incorrect';
                }
            });
            /*this.http.post(loginUrl, inputReq).
              subscribe((data) => {
                var response = data.json();
                  if(response.status == 'success'){
                      let currentUser = { username: response.username,userid: response.userid,userrole: response.userrole, token:'fake-jwt-token' };
                      localStorage.setItem('currentUser', JSON.stringify(currentUser));
                      this.checkLogin.emit(response);
                  } else {
                  
                      this.loginerrmsg = 'Username or Password is incorrect';
                  }
              })*/
        }
    }

    showloginfn() {
        this.showlogin = true;
        this.showforgot = false;
        this.showreset = false;
        this.showresetsuccess = false;
        this.router.navigate(['/']);
    }

    /*Handles forgot password function*/
    forgotPassword(data) {
        if (!data.value.username) {
            this.forgotpasswordmsg = true;
            this.forgoterrmsg = "Please enter user name !!!"
        }
        if (data.status == 'INVALID') {
            return;
        }
        var encodedString = btoa(data.value.username);
        var passUrl = this.APIUrl + "/forgotpassfn";
        /* var passUrl = "/forgotpassfn";*/
        var inputReq = {
            username: data.value.username, enc: encodedString
        }
        this.http.post(passUrl, inputReq).
            subscribe((data) => {
                var response = data.json();
                if (response.status == 'success') {
                    this.forgotpasswordmsgsuccess = true;
                    this.forgotsuccessmsg = "We have a Reset password link, Sent to your Email ID"
                } else {
                    this.forgotpasswordmsgsuccess = false;
                    this.forgotpasswordmsg = true;
                    this.forgoterrmsg = "Invalid user name !!!"
                }
            })
    }

    /*Handles forgot password function*/
    resetPassword(data) {
        if (!data.value.confirmpassword) {
            this.resetpasswordmsg = true;
            this.reseterrmsg = "Please enter retype password !!!";
        }
        if (!data.value.password) {
            this.resetpasswordmsg = true;
            this.reseterrmsg = "Please enter password !!!";
        }

        if (data.status == 'INVALID') {
            return;
        }
        var decryptval = atob(this.uname);
        var secretKey = 'princexml';
        var password = CryptoJS.AES.encrypt(data.value.password, secretKey).toString();

        var passUrl = this.APIUrl + "/resetpassfn";
        var inputReq = {
            username: decryptval, password: password
            // username: decryptval, password: data.value.password
        }
        this.http.post(passUrl, inputReq).
            subscribe((data) => {
                var response = data.json();
                if (response.status == 'success') {
                    // this.resetpasswordmsgsuccess = true;
                    //  this.resetsuccessmsg = "Password has been reset successfully!!!"
                    // this.router.navigateByUrl(['/resetpassword/success'])
                    this.router.navigate(['/passwordreset', 'success']);
                } else {
                    this.resetpasswordmsgsuccess = false;
                    this.resetpasswordmsg = true;
                    this.reseterrmsg = "Problem while processing, Please try again later!!!"
                }
            })
    }

    pwdMatchValidator(frm: FormGroup) {
        return frm.get('password').value === frm.get('confirmpassword').value
            ? null : { 'mismatch': true };
    }

    private sub: any;
    constructor(private httpService: HttpService, private http: Http, private route: ActivatedRoute, private router: Router, public appConfig: AppConfig) {
        this.APIUrl = appConfig.config.apiURL;
        console.log(this.httpService, " rest service data");
    }
    ngOnInit() {
        this.showlogin = true;
        this.loginmsg = false;
        this.forgotpasswordmsg = false;
        this.forgotpasswordmsgsuccess = false;

        this.router.events.subscribe(val => {
            if (val instanceof RoutesRecognized) {
                if (val.state.root.firstChild) {
                    var params = val.state.root.firstChild.params;
                    if (params.uname) {
                        this.showlogin = false;
                        this.showforgot = false;
                        this.showreset = true;
                        this.showresetsuccess = false;
                        this.uname = params.uname;
                    } else if (params.status) {
                        this.showlogin = false;
                        this.showforgot = false;
                        this.showreset = false;
                        this.showresetsuccess = true;
                        this.status = params.status;
                    }
                }
            }
        });

        this.userlogin = new FormGroup({
            username: new FormControl("", Validators.compose([
                Validators.required
            ])),
            password: new FormControl("", Validators.compose([
                Validators.required
            ]))
        });
        this.forgotlogin = new FormGroup({
            username: new FormControl("", Validators.compose([
                Validators.required
            ]))
        });

        this.resetlogin = new FormGroup({
            password: new FormControl("", Validators.compose([
                Validators.required
            ])),
            confirmpassword: new FormControl(null, [Validators.required])
        }, this.pwdMatchValidator);
    }
}