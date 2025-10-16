# Contributing to Guyrá

First of all, thank you for considering contributing to Guyrá! We appreciate your time and effort. This document provides guidelines for contributing to the project.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Adding a New Page](#adding-a-new-page)
- [Adding a New Component](#adding-a-new-component)
- [Adding a New Function](#adding-a-new-function)
- [Client-side JavaScript](#client-side-javascript)
- [Styling](#styling)
- [Database Changes](#database-changes)
- [Submitting Changes](#submitting-changes)

## Introduction

Guyra is a PHP-based web application with a simple and straightforward architecture. Here's a quick overview of the main directories:

- **`/pages`**: Contains the main entry points for different pages of the application. The routing is file-based, so a request to `/about`, for example, will load `pages/about.php`.
- **`/components`**: Contains reusable UI components that can be included in any page.
- **`/functions`**: Holds reusable functions and business logic.
- **`/assets`**: Contains static assets like CSS, JavaScript, images, and audio files.

The application uses a single entry point, `index.php`, which leads to `App.php` that then deals with routing. The `functions/Init.php` file initializes the application environment, including the database connection, user session, and application settings.

The app uses non-JSX React, which might get some using to fully adapt. If a request, for example `/help` will first check `assets/js/help.js`, as it exists it will be loaded as a React component, otherwise it will try `/pages/help.php`, failing both, it will 404. Oh, and the JS routing is case **insensitve** while the PHP routing is **sensitive**! The main element must be set in App.js.

## Getting Started

To get started with the development environment, please refer to the [BUILD.md](BUILD.md) file for detailed instructions on how to build and run the project using Docker.

## Adding a New Page

To add a new PHP page to the application, follow these steps:

1.  Create a new PHP file in the `/pages` directory.

2.  At the beginning of the file, include the header component:

    ```php
    <?php GetComponent('Header'); ?>
    ```

3.  Add the HTML content of your page.

4.  At the end of the file, include the footer component:

    ```php
    <?php GetComponent('Footer'); ?>
    ```

    If your page requires custom JavaScript, you can pass the name of the JavaScript file to the footer component. For example, if your JavaScript file is `assets/js/my-new-page.js`, you would include the footer like this:

    ```php
    <?php GetComponent('Footer', ['js' => 'my-new-page.js']); ?>
    ```

If instead you want to add a new React page:

1. Create the `my-component.js` file in `assets/js/my-component.js`.
2. Import this component in `App.js`, and set the entry point using the `routes` variable.

And the app will handle the rest.

## Adding a New Component

To create a new reusable component, follow these steps:

1.  Create a new PHP file in the `/components` directory. For example, `components/MyComponent.php`.

2.  Write the HTML and PHP code for your component in this file. You can use the `$_args` variable to pass data to your component.

3.  To use the component in a page or another component, use the `GetComponent` function:

    ```php
    <?php GetComponent('MyComponent', ['arg1' => 'value1', 'arg2' => 'value2']); ?>
    ```

## Adding a New Function

If you need to add new business logic, it's best to place it in a new file in the `/functions` directory. This helps to keep the code organized and reusable.

- If the function is related to a specific part of the application (e.g., exercises, payments), add it to the corresponding file (e.g., `functions/Exercises.php`, `functions/Payment.php`).
- If the function is more general, you can create a new file in the `/functions` directory.

Remember to include the new file in `functions/Init.php` if it needs to be available globally.

## Client-side JavaScript

If your new feature requires client-side JavaScript, follow these steps:

1.  Create a new JavaScript file in the `assets/js` directory.

2.  If the JavaScript is specific to a single page, you can include it by passing the file name to the `Footer` component, as described in the "Adding a New Page" section.

3.  If the JavaScript is used across multiple pages, you can include it in `components/Footer.php`.

## Styling

CSS files are located in the `assets/css` directory. If you need to add new styles, you can either add them to an existing CSS file or create a new one. If you create a new CSS file, make sure to include it in `components/Header.php`.

## Database Changes

The database connection is handled by the `functions/Database.php` file, which uses PDO. You can use the global `$pdo` object to interact with the database.

When adding new features that require database changes, please document the changes in your pull request.

In general, we don't change how the database behaves for backwards compatibility. If you have dealt with Wordpress databases before, the structure is similar.

## Submitting Changes

When you are ready to submit your changes, please follow these steps:

1.  Make sure your code follows the existing coding style.
2.  Create a new branch for your feature: `git checkout -b my-new-feature`.
3.  Commit your changes: `git commit -am 'Add some feature'`.
4.  Push to the branch: `git push origin my-new-feature`.
5.  Submit a pull request with a clear description of your changes.

> Thank you for contributing to Guyrá!
