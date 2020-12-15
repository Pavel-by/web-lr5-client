import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Share, SharesService} from './shares.service';
import {ShareComponentInfo} from './share/share.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shares',
  templateUrl: './shares.component.html',
  styleUrls: ['./shares.component.less']
})
export class SharesComponent implements OnInit, OnDestroy {
  shares: Array<ShareComponentInfo> = [];
  editingShare: ShareComponentInfo = new ShareComponentInfo();
  error: string;
  loading: true;

  private subscription: Subscription;

  constructor(private sharesService: SharesService, private changesDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscription = this.sharesService.shares.subscribe(shares => {
      if (shares == null) {
        this.error = 'Не удалось загрузить данные';
        return;
      }

      let filteredShares = this.shares.filter(share =>
        shares.find(actualShare => actualShare._id === share.current._id)
      );
      filteredShares = filteredShares.map(info => {
        const actualShare = shares.find(share => share._id === info.current._id);
        if (info.current.equalTo(info.editor)) {
          info.current.update(actualShare);
          info.editor.update(actualShare);
        } else {
          info.current.update(actualShare);
        }
        return info;
      });
      filteredShares.push(...shares
        .filter(actualShare => !filteredShares.find(filteredShare => filteredShare.current._id === actualShare._id))
        .map(share => {
          const info = new ShareComponentInfo();
          info.current.update(share);
          info.editor.update(share);
          return info;
        })
      );
      filteredShares.forEach((share) => {
        share.change.emit();
      });
      this.shares = filteredShares;
      this.changesDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSave(info: ShareComponentInfo): void {
    info.disabled = true;
    this.sharesService.update(info.editor).then(success => {
      info.disabled = false;

      if (success) {
        info.editor.update(info.current);
        info.error = null;
      } else {
        info.error = 'Не удалось сохранить параметры';
      }
      info.change.emit();
      this.changesDetector.detectChanges();
    });
  }

  onAdd(): void {
    this.editingShare.disabled = true;
    this.sharesService.add(this.editingShare.editor).then(success => {
      if (success) {
        this.editingShare = new ShareComponentInfo();
      } else {
        this.editingShare.disabled = false;
        this.editingShare.error = `Не удалось сохранить параметры`;
      }
      this.editingShare.change.emit();
      this.changesDetector.detectChanges();
    });
  }

  onDelete(info: ShareComponentInfo): void {
    info.disabled = true;
    this.sharesService.delete(info.editor).then(success => {
      info.disabled = false;

      if (success) {
        info.editor.update(info.current);
        info.error = null;
      } else {
        info.error = 'Не удалось удалить объект';
      }
      info.change.emit();
      this.changesDetector.detectChanges();
    });
  }
}
