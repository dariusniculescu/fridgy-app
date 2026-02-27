# Fridgy – Smart Kitchen Assistant

Fridgy is a full-stack web application that helps users manage their kitchen inventory and generate personalized recipes using OpenAI.

---

![Main Interface](assets/hero.png)

---

## Features

* AI-Driven Recipe Generation: Integration with OpenAI API (GPT models) to analyze available ingredients and generate creative, structured recipes.
* Secure User Authentication: Implementation of Spring Security with JWT (JSON Web Tokens) and BCrypt password hashing for secure access.
* Inventory Management System: Comprehensive CRUD functionality for tracking food items, quantities, and expiration dates.
* Role-Based Access Control: Specialized interfaces and permissions for regular Users and Administrators.
* Administrative Insights: Dashboard for monitoring platform usage, managing user accounts, and content moderation.
* Persistent Storage: Robust data management using MySQL with efficient relational mapping via Hibernate.
* Responsive User Interface: A modern, single-page application (SPA) built with React for a seamless user experience across devices.

---

## System Architecture

The application follows a decoupled MVC (Model-View-Controller) architecture to ensure scalability and a clean separation of concerns:

### Backend (Spring Boot)
* **RESTful API**: Built with Spring MVC to handle communication between the client and server.
* **Service Layer**: Contains core business logic and direct integration with the OpenAI API for recipe synthesis.
* **Security**: Implements Spring Security with JWT and BCrypt for secure, stateless authentication and role-based access control (USER/ADMIN).

### Frontend (React.js)
* **Component-Based UI**: Utilizes reusable components for a consistent design across the ingredient selection grid and the admin dashboard.
* **State Management**: Handles real-time updates for ingredient selection and asynchronous API calls using React Hooks.

---

## Database Schema (MySQL)

The data layer is managed via Spring Data JPA with a relational MySQL structure. The `dfridgy` schema consists of the following interconnected tables:



* **users**: Stores encrypted user credentials and profile information.
* **ingredient**: A master list of available food items for selection.
* **recipe**: Stores generated recipes, including instructions and nutritional info.
* **recipe_ingredient**: A junction table managing the many-to-many relationship between recipes and their components.
* **review**: Stores user-submitted feedback and ratings for generated recipes.
* **ingredient_request**: A queue for user-proposed ingredients awaiting Admin approval.
* **user_favorite_recipes**: Tracks bookmarked content for individual user profiles.

---

## System Logic: How it Works

1. **Selection**: Users interact with the React interface to pick ingredients from their digital inventory.
2. **API Request**: The frontend sends the selected data to the Spring Boot Controller via Axios.
3. **AI Integration**: The Service layer constructs a specific prompt and calls the OpenAI API to generate a structured, high-quality recipe.
4. **Persistence & Analytics**: The generated recipe is stored in MySQL, and the Admin Dashboard is updated in real-time with usage statistics.

---

