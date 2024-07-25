# Express Authentication System

This project is a basic authentication system built with Node.js and Express. It includes user registration, login, session management, and other related features, making it a suitable foundation for web applications requiring user authentication.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration**: Allows users to create an account.
- **User Login**: Authenticates users using their email and password.
- **Session Management**: Uses session cookies to maintain user login state.
- **Password Hashing**: Securely hashes user passwords with bcrypt.
- **Environment Configuration**: Uses dotenv for managing environment variables.
- **EJS Templating**: Renders views using the EJS templating engine.
- **SweetAlert2 Integration**: Provides user-friendly alerts and messages.
- **Secure Sessions**: Implements session security measures.
- **Static Files**: Serves static files from a public directory.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   https://github.com/Melissaprivitera/Ironhack-webdevBootCamp.git
   cd Ironhack-webdevBootCamp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure the necessary environment variables. Refer to the [Configuration](#configuration) section.

4. **Start the application:**
   ```bash
   npm start
   ```

## Configuration

Ensure you have a `.env` file in your project root with the following environment variables:

- `DB_HOST`: Database host address
- `DB_USER`: Database username
- `DB_PASS`: Database password
- `DB_NAME`: Database name
- `SESSION_SECRET`: Secret key for session management

Example `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=mydatabase
SESSION_SECRET=your_secret_key
```

## Usage

After installing and configuring the application, you can access it by navigating to `http://localhost:3000` in your web browser.

- **Registration Page**: Accessible at `/register`. Users can sign up with an email and password.
- **Login Page**: Accessible at `/login`. Users can log in using their credentials.
- **Home Page**: Displays user-specific content if logged in, otherwise prompts the user to log in.

## Project Structure

```
express-auth-system/
│
├── public/            # Public static files
├── views/             # EJS templates
├── database/          # Database connection and configurations
├── .env               # Environment variables
├── app.js             # Main application file
├── package.json       # Node.js dependencies and scripts
└── README.md          # Project documentation
```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to modify and adapt this project as needed for your requirements. Happy coding!
