import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../home/home.component';
import {MarketComponent} from '../market/market.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MarketService} from '../market/market.service';
import {SharesComponent} from '../shares/shares.component';
import {ShareComponent} from '../shares/share/share.component';
import {MembersComponent} from '../members/members.component';
import {MemberComponent} from '../members/member/member.component';

const routes: Routes = [
  {path: '', redirectTo: 'market', pathMatch: 'full'},
  {path: 'market', component: MarketComponent},
  {path: 'shares', component: SharesComponent},
  {path: 'members', component: MembersComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MarketComponent,
    SharesComponent,
    ShareComponent,
    MembersComponent,
    MemberComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    // MarketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
