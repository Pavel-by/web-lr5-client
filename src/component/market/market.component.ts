import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Market, MarketService} from './market.service';
import {UtilsService} from '../app/utils.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.less']
})
export class MarketComponent implements OnInit{
  start: string;
  end: string;
  recomputeDuration: number;
  loaded = false;
  error: string;

  constructor(private marketService: MarketService, private utils: UtilsService, private changesDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.marketService.get().then(value => {
      if (value == null) {
        this.error = 'Не удалось получить данные с сервера';
        return;
      }

      this.loaded = true;
      this.start = this.utils.dateToLocal(value.start);
      this.end = this.utils.dateToLocal(value.end);
      this.recomputeDuration = value.recomputeDuration;
      this.changesDetector.detectChanges();
    });
  }

  save(): void {
    const market = new Market();
    market.update({
      start: this.start,
      end: this.end,
      recomputeDuration: this.recomputeDuration
    });
    this.marketService.save(market).subscribe(
      value => {
        this.error = null;
      },
      error => {
        this.error = `Не удалось сохранить данные`;
      }
    );
  }
}
