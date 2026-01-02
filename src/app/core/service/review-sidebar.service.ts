import {
    ApplicationRef,
    ComponentRef,
    Injectable,
    createComponent,
    EnvironmentInjector
} from '@angular/core';
import { ReviewSidebarComponent } from 'src/app/pages/component/review-sidebar/review-sidebar.component';


@Injectable({ providedIn: 'root' })
export class ReviewSidebarService {

    private componentRef?: ComponentRef<ReviewSidebarComponent>;

    constructor(
        private appRef: ApplicationRef,
        private injector: EnvironmentInjector
    ) { }

    open(
        initialReview: string,
        onSubmit: (text: string) => void
    ) {
        if (this.componentRef) return;

        this.componentRef = createComponent(ReviewSidebarComponent, {
            environmentInjector: this.injector
        });

        // 👇 lo mismo para ambos modales
        this.componentRef.instance.review = initialReview;

        this.componentRef.instance.submit.subscribe(text => {
            onSubmit(text);
            this.close();
        });

        this.componentRef.instance.close.subscribe(() => this.close());

        document.body.appendChild(this.componentRef.location.nativeElement);
        this.appRef.attachView(this.componentRef.hostView);
    }

    close() {
        if (!this.componentRef) return;

        this.appRef.detachView(this.componentRef.hostView);
        this.componentRef.destroy();
        this.componentRef = undefined;
    }
}