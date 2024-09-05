import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../module/shared.module';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { FormField } from '../../datatypes/DataTypes';
import { ApiService } from '../../service/api/api-service.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() fields: any[] = [];
  @Input() formData: any = {};
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter();

  form: FormGroup = new FormGroup({});
  filteredFields: any[] = [];
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  base: string = 'http://localhost:5238/';
  modalClass: string = '';
  oldFormData: any = {}; // Store the initial form data
  hasChanges: boolean = false; // Track if there are changes

  constructor(
    private fb: FormBuilder,
    private el: ElementRef,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.detectModalClass();
    this.form.valueChanges.subscribe(() => this.updateHasChanges());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formData'] && changes['formData'].currentValue !== changes['formData'].previousValue) {
      this.updateFormValues();
      this.initializeFileUrl();
      this.updateHasChanges(); // Ensure to check for changes after data update
    }
  }

  detectModalClass() {
    const modalElement = this.el.nativeElement.closest('.modal-dialog');
    if (modalElement) {
      this.modalClass =
        modalElement.classList.contains('modal-md') || modalElement.classList.contains('modal-sm')
          ? 'col-12'
          : modalElement.classList.contains('modal-lg')
          ? 'col-lg-6 col-xl-6  col-12'
          : 'col-lg-4 col-xl-4  col-12';
    }
  }

  close() {
    this.onClose.emit();
  }

  initializeForm() {
    this.filteredFields = this.fields.filter((field: FormField) => field.type !== 'file');
    const controls: { [key: string]: FormControl } = {};

    this.filteredFields.forEach((field) => {
      controls[field.model] = new FormControl(this.formData[field.model] || null, this.getValidators(field));
    });

    this.form = this.fb.group(controls);
    this.oldFormData = { ...this.formData };
    this.updateFormValues();
    this.updateHasChanges();
  }

  updateFormValues() {
    if (this.formData) {
      for (const key in this.formData) {
        if (this.form.contains(key)) {
          this.form.get(key)?.setValue(this.formData[key], { emitEvent: false });
        }
      }
    }
  }

  initializeFileUrl() {
    const fileField = this.fields.find((field) => field.type === 'file');
    if (fileField && this.formData) {
      this.fileUrl = this.formData[fileField.model] ? `${this.base}${this.formData[fileField.model]}` : 'assets/images/user/avatar-2.jpg';
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    this.fileUrl = URL.createObjectURL(this.selectedFile);
    this.updateHasChanges();
  }

  getValidators(field: any): ValidatorFn | null {
    return field.required ? Validators.required : null;
  }

  submitForm() {
    if (this.form.valid && this.hasChanges) {
      const formValue = { ...this.form.value };
      const fileField = this.fields.find((field) => field.type === 'file');

      if (fileField) {
        formValue[fileField.model] = this.formData[fileField.model];
      }

      const payload = this.selectedFile && fileField ? { ...formValue, NewFile: this.selectedFile } : formValue;

      this.onSave.emit(payload);
    }
  }

  updateHasChanges() {
    console.log({...this.form.value });
    
    const formValue = { ...this.form.value };
    const fileField = this.fields.find((field) => field.type === 'file');

    if (fileField) {
      formValue[fileField.model] = this.formData[fileField.model];
    }

    for (const key in formValue) {
      if (formValue[key] != this.oldFormData[key]) {
        this.hasChanges = true;
        return;
      }
    }

    this.hasChanges = false;
  }
}
