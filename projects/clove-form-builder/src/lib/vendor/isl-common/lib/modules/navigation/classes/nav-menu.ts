import {NavLink} from "./nav-link";

export class NavMenu{

  public navLinks: NavLink[];
  constructor(navLinks: NavLink[]) {
    this.navLinks = this.buildFullyQualifiedLinks(navLinks, '');
  }

  private buildFullyQualifiedLinks(navLinks: NavLink[], basePath: string): NavLink[] {
    return navLinks.map(link => {

      if(!link.state) link.state = 'active';

      const fullPath = link.path ? `${basePath}/${link.path}`.replace(/\/+/g, '/') : basePath; // Normalize paths
      const updatedLink: NavLink = { ...link, routerLink: fullPath }; // Update the link with full path in routerLink

      // Recursively build child links if they exist
      if (link.children) {
        updatedLink.children = this.buildFullyQualifiedLinks(link.children, fullPath);
      }

      return updatedLink;
    });
  }

}

