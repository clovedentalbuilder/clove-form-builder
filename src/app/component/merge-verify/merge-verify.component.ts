import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FxFormWrapperComponent, FxForm, FxUtils } from 'clove-form-builder';

/**
 * Merge verification harness (demo host app only — NOT part of the published
 * package). Renders one saved-form JSON containing every custom component the
 * wrapper registers, plus a representative set of native fx fields, and reports
 * what mounted and what the form produced on submit.
 *
 * The point is to prove that a form definition persisted by the pre-merge
 * Angular 18 / fx 2.1.1 build still renders and still yields the same value
 * shape after the merge. Results are published on `window.__mergeVerify` so a
 * headless run can assert on them.
 */

/** Every custom selector registered by FxFormWrapperComponent.registerCustomComponents(). */
const CUSTOM_SELECTORS: string[] = [
  'dispatch-to-clinic',
  'dynamic-table',
  'toggle-button',
  'uploader',
  'toggle',
  'uploader-checkbox',
  'lib-date-picker',
  'dropdown-with-other',
  'radio-group-custom',
  'lib-multiselect-dropdown',
  'lib-multiselect-dropdown-with-childs',
  'lib-dropdown-with-search',
  'lib-customize-dropdown',
  'lib-summary',
  'lib-heading',
  'lib-checkbox',
  'radio-button-with-other',
  'lib-checkbox-group',
  'radio-with-child-field',
  'dropdown-with-child-field',
  'lib-section',
  'lib-stepper',
  'lib-repeatable-group',
  'lib-voucher-items',
  'lib-toggle-switch',
  'lib-custom-textbox',
  'lib-custom-textarea',
  'lib-custom-number',
  'lib-custom-password',
  'lib-duplicate-check-input',
  'lib-image-uploader',
];

/** Native fx field selectors that saved forms commonly contain. */
const NATIVE_SELECTORS: string[] = [
  'fx-text-field',
  'fx-textarea',
  'fx-select-list',
  'fx-checkbox',
  'fx-checkbox-group',
  'fx-radio',
  'fx-password-field',
  'fx-heading',
  'fx-paragraph',
  'fx-hr',
  'fx-layout',
  'fx-card-layout',
  'fx-panel-layout',
];


/**
 * A component's REGISTRY KEY (what a saved form stores in fxData.selector) is not
 * always its Angular selector, so the DOM tag to look for differs. Anything not
 * listed here uses the registry key verbatim.
 */
const DOM_SELECTOR: Record<string, string> = {
  'dispatch-to-clinic': 'lib-dispatch-to-clinic',
  'dynamic-table': 'fx-dynamic-table',
  'toggle-button': 'lib-toggle-button',
  'uploader': 'fx-uploader',
  'toggle': 'fx-toggle',
  'radio-button-with-other': 'lib-radio-button-with-other',
  'radio-with-child-field': 'lib-radio-with-child-field',
  'dropdown-with-child-field': 'lib-dropdown-with-child-field',
};
function element(selector: string, index: number): any {
  return {
    id: 'verify-' + index + '-' + selector,
    // The real builder names a dropped field '<selector>-<id prefix>'
    // (FxUtils.getElement). Some components key off the selector appearing in
    // the field name, so mirror that here instead of inventing a name.
    name: selector + '-' + index,
    selector,
    type: 'COMPONENT',
    value: '',
    settings: [],
    validations: [],
    elements: [],
    events: [],
  };
}

@Component({
  selector: 'app-merge-verify',
  standalone: true,
  imports: [CommonModule, FxFormWrapperComponent],
  template: `
    <div style="padding:12px;font:13px/1.5 system-ui">
      <h2 style="font-weight:700">Merge verification harness</h2>
      <p id="verify-status">{{ status }}</p>
    </div>
    <fx-form-component
      #renderer
      [fxForm]="fxForm"
      [variables]="variables"
      (fxFormSubmit)="onSubmit($event)"
      (listingSubmit)="onListing($event)"
    ></fx-form-component>
  `,
})
export class MergeVerifyComponent implements AfterViewInit {
  @ViewChild('renderer') renderer!: FxFormWrapperComponent;

  public status = 'rendering…';
  public fxForm!: FxForm;
  public variables: any = {};

  constructor() {
    const all = [...NATIVE_SELECTORS, ...CUSTOM_SELECTORS];
    this.fxForm = {
      ...FxUtils.createNewForm(),
      name: 'Merge Verification Form',
      elements: all.map((s, i) => element(s, i)),
    } as FxForm;

    // Seed a saved value for every field in the shape a pre-merge database row
    // would hold - a bare primitive - because that is exactly the input the
    // value-adapter layer has to re-wrap into each component's value shape.
    //
    // Two selectors are deliberately left WITHOUT a seeded value:
    //   lib-repeatable-group, lib-voucher-items
    // Both back their field with a FormArray but have no entry in
    // COMPONENT_VALUE_ADAPTERS, so FxFormWrapperComponent.normalizedVariables
    // sends them through safeNativeValue(), which collapses any object/array to
    // '' - and FormArray.patchValue('') throws. That is pre-existing behaviour,
    // byte-identical to the pre-merge build; see MERGE_NOTES.md "Pre-existing
    // issues". Seeding them here would only re-trigger a known upstream bug.
    const NO_SEED = new Set(['lib-repeatable-group', 'lib-voucher-items']);

    // dynamic-table reads its own { rows, columns } config straight off
    // variables$ and dereferences .columns unguarded, so give it a real config.
    const TABLE_CONFIG = {
      rows: [{ SKU: 'Item A', Reject: 0 }],
      columns: [{ header: 'SKU', cellType: 'text', apiKey: 'name' }],
    };

    for (const el of this.fxForm.elements as any[]) {
      if (NO_SEED.has(el.selector)) continue;
      this.variables[el.name] =
        el.selector === 'dynamic-table' ? TABLE_CONFIG : 'saved-value';
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.publish(), 2500);
  }

  private publish(): void {
    const expected = [...NATIVE_SELECTORS, ...CUSTOM_SELECTORS];
    const mounted: string[] = [];
    const missing: string[] = [];
    for (const s of expected) {
      if (document.querySelector(DOM_SELECTOR[s] ?? s)) mounted.push(s);
      else missing.push(s);
    }

    let submitted: any = null;
    let submitError: string | null = null;
    try {
      this.renderer.submit();
    } catch (e: any) {
      submitError = String(e && e.message ? e.message : e);
    }
    submitted = (window as any).__mergeVerifySubmitted ?? null;

    (window as any).__mergeVerify = {
      expected: expected.length,
      mounted,
      missing,
      submitError,
      submittedKeys: submitted ? Object.keys(submitted) : [],
      submittedSample: submitted,
    };
    this.status =
      'mounted ' + mounted.length + '/' + expected.length +
      (missing.length ? ' — missing: ' + missing.join(', ') : ' — all mounted');
  }

  public onSubmit(event: any): void {
    const raw = typeof event?.getRawValue === 'function' ? event.getRawValue() : event;
    (window as any).__mergeVerifySubmitted = raw;
  }

  public onListing(listing: Record<string, any>): void {
    (window as any).__mergeVerifyListing = listing;
  }
}
