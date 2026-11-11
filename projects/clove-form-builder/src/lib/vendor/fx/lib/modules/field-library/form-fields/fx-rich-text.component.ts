import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FxSetting, FxStringSetting, FxValidation } from '../../../classes';
import { FxValidatorService } from '../../../services';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormControl, FormsModule } from '@angular/forms';
import { FxValidationProcessorComponent } from '../../form-processor/fx-validation-processor.component';
import { FxComponent } from '../../form-builder';
import {
  AccessibilityHelp,
  Alignment,
  AutoLink,
  Autosave,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  Paragraph,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Underline,
  Undo
} from 'ckeditor5';
import { FxBaseComponent } from '../../../core';

@Component({
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule, FxValidationProcessorComponent, FxComponent],
  selector: 'fx-rich-text',
  template: `
    <fx-component [fxData]="fxData" *ngIf="fxData && formControl">
      <label>{{ setting('label') }}</label>
      <ckeditor [editor]="editor" [(ngModel)]="fxData.value" (change)="formControl.patchValue(fxData.value)" [config]="config" #me></ckeditor>
      <fx-validation-processor *ngIf="fxData.validations"
                               [control]="formControl"
                               [element]="fxData"></fx-validation-processor>
    </fx-component>

  `
})
export class FxRichTextComponent extends FxBaseComponent{

  public config: any =  {
    toolbar: {
      items: [
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'blockQuote',
        '|',
        'alignment',
        '|',
        'indent',
        'outdent'
      ],
      shouldNotGroupWhenFull: true
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      AutoLink,
      Autosave,
      BlockQuote,
      Bold,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      Indent,
      IndentBlock,
      Italic,
      Link,
      Paragraph,
      SelectAll,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Underline,
      Undo
    ],
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4'
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5'
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6'
        }
      ]
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    placeholder: 'Enter your text here'
  };
  public editor = ClassicEditor;

  formControl?: FormControl;

  constructor(public cdr: ChangeDetectorRef) {
    super(cdr);
    this.onInit.subscribe(fxData=>{
      this.fxData.events = null;
      this.formControl = new FormControl<any>(fxData.value);
      this._register(this.formControl);
    })
  }

  protected settings(): FxSetting[] {
    return [new FxStringSetting({
      key: 'label',
      $title: 'Label',
      value: 'Default Label'
    })];
  }

  protected validations(): FxValidation[] {
    return [FxValidatorService.required];
  }

}

