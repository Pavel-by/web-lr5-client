import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {MemberComponentInfo} from './member/member.component';
import {MembersService} from './members.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.less']
})
export class MembersComponent implements OnInit, OnDestroy {
  members: Array<MemberComponentInfo> = [];
  editingMember: MemberComponentInfo = new MemberComponentInfo();
  error: string;
  loading: true;

  private subscription: Subscription;

  constructor(private membersService: MembersService, private changesDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.subscription = this.membersService.members.subscribe(members => {
      if (members == null) {
        this.error = 'Не удалось загрузить данные';
        return;
      }

      let filteredMembers = this.members.filter(member =>
        members.find(actualMember => actualMember._id === member.current._id)
      );
      filteredMembers = filteredMembers.map(info => {
        const actualMember = members.find(member => member._id === info.current._id);
        if (info.current.equalTo(info.editor)) {
          info.current.update(actualMember);
          info.editor.update(actualMember);
        } else {
          info.current.update(actualMember);
        }
        return info;
      });
      filteredMembers.push(...members
        .filter(actualMember => !filteredMembers.find(filteredMember => filteredMember.current._id === actualMember._id))
        .map(member => {
          const info = new MemberComponentInfo();
          info.current.update(member);
          info.editor.update(member);
          return info;
        })
      );
      filteredMembers.forEach((member) => {
        member.change.emit();
      });
      this.members = filteredMembers;
      this.changesDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSave(info: MemberComponentInfo): void {
    info.disabled = true;
    this.membersService.update(info.editor).then(success => {
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
    this.editingMember.disabled = true;
    this.membersService.add(this.editingMember.editor).then(success => {
      if (success) {
        this.editingMember = new MemberComponentInfo();
      } else {
        this.editingMember.disabled = false;
        this.editingMember.error = `Не удалось сохранить параметры`;
      }
      this.editingMember.change.emit();
      this.changesDetector.detectChanges();
    });
  }

  onDelete(info: MemberComponentInfo): void {
    info.disabled = true;
    this.membersService.delete(info.editor).then(success => {
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
