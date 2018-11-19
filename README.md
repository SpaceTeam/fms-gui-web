# FMS GUI Web

This project is a web based tool for the visualization and analysis of the FMS data.

## Getting Started

These instructions will give you a short introduction into the project, a small 'How-To' and how to run the application on your local machine. For any questions, please contact e1427030 (at) student.tuwien.ac.at.

### Prerequisites

What things you need to run the software
[Angular](https://angular.io/)

### Building

To get the application, you first need to clone the repo. This is done by
```
git clone git@github.com:SpaceTeam/FMSGUI_Web.git
```
Inside this directory you then need to go to the directory 'fms-gui-web'. This can be done as following
```
cd fms-gui-web
```
After changing the directory, you need to start the local server, which will use the 4200 port. To start the server, use the following command:
```
ng serve --open
```
This command should open the page in your favourite browser. To close the server, just close the terminal.

## Running the tests

No tests yet

### Styleguide

Styleguide needs to be provided

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

## Built With

* [Angular](https://angular.io/) - The web framework used

## Related projects
The classic UI: [FMSGUI](https://github.com/SpaceTeam/FMSGUI)

## Authors

* **Khlebovitch Thomas** - [Th2mas](https://github.com/Th2mas/)

## License

No license

## Acknowledgments

None yet
