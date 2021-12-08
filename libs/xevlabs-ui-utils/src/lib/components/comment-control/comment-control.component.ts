import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SnackBarService, SnackBarTypeEnum } from '@xevlabs-ng-utils/xevlabs-snackbar'

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
        {
            provide: NG_VALIDATORS,
            useExisting: CommentControlComponent,
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
        private formBuilder: FormBuilder,
        private snackbarService: SnackBarService,
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
        this.commentControl = this.formBuilder.control('', Validators.required)
    }

    ngAfterViewInit() {
        this.commentControl.valueChanges.pipe(untilDestroyed(this)).subscribe((comment: string) => {
            this.onChange(comment)
        })
    }

    validate() {
        return this.commentControl.invalid ? { invalid: true } : null
    }

    submit() {
        if (this.commentControl.valid) {
            this.submitEvent.emit(this.commentControl.value)
        } else {
            this.snackbarService.showSnackBar(SnackBarTypeEnum.ERROR, 'ERRORS.INVALID_FORM')
        }
    }

}
