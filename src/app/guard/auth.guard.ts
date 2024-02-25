import { inject, Injectable } from "@angular/core"
import { GithubServiceService } from "../service/github-service.service"
import { Router, CanActivate } from '@angular/router';
@Injectable()
export class AuthGuardService implements CanActivate {
    decision: boolean = false
    constructor(public githubService: GithubServiceService, public router: Router) { }
    canActivate(): boolean {
        this.githubService.currentauth.subscribe((msg: any) => {
            // console.log('msg', msg);
            if (msg) {
                // console.log('msg', msg);
                this.decision = true;

            } else {
                // console.log('msfalseg', msg);
                this.decision = false;
                this.router.navigate(['/login'])
            }


        });
        // console.log(this.decision, 'databj')
        return this.decision

    }
}