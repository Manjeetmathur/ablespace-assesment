# Workspace Customizations & Rules

## Database & Authentication Rules
- **MongoDB Only**: Always use MongoDB as the database for everything (tasks, users, projects, auth).
- **No Fallbacks & No Dummy Data**: Do NOT use hardcoded dummy default values (e.g. fake fallback emails like `user@gmail.com`, mock names like `Google User`, `Dexter`, `Ankit`, or fake avatar placeholders), in-memory stores, or fallback arrays in any backend service, schema, or frontend API client.
- **Strict Error Handling**: Ensure all user profiles, Google OAuth logins, and database CRUD operations run directly against real user inputs and MongoDB collections without silent fallback returns in `catch` blocks.
- **Verification Rule**: Do NOT run `npm run build`. If type checking or verification is needed, run `npx tsc --noemit`.
