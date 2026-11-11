import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavLink, NavMenu } from '../classes';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _navigations = new BehaviorSubject<Map<string, NavMenu>>(new Map<string, NavMenu>());
  private _breadCrumbs = new BehaviorSubject<Map<string, NavLink[]>>(new Map<string, NavLink[]>());

  public navigations: Observable<Map<string, NavMenu>> = this._navigations.asObservable();
  public breadCrumbs: Observable<Map<string, NavLink[]>> = this._breadCrumbs.asObservable();


  constructor(private router: Router) {
    // Subscribe to route changes (NavigationEnd events)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs();
      });

    this._navigations.subscribe(value => {
      this.buildBreadcrumbs();
    });

  }

  // Method to build breadcrumbs based on the current route
  private buildBreadcrumbs(): void {
    const currentUrl = this.router.url;
    const updatedBreadcrumbs = new Map<string, NavLink[]>();

    // Iterate over navigations to build breadcrumbs
    this._navigations.value.forEach((navMenu, key) => {
      updatedBreadcrumbs.set(key, this.buildBreadCrumb(currentUrl, navMenu));
    });

    this._breadCrumbs.next(updatedBreadcrumbs);
  }

  private buildBreadCrumb(routerLink: string, menu: NavMenu): NavLink[] {
    let bestBreadcrumbs: NavLink[] = [];
    let maxScore = -1;

    // Call the recursive function to find the best matching path
    this.findBestMatchingLink(menu.navLinks, routerLink, [], 0, (breadcrumbs, score) => {
      if (score > maxScore) {
        maxScore = score;
        bestBreadcrumbs = breadcrumbs;
      }
    });

    return bestBreadcrumbs;
  }

  // Recursive function to find the best matching NavLink
  private findBestMatchingLink(
    navLinks: NavLink[],
    routerLink: string,
    breadcrumbs: NavLink[],
    score: number,
    updateBestMatch: (breadcrumbs: NavLink[], score: number) => void
  ): void {
    for (const link of navLinks) {
      if (link.divider) continue;

      // Calculate score for current link match (based on the length of the match and path depth)
      const matchScore = routerLink.startsWith(link.routerLink!) ? link.routerLink!.length : 0;

      if (matchScore > 0) {
        const currentBreadcrumbs = [...breadcrumbs, link];
        const currentScore = score + matchScore;

        // Update best match if this is the best score so far
        updateBestMatch(currentBreadcrumbs, currentScore);

        // If the matched link has children, continue searching in its children
        if (link.children) {
          this.findBestMatchingLink(link.children, routerLink, currentBreadcrumbs, currentScore, updateBestMatch);
        }
      }
    }
  }

  public registerNavigation(name: string, navMenu: NavMenu): void {
    const updatedNavigations = new Map(this._navigations.value);
    updatedNavigations.set(name, navMenu);
    this._navigations.next(updatedNavigations);
  }

}

