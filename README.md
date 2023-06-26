# XevlabsNgUtils

XevlabsNgUtils is an Angular library designed to simplify and accelerate the development of Angular web applications. Built using [Nx](https://nx.dev), it offers several tools for working with data provided by Strapi V4, including a flexible and easy-to-use table component, an autocomplete selector and an error handling service for Strapi calls. It also includes a variety of UI tools that help streamline the development process, including a snackbar service, a comment control component, and a confirmation modal component.

The XevlabsNgUtils library features the following sub-packages:
* ng-strapi-table-lib
* xevlabs-ng-strapi-utils
* xevlabs-snackbar
* xevlabs-strapi-error-handling
* xevlabs-ui-utils

# NG Strapi Table Lib

## How to use XevlabsNgUtils' Strapi Table Component
Strapi Table Component offers a template for generating a table with pagination and sorting features. It receives data from a Strapi-based API and uses Material Design components as well as Angular's Flex Layout module to display the table. It offers column templates and customizable action buttons that trigger events when clicked. It also supports row selection and navigation to a detail page. 
In this section we will go over the necessary steps to integrate this component in our Angular project and we will present the different options this component can take.
### Importing StrapiTableLib:
1. In your module, import StrapiTableLib as follows:
    ```
        import { NgStrapiTableLibModule } from '@xevlabs-ng-utils/xevlabs-strapi-table';
        ...
        @NgModule({
          declarations: [
            ...
          ],
          imports: [
            ...
            NgStrapiTableLibModule.forRoot({
              baseUrl: 'your-base-url',
            }),
          ]
        })
    ```
    Note that the base url should follow this pattern: `https://your-strapi-backend-domain.com/api`

### Datasource
The `datasource` is responsible for providing the data to the table and handling sorting and pagination events.

2. In your component, inject the StrapiTableService and define the table's datasource as follows:

    ```
      import { StrapiDatasource, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';
      ...
      
      @Component({
          ...
          providers: [StrapiTableService]
      })
      export class ExampleComponent {
        public dataSource: StrapiDatasource<CollectionModel>
      
        constructor(
          private tableService: StrapiTableService
        ) {
          this.dataSource = new StrapiDatasource<CollectionModel>(this.tableService, 'collection-name');
          }
      }
    ```
    `StrapiDatasource` is a custom class used to provide the data to be displayed in the table component. It integrates with the Strapi backend using the StrapiTableService. 
    
    In the code above we are creating an instance of the StrapiDatasource class which takes two arguments: a `StrapiTableService` instance and the name of the collection to fetch data from. The StrapiDatasource then uses the provided service to fetch data from the specified collection and convert it into an observable stream of items that can be consumed by the table. You can also define the returned data type of the table by specifying the generic type parameter of the StrapiDatasource class.
    
    This datasource will be later binded to the table's component's `datasource` input as follows:
    ```
    <xevlabs-ng-utils-strapi-table
        [dataSource]="dataSource"
     ></xevlabs-ng-utils-strapi-table>
    ```
    
### Columns Definition
3. Define your table's columns following the ColumnDefinitionModel model. The main fields to define are the following:
    - key: represents the name of the collection's field to be displayed in the table.
    - translationKey: represents the associated column's translation key you want to display in the table's header.
    - type: the field's value type. This field should be of type ColumnTypesEnum and it could be of type STRING, NUMBER, DATE, ENUM or TEMPLATE if you want to display a custom value. This type is also useful for displaying nested fields.
    - template: this field is necessary if you use the ColumnTypesEnum.TEMPLATE type. It takes an element of type TemplateRef.

    It's also worth noting that using `ColumnTypesEnum.TEMPLATE` type requires defining the columns in the `AfterContentChecked` lifecycle since the templates will not be available until after content projection has occurred. 
    Here's an example of the columns definition in this case: 
    ```
    import { AfterContentChecked, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
    import { ColumnDefinitionModel, ColumnTypesEnum, StrapiDatasource, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';
    ...
    
    @Component({
        ...
        providers: [StrapiTableService]
    })
    export class ExampleComponent implements AfterContentChecked {
      @ViewChild('template') nestedTemplate!: TemplateRef<any>
      public dataSource: StrapiDatasource<CollectionModel>
      public columnsDefinition: ColumnDefinitionModel[] = []
    
      constructor(
        private tableService: StrapiTableService,
        private cdr: ChangeDetectorRef
      ) {
        this.dataSource = new StrapiDatasource<CollectionModel>(this.tableService, 'collection-name');
      }
      
      ngAfterContentChecked(): void {
        this.columnsDefinition = [
          {
            key: 'text_field_key',
            translationKey: 'TEXT_FIELD_TRANSLATION_KEY',
            type: ColumnTypesEnum.STRING
          },
          {
            key: 'number_field_key',
            translationKey: 'NUMBER_FIELD_TRANSLATION_KEY',
            type: ColumnTypesEnum.NUMBER
          },
          {
            key: 'nested_collection.nested_text_field',
            translationKey: 'NESTED_TEXT_FIELD',
            type: ColumnTypesEnum.TEMPLATE,
            template: this.nestedTemplate
          },
          {
            key: 'updatedAt',
            translationKey: 'UPDATED_AT',
            type: ColumnTypesEnum.DATE
          }
        ]
        this.cdr.detectChanges();
       }
      }
    ```
    Adding ChangeDetectorRef's `detectChanges()` method in the AfterContentChecked lifecycle serves to force Angular to check for changes and update the view if necessary. 
    To define the nestedTemplate, define a separate ng-template element in the component's HTML file like the following example: 
    ```
    <ng-template #template let-entity="entity">
        {{
            entity.nested_collections?.data?.length && entity.nested_collections.data[0].attributes?.nested_text_field
                ? entity.nested_collections.data[0].attributes.nested_text_field
                : '--'
        }}
    </ng-template>
    ```
    Inside this template, we check if the entity's nested collection data is not empty and if the first item of this data has the attribute nested_text_field. If both conditions are true, it displays the value of the nested_text_field attribute. Otherwise, it displays --.
    To access the template, we define a `ViewChild` property as follows:
    ```
    @ViewChild('template') nestedTemplate!: TemplateRef<any>
    ```
    and then in the columnsDefinition array, we use the type: ColumnTypesEnum.TEMPLATE and the template property to reference the template. 
    Note that the key property should match the key of the nested field in the API response. Also, make sure that the nested_collections?.data?.length check is correct for your API response, as it may differ depending on the data structure. 
    
    Once we defined our columnsDefinition property, we can bind it to the table's component's `columnsDefinition` input as the following: 
    ```
    <xevlabs-ng-utils-strapi-table
        [dataSource]="dataSource"
        [columnsDefinition]="columnsDefinition"
    ></xevlabs-ng-utils-strapi-table>
    ```
### Action Buttons
4. Define the action buttons to pass to the table following the ActionButtonModel model. The main fields to define are the following:
    * type: specifies the type of the action button, it takes a value of type string and it serves to differentiate between the different actions passed to the table
    * color: specifies the color of the button. It's of type string and can take the following values 'primary', 'accent', 'warn'.
    * icon: specifies the icon to be displayed on the button. It takes a string with the material icon key as a value.
    * tooltipKey: specifies the translation key for the tooltip text that appears when the user hovers over the button.

    Here's an example with an action button array definition:
    ```
    public actionButtons: ActionButtonModel[] = [
        {
            type: 'edit',
            color: 'primary',
            icon: 'edit',
            tooltipKey: 'EDIT'
        },
        {
            type: 'delete',
            color: 'warn',
            icon: 'delete',
            tooltipKey: 'DELETE'
         }
      ]
    ```
    Clicking on these buttons on the table should trigger different actions based on the action button type. For this, we need to define a method that handles these actions. Here's an example: 
    ```
    actionButtonClicked(type: string, collectionItem: CollectionModel) {
        switch (type) {
            case 'delete':
                //handle delete action
            case 'edit':
                //handle edit action
            default:
                return
        }
    }
    ```
    And then bind this method with the table's component `actionToggled` output as follows:
    ```
    <xevlabs-ng-utils-strapi-table
        [dataSource]="dataSource"
        [columnsDefinition]="columnsDefinition"
        [actionButtons]="actionButtons"
        (actionToggled)="actionButtonClicked($event.type, $event.entity)"
    ></xevlabs-ng-utils-strapi-table>
    ```
    
### Filters
If the table needs filtering we can pass a `filters` property to the table component. `filters` should be an array of type `FilterModel`.
The main fields to define in the `FilterModel` are the following:
* attribute: this is the key for the field which will be used to filter based on
* type: the type of the filter that should be of type StrapiFilterTypesEnum, the type's value should have the key for the filtering operator
* value: the value of the field we want to filter based on
* translationKey (optional): the translation key for the field
 
Here's an example: 
```
public filters: FilterModel[] = [
        {
            type: StrapiFilterTypesEnum.IN,
            value: [AdminRolesEnum.ADMIN, AdminRolesEnum.SUPER_ADMIN],
            attribute: 'role.type',
        },
    ]
```
### Draft/publish system
If we want to show all the draft objects from database we can pass a `showDrafts` property to the table component and it should be a boolean.
The main values to define for the `showDrafts` are the following:
* true : if we want to retrieve the published and the unpublished objects from database
* false : if we want to retrieve only the published objects from database
* no value passed : default value is false so we will have as result only the published objects from database
- we need to pass the showDrafts boolean in the 4th argument of tableService.find() function

Here's an example of use :
```
this.tableService.find<ShopModel>('shops', [], 'openinghours', true)
```

### Default Sort
`defaultSort` defines the default sorting settings for the table. The `defaultSort` property takes the type `MatSortable` and it has the following fields:
- id: This property specifies the field or column key to use as the default sort field when the table loads.
- start: This property specifies the default sort direction, which can be ascending or descending. It should be of type SortDirectionEnum.
- disableClear: This property is a boolean value that determines whether the user can clear the default sort by clicking on the column header. If disableClear is set to false, the user can clear the sort by clicking on the column header again. If it is set to true, the user will not be able to clear the default sort.

Here's an example of this property definition:
```
const defaultSort: MatSortable = { 
    id: 'field_key', 
    start: SortDirectionEnum.ASC, 
    disableClear: false
}
```

### Route Redirection
If you need the table rows to redirect the user to a certain route you can use the `routeRedirect` property to define the redirection URL. Additional query parameters can be added to the URL using the `queryParamProperties` property. 
Here's an example: 
```
<xevlabs-ng-utils-strapi-table
    [dataSource]="dataSource"
    [columnsDefinition]="columnsDefinition"
    [filters]="filters"
    [defaultSort]="defaultSort"
    [routeRedirect]="'./'"
    [queryParamProperties]="['id']"
 ></xevlabs-ng-utils-strapi-table>
```
### Page Size and Page Size Options
The table's page size as well as the displayed size options to choose from in the table's paginator can be defined with the `pageSize` and `pageSizeOptions` properties respectively.
Here's an example: 
```
<xevlabs-ng-utils-strapi-table
    [dataSource]="dataSource"
    [columnsDefinition]="columnsDefinition"
    [pageSize]="4"
    [pageSizeOptions]="[4, 8, 12]"
></xevlabs-ng-utils-strapi-table>
```
The default value for `pageSize` is 10 and `pageSizeOptions` is [10, 25, 50, 100].

## How to use XevlabsNgUtils' Search Bar Component
XevlabsNgUtils also provides a search bar component that allows users to search within the table's data. This tool enables querying through all the fields in the table and retrieving the data that matches the input submitted by the user. It's important to note that this search functionality doesn't apply to nested fields.

The search bar functionality has a minimum requirement of at least 3 characters entered by the user before initiating the search. Once the minimum character threshold is met, the search bar will dynamically filter the table based on the user's input.

To incorporate this feature, follow these steps:

1. Place the following code snippet in your DOM:

  ```
  <xevlabs-ng-utils-search-bar
    [dataSource]="dataSource"
  ></xevlabs-ng-utils-search-bar>
  ```

2. Ensure that you set the dataSource option to correspond with the datasource assigned to the Strapi table component.

By following these steps, you can integrate and utilize the search bar component effectively alongside the table component.

## Strapi Table Service
This service is responsible for handling HTTP requests related to Strapi-based data. It is mainly designed to provide data for the table component and it offers the following methods:
- find: takes a collectionName string, an array of FilterModel objects, and optional parameters for pagination and sorting, and returns an observable that emits an Object that has a `data` attribute presenting an array of type T containing the collection items that match the specified filters and a `total` attribute presenting the total number of items matching the specified filters.
- parseStrapiFilters: takes an array of FilterModel objects and returns a string representing the filters in the Strapi query format.

## Setting up the Demo App
The library's Demo App features the main functionalities offered by the table component as well as the table service. 
To run the demo app, you need to set up the Strapi backend first. Follow these steps to set up the Strapi backend:

1. Create a new Strapi project by running the following command:
    ```
    > npx create-strapi-app@latest my-project --quickstart
    ```
2. Navigate to the newly created project directory:
    ```
    > cd my-project
    ```
3. Start the Strapi server by running the following command:
    ```
    > npm run develop
    ```
4. Open your web browser and navigate to `http://localhost:1337/admin` to access the Strapi admin panel.

5. Click the "Content-Type Builder" tab in the left sidebar, then click the "Create new collection type" button to create the following collections: 

    - First collection:
        - Display name: nestedCollection
        - Fields:
            | Name | Type |
            | ---- | ---- |
            | nestedTextField | Text |
         - In Advanced Settings make sure you check *Draft & publish* box. 
         
    - Second collection:
        - Display name: test
        - Fields:
            | Name | Type | Relation Type |
            | ---- | ---- | ---- |
            | textField | Text |
            | numberField | Number |
            | user | Relation with *User (from: users-permissions)* | has and belongs to one |
            | nested_collections | Relation with *NestedCollection*  | belongs to many |
        - In Advanced Settings make sure to check *Draft & publish* box and check *Internationalization* box.
6. Head to the Content Manager tab and create new User(s), new nestedCollection(s) and new Test entries that use the created Users and nestedCollections.

7. In the Admin Panel, head to Settings > USERS & PERMISSIONS PLUGIN > Roles, select Public Role and enable the following routes: 
    - Test API: find
    - Nested-collection API: find
    - Users-permissions > User: find
8. Navigate to the library's directory:
    ```
    cd libs\xevlabs-ng-utils
    ```
9. Finally, launch the library's demo app with the following command: 
    ```
    nx serve xevlabs-ng-utils-demo
    ```
