import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-review-sidebar',
  templateUrl: './review-sidebar.component.html',
  styleUrls: ['./review-sidebar.component.css']
})
export class ReviewSidebarComponent {

  @Input() review = '';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  closePanel() {
    this.close.emit();
  }

  send() {
    if (!this.review.trim()) return;
    this.submit.emit(this.review);
  }
}