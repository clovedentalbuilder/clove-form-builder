import { inject, Injectable, Type } from '@angular/core';
import { ApiServiceRegistry } from './vendor/isl-core';
import { FxBaseComponent, FxComponentRegistryService, FxForm, FxUtils, FxValidatorService } from './vendor/fx';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FxBuilderWrapperService {
  public variables$ = new BehaviorSubject<any | null>(null);
  /** Current user's granted privileges, supplied by the consumer. Used by
   *  container components to compute editability at the package level. */
  public privileges: string[] = [];
  /** Consumer-supplied data bag for visibility rules/code (e.g. clinic type,
   *  feature flags). Used by container components alongside `privileges` to
   *  compute visibility at the package level. */
  public supportingData: any = {};
   private fxApiRegistryService = inject(ApiServiceRegistry)
  constructor(private fxComponentRegistry: FxComponentRegistryService) {
    // this.isolateValidationDefaults();
    this.tolerateNonElementComputedStyle();
  }

  /**
   * The fx library exposes each validation default as a SHARED static object
   * (FxValidatorService.required, .pattern, …). Every field of a type references
   * the same instance, so configuring one field's validation / error message
   * mutates it for ALL fields of that type. Redefine each static as a getter that
   * returns a fresh clone per access, so every field's validations() call yields
   * independent objects. Runs once (root singleton). */
  private static _validationsIsolated = false;
  private isolateValidationDefaults(): void {
    if (FxBuilderWrapperService._validationsIsolated) return;
    FxBuilderWrapperService._validationsIsolated = true;
    const svc: any = FxValidatorService as any;
    const keys = ['required', 'email', 'alphaOnly', 'numberOnly', 'pattern', 'minLength', 'maxLength', 'selectOne'];
    for (const key of keys) {
      const current = svc[key];
      if (!current || typeof current !== 'object') continue;
      const pristine = JSON.parse(JSON.stringify(current)); // capture defaults once
      try {
        Object.defineProperty(svc, key, {
          configurable: true,
          enumerable: true,
          get: () => JSON.parse(JSON.stringify(pristine)), // fresh copy every access
        });
      } catch {
        /* non-configurable / already patched — ignore */
      }
    }
  }

  /**
   * pdf.js (bundled by ng2-pdf-viewer) installs ONE global `selectionchange`
   * listener on `document` for the whole viewer, and inside it sniffs Firefox
   * via `getComputedStyle(<first entry of its static text-layer map>)`. Once a
   * PDF preview is torn down that map is empty, so the argument is `undefined`
   * and the handler throws "Failed to execute 'getComputedStyle' on 'Window':
   * parameter 1 is not of type 'Element'" on every text selection anywhere in
   * the app from then on (pdfjs-dist 4.8.69, pdf_viewer.mjs). The listener is a
   * closure over private static state, so there is no prototype to patch —
   * make the DOM API tolerant instead. A non-Element argument is always a
   * caller bug, so fall back to <html>: its computed `-moz-user-select` is
   * never 'none', so the sniff answers correctly and the rest of the handler
   * finishes as a no-op. Runs once (root singleton).
   */
  private static _getComputedStylePatched = false;
  private tolerateNonElementComputedStyle(): void {
    if (FxBuilderWrapperService._getComputedStylePatched) return;
    FxBuilderWrapperService._getComputedStylePatched = true;
    if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') return;
    const native = window.getComputedStyle.bind(window);
    // Duck-typed, not `instanceof Element`, so elements coming from an iframe's
    // document (a different realm) still take the native path.
    const isElement = (value: any): boolean => !!value && typeof value === 'object' && value.nodeType === 1;
    let warned = false;
    window.getComputedStyle = ((element: Element, pseudoElt?: string | null): CSSStyleDeclaration => {
      if (isElement(element)) return native(element, pseudoElt);
      if (!warned) {
        warned = true;
        console.warn('[fx-builder-wrapper] getComputedStyle() called with a non-Element; falling back to <html>.', element);
      }
      return native(document.documentElement, pseudoElt);
    }) as typeof window.getComputedStyle;
  }

  public setPrivileges(privileges: string[] | null | undefined): void {
    this.privileges = Array.isArray(privileges) ? privileges : [];
  }

  public setSupportingData(supportingData: any): void {
    this.supportingData = supportingData ?? {};
  }

  public registerCustomComponent(title: string, selector: string, component: Type<FxBaseComponent>
  ): void {
    this.fxComponentRegistry.registerComponent(selector, component, {
      registeringAs: "CUSTOM",
      libraryItem: {
        title,
        icon: 'fa-eye',
        fxData: {
          id: null,
          name: selector,
          value: "",
          selector: selector,
          elements: [],
          events: []
        }
      },
    })
  }

  public getComponent(selector: string): Type<FxBaseComponent> | undefined {
    return this.fxComponentRegistry.getComponent(selector);
  }

   public getInitializedFxForm(): FxForm {
      return FxUtils.createNewForm(); 
    }

    public setService(object:any){
      this.fxApiRegistryService.registerService(object)
    }
}
