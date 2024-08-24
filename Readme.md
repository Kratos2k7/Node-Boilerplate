
# NodeJS-Boilerplate with RBAC

This is a template server built with Node.js, featuring:

- **Express**
- **MongoDB**
- **SendGrid**
- **Passport & JWT (jsonwebtoken)**
- **Microservices Architecture**

This template implements Role-Based Access Control (RBAC) with customizable roles and permissions.

## Setup

### Clone the Project
\`\`\`bash
git clone https://github.com/OmmarNadeem/NodeJS-Boilerplate-with-RBAC
\`\`\`

### Navigate to the Project Directory
\`\`\`bash
cd NodeJS-Boilerplate-with-RBAC
\`\`\`

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Start the Server
- **Production:** \`npm start\`
- **Development:** \`npm run dev\`

## Environment Variables

To run this project, you need to create and configure a \`.env\` file. Rename the existing \`.env.example\` to \`.env\`:

\`\`\`bash
mv .env.example .env
\`\`\`

Add the following environment variables:

- **APP_NAME**: Name of the application (used in registration emails).
- **PORT**: The port on which the server will run.
- **MONGO_CONN_URL**: MongoDB connection URL.
- **production**: Indicates the environment (used for setting different URLs in emails for account verification).
- **CRYPTR_EMAIL_SECRET**: Secret used to encrypt the user's email (for registration emails).
- **FROM_EMAIL**: The email address used to send emails.
- **REGISTRATION_TEMPLATE_ID**: SendGrid template ID for registration emails.
- **SENDGRID_API_KEY**: SendGrid API key.
- **LOCAL_IP**: The server's local IP (automatically set using \`helpers/common.getLocalIP()\`).

## Keys Configuration

Configure the following keys in \`config/keys.js\`:

- **JWT_SECRET**: Secret for signing JWT tokens.
- **REFRESH_TOKEN_SECRET**: Secret for signing refresh tokens.
- **REFRESH_TOKEN_LIFE**: Lifespan of the refresh token.
- **REFRESH_TOKEN_ALGO**: Algorithm used to sign the refresh token.
- **tokenExpireTime**: Lifespan of the JWT token.
- **welcome_email_subject**: Subject of the registration emails.
- **emailUrl**: URL sent to users for verification in production.
- **emailLocalUrl**: URL sent to users for verification in development.
- **EMAIL_TOKEN_EXPIRY**: Lifespan of the email token.

## Directories

The server will automatically generate the necessary directories when started. If you prefer to manually manage directories, comment out \`createDirectories()\` in \`config/init.js\`.

## API Documentation

After starting the server, visit \`/api/docs\` for the API reference.

## How to Extend

1. **Create a New Route:**
   - Add the route in \`routes/index.js\`.
   - If the route requires user authentication, include the \`authenticate\` middleware.
   
2. **Accessing Resources:**
   - Create a method in the relevant controller to attach the resource to the request object.

3. **Managing Roles and Permissions:**
   - **Complete Access:** Use \`authRole(role)\` where \`role\` is a key from \`rbac/roles\` (e.g., \`ROLE.USER\`).
   - **Specific Permissions:** Add the middleware to check for the specific permission defined in \`rbac/permissions\`.

4. **Controller Method:**
   - Implement the desired logic in the relevant controller method.

### Predefined Roles
- \`admin\`
- \`moderator\`
- \`user\`

### Creating Roles
Add the key-value pair for the role in the \`ROLE\` object within \`rbac/roles\`.

### Creating Permissions
1. Create a new method in \`rbac/permissions\` with at least two parameters: \`user\` and the \`resource\`.
2. Implement the permission logic.
3. Export this method in \`module.exports\`.

### Creating Middleware to Check Permissions
1. Create a method in the relevant controller that calls the permission you created.
2. Implement the checking logic.
3. Export this method in \`module.exports\`.

## Feedback

For any feedback, please reach out to Ommar Nadeem at [umernadeem321@gmail.com](mailto:umernadeem321@gmail.com).
