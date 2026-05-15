
# Vanta

Vanta is a web application designed to manage projects and folders, allowing users to create, organize, and navigate through their projects effectively. Built with Angular, it provides a user-friendly interface to streamline project management tasks.

## Features

- **Folder Management**: Create and manage folders to categorize projects.
- **Project Creation**: Add new projects and assign them to specific folders.
- **Dynamic Project Display**: View projects based on the selected folder.
- **Routing**: Navigate between different components (Home, Project Dashboard, Kanban).
- **Responsive UI**: Utilize Angular components for a responsive user experience.

## Tech Stack

- **Framework**: Angular
- **State Management**: RxJS for reactive programming
- **Dependency**: Material Symbols for icons
- **Backend**: Supabase for database interactions

## Installation

To set up the Vanta project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/vanta.git
   cd vanta

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm start
   ```

4. Open your web browser and navigate to `http://localhost:4200`.

## Usage

Upon launching the application, users can:

- **Sign in** (if applicable) to access their projects.
- **Create folders** to organize various projects.
- **Add projects** to the selected folder using the provided modal.
- **Navigate** through projects and folders seamlessly using the sidebar.
- **View project details** by clicking on a project, which redirects to the Kanban component.

## Project Structure

The main structure of the application is as follows:

```
production/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── logged/
│   │   │   │   ├── home-page/
│   │   │   │   │   ├── home-page.ts
│   │   │   │   ├── kanban/
│   │   │   │   │   ├── kanban.ts
│   │   │   ├── not-logged/
│   │   │   │   ├── account/
│   │   │   │   │   ├── account.ts
│   │   ├── services/
│   │   │   ├── cria-projeto.ts
│   │   ├── app.routes.ts
│   │   ├── app.ts
│   ├── main.ts
```

- **app.ts**: Main application component.
- **app.routes.ts**: Defines application routes.
- **home-page.ts**: Contains logic for the home page, managing folders and projects.

## Future Improvements

- Implement user authentication for personalized experience.
- Add project collaboration features for multiple users.
- Enhance UI/UX design for better accessibility and responsiveness.
- Introduce local storage options for offline capabilities.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure to follow best practices and include tests where applicable.

## License

This project is licensed under the MIT License.

Generated with Codescribe™
