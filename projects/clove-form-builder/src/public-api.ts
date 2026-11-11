/*
 * Public API Surface of clove-form-builder
 */

export * from './lib/fx-builder-wrapper.service';
export * from './lib/fx-builder-wrapper.component'; // builder // admin
export * from './lib/components/fx-form-component/fx-form-component.component'; // form preview

/*
 * ---------------------------------------------------------------------------
 * Merged fx engine (was the separate `@instantsys-labs/fx` package).
 *
 * These re-exports are ADDITIVE: nothing above changed. They exist so that
 * consumers who used to write
 *
 *     import { FxForm, FxUtils } from '@instantsys-labs/fx';
 *     import { ApiServiceRegistry } from '@instantsys-labs/core';
 *
 * can switch to
 *
 *     import { FxForm, FxUtils, ApiServiceRegistry }
 *       from '@clovedentalbuilder/clove-form-builder';
 *
 * without any other change. The symbol names, shapes and runtime behaviour are
 * identical to fx 2.1.1 / core 1.0.1.
 *
 * `@instantsys-labs/common` stays internal — fx 2.1.1 never re-exported it and
 * the wrapper never depended on it directly.
 * ---------------------------------------------------------------------------
 */
export * from './lib/vendor/fx';
export * from './lib/vendor/isl-core';

// isl-common's PopupService (the builder's Clear-confirm / alerts). Exported so a host can call
// PopupService.init(viewContainerRef, toaster) with its own toaster; FxBuilderWrapperComponent
// falls back to initialising it itself when no host has.
export { PopupService } from './lib/vendor/isl-common';
