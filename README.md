# MetricsFront

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Docker (development with hot reload)

To run the application in Docker with hot reload enabled, use:

```bash
docker compose -f docker-compose.dev.yml up
```

The app will be available at `http://localhost:4200/`. Changes to source files are automatically detected and the browser reloads — no rebuild needed.

> **Note:** `--poll=1000` (in miliseconds) is used so Angular detects file changes via polling, which is required on Windows where filesystem events are not propagated through Docker volumes.

## Docker (production)

To build and run the production image with nginx:

```bash
docker compose up --build -d
```

The app will be available at `http://localhost:4200/`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
