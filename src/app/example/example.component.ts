import { Component, OnInit } from '@angular/core';
import { FundService } from '../core/_services/fund.service';
import { FormControl } from '@angular/forms';
/* import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap'; */

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
/*   queryField: FormControl = new FormControl();
  results: any;
  selected: any;
 */
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;


  constructor(private fs: FundService) {
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      this.fs.getSchemes(this.asyncSelected)
        .subscribe( (schemes: Array<any>) => {
          observer.next(schemes);
        });
    });
  }

  ngOnInit() {
    /* this.queryField.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((query) => this.fs.getSchemes(query))
        .subscribe( (schemes: Array<any>) => {
          this.results = schemes;
        }); */
  }

  /* getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');

    return Observable.of(
      this.statesComplex.filter((state: any) => {
        return query.test(state.name);
      })
    );
  } */

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.item.code);
  }

}
