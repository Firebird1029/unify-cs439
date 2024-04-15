# Unify

![https://img.shields.io/github/actions/workflow/status/firebird1029/unify-cs439/test.yml?branch=master](https://img.shields.io/github/actions/workflow/status/firebird1029/unify-cs439/test.yml?branch=master)

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

This project requires [Supabase](https://supabase.com/) in order to run. Inside the `.env` file, there exists the two Supabase keys required to run the application, `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The current values are tied to an existing Supabase project (and because these are public, client-exposed keys to a Supabase database protected with RLS, these two keys are safely tracked in Git). To connect the application with your own Supabase project instance,

1. Create an account in [Supabase](https://supabase.com/).
2. Follow the steps here to connect Supabase with Spotify: [https://supabase.com/docs/guides/auth/social-login/auth-spotify].
3. Go to the [SQL Editor](https://supabase.com/dashboard/project/_/sql) page in the Supabase Dashboard. Click **User Management Starter**. Click Run. This step is from a tutorial [here](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs).
4. [Optional] To ensure a working email confirmation redirect link, you need to change the Confirm signup email template link. In Supabase > Authentication > URL Configuration, change the Email Template link line to:

```html
<p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
```

5. In `.env` in the root directory, change the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Development

To start the application, simply run `npm run dev`. You can access the application from `localhost:3000`.

## Testing

To test the application:

```bash
npm test
```

We have achieved 87% statement coverage.

## Linting

To lint the application:

```bash
npm run lint
```

Note that the code must fully pass `npm run lint:prod` before being able to be merged into `master`.

## Production & Deployment

The application is deployed at [http://unify-cs439.vercel.app](http://unify-cs439.vercel.app).  
You can view an example of a user data page at [http://unify-cs439.vercel.app/user/testuser](http://unify-cs439.vercel.app/user/testuser)  
You can view an example of a unify data page at [http://unify-cs439.vercel.app/unify/testuser&hoixw](http://unify-cs439.vercel.app/unify/testuser&hoixw)  
To log in with Spotify, you must be a registered user, as the app is in development mode (on Spotify's end).  
Contact <david.crair@yale.edu> to be added as a user.

## Credits
