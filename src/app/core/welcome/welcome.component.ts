import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { ReceiveIpInfo, SendIpInfo } from '../_models/ipInfo';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  ipInfo: SendIpInfo = {
    username: '',
    ipaddress: '',
    countrycode: '',
    countryname: '',
    regioncode: '',
    regionname: '',
    city: '',
    zipcode: '',
    timezone: '',
    latitude: 0,
    longitude: 0,
    sessionId: ''
  };

  constructor(private auth: AuthService) { }

  ngOnInit() {
    /* this.saveIpInfo(); */
  }

  /* saveIpInfo() {
    this.auth.getClientLocation().subscribe( (res: ReceiveIpInfo) => {
      console.log(res);
      this.ipInfo.city = res.city;
      this.ipInfo.countrycode = res.countryCode;
      this.ipInfo.countryname = res.country;
      this.ipInfo.ipaddress = res.query;
      this.ipInfo.latitude = res.lat;
      this.ipInfo.longitude = res.lon;
      this.ipInfo.regioncode = res.region;
      this.ipInfo.regionname = res.regionName;
      this.ipInfo.timezone = res.timezone;
      this.ipInfo.zipcode = res.zip;
      this.ipInfo.username = '';

      this.auth.saveCustLocation(this.ipInfo)
        .subscribe( result => {
          console.log(result);
        });
    }, err => {
      console.log(err);
    });
  } */


}
