# FMS GUI Web

This project is a web based tool for the visualization and analysis of the FMS data.

## Getting Started

These instructions will give you a short introduction into the project, a small 'How-To' and how to run the application on your local machine. For any questions, please contact e1427030 (at) student.tuwien.ac.at.

### Prerequisites

What things you need to run the software:
* [Angular](https://angular.io/)

### Development

To get the application, you first need to clone the repo. This is done by
```
git clone git@github.com:SpaceTeam/FMSGUI_Web.git
```
Inside this directory you then need to go to the directory 'fms-gui-web'. This can be done as following
```
cd fms-gui-web
```
After changing the directory, you need to start the local development server, which will use the 4200 port. To start the server, use the following command:
```
ng serve --open
```
If you want to use another port, use the --port directive. E.g. if you want to use the 4300 port, use
```
ng serve --open --port 4300
```
This command should open the page in your favourite browser. To close the server, just close the terminal.

### Styleguide

A styleguide, which gives directives regarding the code styling and commenting, still needs to be added.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Deployment

To deploy this system, you need to use 
```
ng build --prod
```
and deploy it on your server.
If you are using an Apache webserver, please add the following part to the .htaccess file: 
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . index.html [L]
</IfModule>
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Built With

* [Angular](https://angular.io/) - The web framework used

## Related projects
* Classic FMS GUI: [FMSGUI](https://github.com/SpaceTeam/FMSGUI)

## Authors

* **Khlebovitch Thomas** - [Th2mas](https://github.com/Th2mas/)

## License

No license

## Acknowledgments

None yet
