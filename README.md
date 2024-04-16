# Unify

![test.yml on Master](https://img.shields.io/github/actions/workflow/status/firebird1029/unify-cs439/test.yml?branch=master)
![lint-prod.yml on Dev](https://img.shields.io/github/actions/workflow/status/firebird1029/unify-cs439/lint-prod.yml?branch=dev&label=lint)
![Deployed Website](https://img.shields.io/website?url=https%3A%2F%2Funify-cs439.vercel.app%2F&label=unify-cs439.vercel.app&link=https%3A%2F%2Funify-cs439.vercel.app%2F)
[![All Contributors](https://img.shields.io/github/all-contributors/firebird1029/unify-cs439?color=ee8449&style=flat-square)](#contributors)

## Introduction

Unify is a visually captivating platform designed for Spotify users to dive into their listening history and compare music habits with friends. Unify brings a unique perspective to your music exploration by offering insights into how closely your tastes align with others.

### Features

- **Visual Exploration**: Navigate through your Spotify listening history in a visually engaging way.
- **Comparison Tools**: Compare your music habits with others to discover similarities and differences.
- **Shareable Visualizations**: Generate and share Y2K-style graphics that represent your music tastes and listening habits.
- **Deep Insights**: View detailed statistics like diversity of your music, uniqueness of your tastes, and match rankings with friends.
- **Social Integration**: Easily share your music insights with friends and on social media.

### Goal

Unify aims to enhance your music experience by making it more interactive and visually appealing. It strives to create a platform where you can explore your musical identity, compare it with others, and enjoy custom content tailored to your tastes.

## Installation & Setup

You need Node.js installed. The project currently supports Node v20.12.2 but will likely work with other Node versions.

```bash
npm install
```

### Supabase Setup

This project requires [Supabase](https://supabase.com/) in order to run. Inside the `.env` file, there exists the two Supabase keys required to run the application, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The current values are tied to an existing Supabase project (and because these are public, client-exposed keys to a Supabase database protected with RLS, these two keys are safely tracked in Git). To connect the application with your own Supabase project instance:

1. Create an account at [Supabase](https://supabase.com/).

2. Follow the steps here to connect Supabase with Spotify: [https://supabase.com/docs/guides/auth/social-login/auth-spotify].

3. Go to the [SQL Editor](https://supabase.com/dashboard/project/_/sql) page in the Supabase Dashboard. Click **User Management Starter**. Click Run. This step is from a tutorial [here](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs).

4. Optional - Update the email confirmation template in Supabase:

   - Go to Authentication > URL Configuration
   - Change the Email Template link to:

     ```html
     <p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
     ```

5. In `.env` in the root directory, change the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Development

To start the application, simply run `npm run dev`. You can access the application from `localhost:3000`.

### Code Structure

#### Root

| File/Folder           | Description                                     |
| --------------------- | ----------------------------------------------- |
| `__tests__/`          | Jest tests.                                     |
| `.github/`            | Github Action scripts.                          |
| `.husky/`             | Pre-commit hooks, as described in Git Strategy. |
| `src/`                | Main code files.                                |
| `.all-contributorsrc` | See <https://allcontributors.org>.              |
| `.env`                | Non-secret environment variables.               |
| `jsconfig.json`       | VS Code IntelliSense support file.              |
| `public/`             | Public assets (fonts)                           |

Other supporting files in the root directory include configuration files for linting (ESLint + Prettier), testing (Jest), Next.js, and others.

#### src Folder

| File/Folder     | Description                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `app/`          | Main page files, following the [Next.js app routing system](https://nextjs.org/docs/app/building-your-application/routing). |
| `shared/`       | Components shared across multiple pages.                                                                                    |
| `utils/`        | Various backend utility functions, primarily Supabase authentication scripts.                                               |
| `fonts.js`      | Optimized font face exports.                                                                                                |
| `middleware.js` | Used for Supabase authentication.                                                                                           |
| `spotify.js`    | Backend used for communicating with Spotify API.                                                                            |

### Git Strategy

1. **Pre-commit Hooks**: There is a pre-commit hook that lints the code files using ESLint and Prettier. This is done via the `lint-staged` package and configured in `package.json`.
2. **Protected Branches**: There are two protected branches, `master` and `dev`. Both branches cannot have direct commits; instead, a pull request must be opened and approved by another contributor.
3. **Branches & Pull Requests**: Contributors create a new branch specific to a feature. There is no branch naming convention. Once the feature is finished, `dev` is merged into the feature branch, and a new PR is opened to merge the feature branch into `dev`. Another contributor must approve the PR before it can be merged. Ideally, it should pass the Github Action test scripts as well.
4. **CI/CD & Github Actions**: There are two Github Action scripts that get triggered upon a new pull request. The first is a test script that essentially runs `npm test`. The second is a lint script that checks for linting errors and warnings. For `dev`, all ESLint errors must be resolved for the test to pass. For `master`, all ESLint errors AND warnings must be resolved for the test to pass. Vercel also runs two integrated Github Action test scripts after a new pull request is created to check for Vercel preview deployment issues.
5. **Vercel**: Vercel creates a new _preview_ deployment after a new pull request is created. Vercel creates a new _production_ deployment after a pull request is merged into the master branch.

## Testing

To test the application (run all tests):

```bash
npm test
```

To run a specific test:

```bash
npm test testName
```

We have achieved 89% statement coverage.

To add a test, add a file to `__tests__/` with the file extension `.t.js`. This file will contain the tests themselves, and we are using Jest for testing — so any correctly formatted Jest test will work.

In terms of specific backend tests, examples can be found in `get_spotify_data.t.js`. Using Jest, this file shows how one can mock a backend call to ensure that the correct number of calls are made with the needed requirements.

## Linting

To lint the application:

```bash
npm run lint
```

Note that the code must fully pass `npm run lint:prod` before being able to be merged into `master`.

## Production & Deployment

The application is currently deployed via Vercel at [http://unify-cs439.vercel.app](http://unify-cs439.vercel.app).

> NOTE: To create an account in the existing deployment, you must be a registered user in our Spotify API application, as the application is currently in development mode (on Spotify's end). Contact <david.crair@yale.edu> to be added as a user.

You can view an example of a User Profile page at [http://unify-cs439.vercel.app/user/testuser](http://unify-cs439.vercel.app/user/testuser). You can view an example of a Unify Results page at [http://unify-cs439.vercel.app/unify/testuser&hoixw](http://unify-cs439.vercel.app/unify/testuser&hoixw).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
