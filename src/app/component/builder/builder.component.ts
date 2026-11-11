import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FxBuilderWrapperComponent, FxForm, FxUtils, ApiServiceRegistry } from 'clove-form-builder';

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [CommonModule, FxBuilderWrapperComponent],
  template: `
  <fx-builder-wrapper [fx-form]="fxForm"></fx-builder-wrapper>
  `,
})
export class BuilderComponent implements OnInit {
  public fxForm: FxForm = FxUtils.createNewForm();
  public variables: any;

  private fxApiRegistryService = inject(ApiServiceRegistry)
  public ngOnInit(): void {
    this.fxApiRegistryService.registerService({
      service: 'User Service',
      url: 'http://local.prm2.com:9007',
      name: 'User Service',
      swagger_url: '/v3/api-docs',
      description: 'User Service APIs'
    })
  }
}
