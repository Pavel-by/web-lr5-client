import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ShareComponentInfo} from '../../shares/share/share.component';
import {Share} from '../../shares/shares.service';
import {Member} from '../members.service';

export class MemberComponentInfo {
  current: Member = new Member();
  editor: Member = new Member();
  disabled = false;
  error: string;
  change = new EventEmitter();
}

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.less']
})
export class MemberComponent implements OnInit, OnDestroy {
  @Input() member: MemberComponentInfo;
  @Input() legend: string;
  @Input() canDelete: boolean;
  @Input() canRefresh: boolean;
  @Output() save: EventEmitter<MemberComponentInfo> = new EventEmitter();
  @Output() delete: EventEmitter<MemberComponentInfo> = new EventEmitter();
  @Input() cardClass: string;
  editing = false;

  private subscription: Subscription;

  constructor(private changesDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onInputChanged();
    this.subscription = this.member.change.subscribe(() => {
      this.changesDetector.detectChanges();
      this.onInputChanged();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onInputChanged(): void {
    const newEditing = !this.member.current.equalTo(this.member.editor);

    if (newEditing === this.editing) {
      return;
    }

    this.editing = newEditing;
    this.changesDetector.detectChanges();
  }
}
