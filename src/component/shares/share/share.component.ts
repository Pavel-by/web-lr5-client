import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Share, SharesService} from '../shares.service';
import {Subscription} from 'rxjs';

export class ShareComponentInfo {
  current: Share = new Share();
  editor: Share = new Share();
  disabled = false;
  error: string;
  change = new EventEmitter();
}

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.less']
})
export class ShareComponent implements OnInit, OnDestroy {
  @Input() share: ShareComponentInfo;
  @Input() legend: string;
  @Input() canRefresh: boolean;
  @Input() canDelete: boolean;
  @Output() save: EventEmitter<ShareComponentInfo> = new EventEmitter();
  @Output() delete: EventEmitter<ShareComponentInfo> = new EventEmitter();
  @Input() cardClass: string;
  editing = false;

  private subscription: Subscription;

  constructor(private changesDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onInputChanged();
    this.subscription = this.share.change.subscribe(() => {
      this.changesDetector.detectChanges();
      this.onInputChanged();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onInputChanged(): void {
    const newEditing = !this.share.current.equalTo(this.share.editor);

    if (newEditing === this.editing) {
      return;
    }

    this.editing = newEditing;
    this.changesDetector.detectChanges();
  }
}
