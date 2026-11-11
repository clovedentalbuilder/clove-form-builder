import { AfterViewInit, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FxMode, FxNonDataFieldComponent, FxSetting } from '../../../classes';
import { FormsModule } from '@angular/forms';
import {
  AccessibilityHelp,
  Alignment,
  AutoLink,
  Autosave,
  BalloonEditor,
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
} from 'ckeditor5';
import { SafeHtmlPipe } from '../../../../../isl-core';
import { FxComponent } from '../../form-builder';

@Component({
  standalone: true,
  imports: [CommonModule, CKEditorModule, FormsModule, SafeHtmlPipe, FxComponent],
  selector: "fx-rich-text-editor",
  template: `
    <fx-component [fxData]="fxData">
      <ng-container *ngIf="fxData.$fxForm?.$mode == FxMode.EDIT; else viewMode">
        <div
          class="fx-rich-text-typography-element -mx-2"
          title="click here to edit" >
          <ng-container>
            <!--<div class="ck-content" [innerHTML]="fxData.value | safeHtml"></div>-->
            <ckeditor [editor]="editor" [(ngModel)]="fxData.value" [config]="config"></ckeditor>
          </ng-container>
        </div>
      </ng-container>

      <ng-template #viewMode>
        <div class="ck-content" [innerHTML]="fxData.value | safeHtml"></div>
      </ng-template>
    </fx-component>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None
})
export class FxRichTextEditorComponent extends FxNonDataFieldComponent implements AfterViewInit{
  public config: any =  {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
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
        'highlight',
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
    placeholder: 'Type or paste your content here!'
  };
  public editor = BalloonEditor;

  protected isEditorEnable: boolean = false;

  constructor() {
    super();
  }

  protected settings(): FxSetting[] {
    return [];
  }

  ngAfterViewInit() {}

  protected readonly FxMode = FxMode;
}

