# Contributing guidelines

See the [unit-e contributing
guidelines](https://github.com/dtr-org/unit-e/blob/master/CONTRIBUTING.md). We
follow the same process for the desktop UI as we do for all other Unit-e
software.

There is one notable difference. The desktop UI is licensed under the GPLv2 not
MIT. By contributing to this repository you agree to contribute your work under
the [GPL](LICENSE).

## Dev resources

- **Angular**
  - [Angular Syntax Styleguide](https://angular.io/guide/styleguide) - guide to Angular syntax, conventions, and application structure
- **Components**
  - [Material Components](https://material.angular.io) - overview of available Material components and example usage (stick to these as much as possible, no need to reinvent the wheel)
- **Layout**
  - [Angular fxFlex API Layouts](https://github.com/angular/flex-layout/wiki/fxFlex-API) - fxFlex markup basics
  - [Declarative (static) API](https://github.com/angular/flex-layout/wiki/Declarative-API-Overview) - for basic static layouts
  - [Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API) - for responsive layouts
- **Icons**
  - all available icons are in [`/src/assets/icons/SVG`](https://github.com/dtr-org/unit-e-desktop/dev/src/assets/icons/SVG)
  - include via `<mat-icon fontSet="uniteIcon" fontIcon="unite-<icon_name>"></mat-icon>`