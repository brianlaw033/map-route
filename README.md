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
-   [Git](https://git-scm.com/) installed on your local machine.
-   [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed on your local machine.

## Step 1: Prepare Your Application

Ensure your application is ready for deployment. This typically involves:

-   A `Procfile` that specifies the commands needed to run your app.
-   A `requirements.txt` or `package.json` file that lists dependencies.

### Example `Procfile` for a Node.js app

```
web: node index.js
```

### Example `Procfile` for a Python (Flask) app

```
web: gunicorn app:app
```

## Step 2: Log In to Heroku

Open your terminal and log in to Heroku using the CLI:

```bash
heroku login
```

A web browser will open, prompting you to log in to your Heroku account.

## Step 3: Create a New Heroku App

Navigate to your project directory and create a new Heroku app:

```bash
cd /path/to/your/project
heroku create
```

This command will create a new Heroku app and link it to your project. You will see a URL for your new Heroku app.

## Step 4: Deploy Your Application

### Initialize a Git Repository (if not already done)

If your project is not already a Git repository, initialize one:

```bash
git init
```

### Commit Your Code

Add your files to the Git repository and commit them:

```bash
git add .
git commit -m "Initial commit"
```

### Push to Heroku

Deploy your application by pushing to the Heroku remote:

```bash
git push heroku master
```

For apps using the main branch (Git version 2.28.0 or later):

```bash
git push heroku main
```

Heroku will build and deploy your application. You can see the progress in the terminal.

## Step 5: Open Your Deployed Application

Once the deployment is complete, you can open your application in the browser:

```bash
heroku open
```

## Step 6: Manage Environment Variables (Optional)

If your application requires environment variables, you can set them using the Heroku CLI. For example:

```bash
heroku config:set SECRET_KEY=mysecretkey
```

## Step 7: Monitor Your Application

You can monitor your application and view logs using the following command:

```bash
heroku logs --tail
```

## Additional Resources

-   [Heroku Dev Center](https://devcenter.heroku.com/)
-   [Heroku CLI Documentation](https://devcenter.heroku.com/articles/heroku-cli)

---

This guide should help you deploy your application to Heroku successfully.
