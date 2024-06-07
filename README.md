# How to Apply for a Mapbox API Key

To use Mapbox services, you'll need to create an account and generate an API key. Follow these steps to get your API key:

## Step 1: Create a Mapbox Account

1. Visit the [Mapbox website](https://www.mapbox.com/).
2. Click on the **Sign Up** button located at the top right corner of the page.
3. Fill in the registration form with your details:
    - **Email Address**
    - **Username**
    - **Password**
4. Agree to the terms of service and privacy policy.
5. Click on the **Sign Up** button to create your account.

## Step 2: Confirm Your Email Address

1. After signing up, you will receive a confirmation email from Mapbox.
2. Open the email and click on the verification link to confirm your email address.

## Step 3: Log In to Your Mapbox Account

1. Once your email is verified, go back to the [Mapbox website](https://www.mapbox.com/).
2. Click on the **Log In** button at the top right corner of the page.
3. Enter your email and password, then click **Log In**.

## Step 4: Access Your Account Dashboard

1. After logging in, you will be redirected to your account dashboard.
2. In the dashboard, navigate to the **Account** section from the sidebar menu.

## Step 5: Generate an API Key

1. In the **Account** section, look for the **API access tokens** panel.
2. Click on the **Create a token** button.
3. Give your token a name for easy identification (e.g., "My First API Key").
4. Optionally, you can define the scopes and restrictions for your token based on your requirements.
5. Click on the **Create token** button to generate your API key.

## Step 6: Copy and Save Your API Key

1. Your new API key will be displayed on the screen.
2. Copy the API key and save it in a secure place.

## Step 7: Paste Your API Key to Your Environment File

1. Create a `.env` in the root of the repository.
2. Paste `VITE_MAPBOX_ACCESS_TOKEN = <YOUR_API_KEY>` to `.env`

---

Deploying an application to Heroku involves several steps, including setting up a Heroku account, installing the Heroku CLI, preparing your application, and finally deploying it. Here’s a step-by-step guide:

---

# How to Deploy to Heroku

## Prerequisites

-   A Heroku account. If you don't have one, sign up at [Heroku](https://signup.heroku.com/).
-   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed on your local machine.

## Step 1: Log In to Heroku

Open your terminal and log in to Heroku using the CLI:

```bash
heroku login
```

A web browser will open, prompting you to log in to your Heroku account.

## Step 2: Create a New Heroku App

Navigate to your project directory and create a new Heroku app:

```bash
cd /path/to/your/project
heroku apps:create <your-app-name>
```

This command will create a new Heroku app and link it to your project. You will see a URL for your new Heroku app.
You might need to visit the link if failed to create and fill in your payment method.

## Step 3: Add the nginx Buildpack

```bash
heroku buildpacks:add heroku-community/nginx -a <your-app-name>
```

## Step 4: Deploy Your Application

### Push to Heroku

```bash
git push heroku main
```

Heroku will build and deploy your application. You can see the progress in the terminal.

## Step 5: Open Your Deployed Application

Once the deployment is complete, you can open your application in the browser:

```bash
heroku open
```

## Step 6: Manage Environment Variables

If your application requires environment variables, you can set them using the Heroku CLI. For example:

```bash
heroku config:set VITE_MAPBOX_ACCESS_TOKEN=<your-mapbox-api-key>
```

---
