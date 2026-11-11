import { Routes } from '@angular/router';
import { BuilderComponent } from './component/builder/builder.component';
import { FormComponent } from './component/form/form.component';
import { TableComponent } from './component/table/table.component';
import { FormTestComponent } from './component/form-test/form-test.component';
import { MergeVerifyComponent } from './component/merge-verify/merge-verify.component';

export const routes: Routes = [
    {
        path: 'builder',
        component: BuilderComponent
    },
    {
        path: 'form',
        component: FormComponent
    },
    {
        path: 'dynamic-table',
        component: TableComponent
    },
    {
        path: 'form-test',
        component: FormTestComponent
    },
    {
        // Demo-host-only merge verification harness. Renders every registered
        // custom component plus the native fx fields from one saved-form JSON.
        path: 'merge-verify',
        component: MergeVerifyComponent
    },
];
