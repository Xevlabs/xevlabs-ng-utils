import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'xevlabs-ng-utils-comment-control',
    templateUrl: './comment-control.component.html',
    styleUrls: ['./comment-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CommentControlComponent),
            multi: true,
        },
    ],
})
export class CommentControlComponent implements OnInit, AfterViewInit {

    commentControl!: FormControl
    @Input() busy!: boolean
    @Output() submitEvent = new EventEmitter<string>()

    onChange!: (comment: string) => void
    onTouched!: () => void

    constructor(
        private formBuilder: FormBuilder
    ) { }

    registerOnChange(fn: (comment: string) => void): void {
        this.onChange = fn
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn
    }

    writeValue(comment: string) {
        this.commentControl.setValue(comment)
    }

    ngOnInit(): void {
        this.commentControl = this.formBuilder.control('')
    }

    ngAfterViewInit() {
        this.commentControl.valueChanges.pipe(untilDestroyed(this)).subscribe((comment: string) => {
            this.onChange(comment)
        })
    }

    submit(): boolean {
        this.submitEvent.emit(this.commentControl.value)
        return false
    }

}
