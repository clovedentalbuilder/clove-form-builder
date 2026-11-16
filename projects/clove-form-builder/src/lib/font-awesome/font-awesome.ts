import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';

/**
 * Font Awesome for the builder / renderer, loaded from the cdnjs CDN.
 *
 * Upstream fx/common used `@instantsys-labs/icons` (Font Awesome **Pro**, commercial licence) which
 * this package does not redistribute. These helpers load the **free** Font Awesome 6 build plus the
 * v4 shims (the engine still writes v4 names such as `fa-hand-o-right`) and a small fallback sheet
 * that maps the handful of Pro-only glyphs the engine uses onto free look-alikes.
 *
 * Hosts that already ship a licensed Font Awesome Pro build should NOT use these — Pro renders the
 * original glyphs and the fallback sheet would replace them.
 *
 * Keep {@link CLOVE_FONT_AWESOME_PRO_FALLBACK_CSS} in sync with `src/styles/fa-icon.css`.
 */

export const CLOVE_FONT_AWESOME_VERSION = '6.7.2';

const CDN_BASE = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${CLOVE_FONT_AWESOME_VERSION}/css`;

/** A stylesheet to load; `integrity` is the SRI hash (cdnjs-published) and is optional. */
export interface CloveFontAwesomeStylesheet {
  href: string;
  integrity?: string;
}

/** The default CDN stylesheets: Font Awesome Free (all styles) + the v4 name shims. */
export const CLOVE_FONT_AWESOME_STYLESHEETS: readonly CloveFontAwesomeStylesheet[] = [
  {
    href: `${CDN_BASE}/all.min.css`,
    integrity: 'sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==',
  },
  {
    href: `${CDN_BASE}/v4-shims.min.css`,
    integrity: 'sha512-U+fiq69HDM4etLVUiZeQxmJE5AZoft4ti4TIM95MqXV0IjBXgT2oHw5cNeIFqz3OE/axTKQIR8e7zlm3xbOVmg==',
  },
];

/**
 * Free-build stand-ins for the Font Awesome Pro classes the bundled engine uses.
 * - Pro style prefixes (`fa-thin`, `fa-light`, `fa-duotone`, `fa-sharp`) → free solid.
 * - Pro-only icon names → the closest free glyph.
 */
export const CLOVE_FONT_AWESOME_PRO_FALLBACK_CSS = `
.fa-thin,.fa-light,.fa-duotone,.fa-sharp,.fat,.fal,.fad{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:var(--fa-display,inline-block);font-style:normal;font-variant:normal;line-height:1;text-rendering:auto;font-family:"Font Awesome 6 Free";font-weight:900}
.fa-thin::before,.fa-light::before,.fa-duotone::before,.fa-sharp::before,.fat::before,.fal::before,.fad::before{content:var(--fa)}
.fa-table-layout{--fa:"\\f0db"}
.fa-list-tree{--fa:"\\f0ca"}
.fa-head-side-brain{--fa:"\\f5dc"}
.fa-ballot-check{--fa:"\\f14a"}
.fa-circle-dashed{--fa:"\\f1ce"}
.fa-arrow-turn-left{--fa:"\\f3e5"}
.fa-slash-forward{--fa:"\\f054"}
.fa-spinner-third{--fa:"\\f1ce"}
.fa-trophy-alt{--fa:"\\f091"}
`;

export interface CloveFontAwesomeOptions {
  /** Stylesheets to load instead of the default cdnjs ones (e.g. a self-hosted mirror). */
  stylesheets?: readonly CloveFontAwesomeStylesheet[];
  /** Inject {@link CLOVE_FONT_AWESOME_PRO_FALLBACK_CSS}. Default `true`. */
  proFallbacks?: boolean;
}

const MARKER_ATTR = 'data-clove-font-awesome';

/**
 * Adds the Font Awesome `<link>` tags (and the Pro fallback `<style>`) to `<head>`.
 * Idempotent — calling it again, or alongside {@link provideCloveFontAwesome}, adds nothing twice.
 */
export function loadCloveFontAwesome(doc: Document, options: CloveFontAwesomeOptions = {}): void {
  const head = doc?.head;
  if (!head) {
    return;
  }

  for (const sheet of options.stylesheets ?? CLOVE_FONT_AWESOME_STYLESHEETS) {
    if (head.querySelector(`link[${MARKER_ATTR}="${sheet.href}"]`)) {
      continue;
    }
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = sheet.href;
    link.setAttribute(MARKER_ATTR, sheet.href);
    if (sheet.integrity) {
      link.integrity = sheet.integrity;
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';
    }
    head.appendChild(link);
  }

  if ((options.proFallbacks ?? true) && !head.querySelector(`style[${MARKER_ATTR}="pro-fallbacks"]`)) {
    const style = doc.createElement('style');
    style.setAttribute(MARKER_ATTR, 'pro-fallbacks');
    style.textContent = CLOVE_FONT_AWESOME_PRO_FALLBACK_CSS;
    head.appendChild(style);
  }
}

/**
 * Loads Font Awesome (free, from the CDN) when the application starts:
 *
 * ```ts
 * providers: [provideCloveFontAwesome()]
 * ```
 *
 * Every `fa fa-*` class then works in the builder, the renderer and the host app itself.
 */
export function provideCloveFontAwesome(options: CloveFontAwesomeOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => loadCloveFontAwesome(inject(DOCUMENT), options)),
  ]);
}
