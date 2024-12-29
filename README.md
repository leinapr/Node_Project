# Node Project

![Manga Shop Logo](assets/logo.png)

Welcome to our Manga Shop Website. This project is a fully responsive e-commerce platform for manga enthusiasts, featuring advanced filtering, sorting, and browsing capabilities for a wide variety of manga titles.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Project Description

The **Manga Shop Web Application** is a modern and dynamic e-commerce platform designed to provide manga enthusiasts with an intuitive and engaging shopping experience. Users can browse, search, and filter manga titles by genre, demographics, type, and price while viewing detailed product pages.

This project was built using **Angular** for the frontend, with **Node.js** and **Express** for the backend API. Data is stored in a **MySQL** database.

---

## Features

- **User-Friendly Interface**: Intuitive design with responsive layouts.
- **Filtering and Sorting**: Filter by genre, demographics, type, and price; sort by name, price, or rating.
- **Dynamic Product Display**: Display the top 100 manga dynamically.
- **Product Details**: Detailed product pages with images, pricing, and descriptions.
- **Search Functionality**: Quickly find manga by name or author.
- **Secure Backend**: Node.js API with MySQL database integration.

---

## Screenshots

### Home Page
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/d31750f8-35a3-413b-93fc-b98e69b84d0c" />

### Shop Page (Product List)
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/4c6effcc-138c-4442-ac27-04094f1d9d2f" />

### Shop Page (Product Filters)
![Product Filters](assets/screenshots/filters.png)

### Product Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/57885683-63e8-40e7-9c15-da012e00feaa" />

### Product Stats (Genre, Demographics,Types) 
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/b3f5d26b-1f70-4a33-bbff-936766af9bc1" />

### About Page
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/6112e0ea-42b0-4c16-bccf-f6cc841d214c" />

### Contact Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/9bbafb5f-d4b8-4d64-bdce-9ccdd4db147a" />

### Cart Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/fb8548a5-a3dd-458c-b205-6c7fc0d44ff5" />


---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Angular CLI](https://angular.io/cli)
- [MySQL](https://www.mysql.com/)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/manga-shop.git
   cd manga-shop
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file and configure the database connection:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=password
     DB_NAME=manga_shop
     ```
   - Initialize the database:
     ```bash
     npm run migrate
     npm run seed
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   ng serve
   ```

4. Open the application in your browser at [http://localhost:4200](http://localhost:4200).

---

## Usage Guide

### Browsing Products
1. Navigate to the **Shop** page.
2. Browse through the list of manga titles. By default, the top 100 products are displayed.

### Filtering and Sorting
1. Use the dropdowns to filter by:
   - **Genre**: Action, Adventure, Drama, etc.
   - **Demographics**: Shonen, Seinen, Shojo, etc.
   - **Type**: Manga, Light Novel, etc.
   - **Price Range**.
2. Sort the products by Name, Price, or Rating.

### Viewing Product Details
1. Click on any product to view its detailed information.
2. Product details include the title, price, genre, demographics, type, and rating.

---

## Technologies Used

### Frontend
- **Angular** (v15+)
- **TypeScript**
- **Bootstrap** for responsive design

### Backend
- **Node.js**
- **Express**
- **MySQL** for data storage
- **Sequelize** ORM

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push to your fork.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

