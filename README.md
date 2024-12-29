# Node project

![image](https://github.com/user-attachments/assets/d750702a-bec1-4ee1-a049-0c23268e246a)

Welcome to our manga shop website **E-Ragana**! This project is a responsive e-commerce platform for manga enthusiasts, featuring advanced filtering, sorting, and browsing capabilities for a wide variety of manga titles.

---

## Table of contents

- [Project Description](#project-description)
- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

---

## Project description

The **E-Ragana website** is a modern and dynamic e-commerce platform designed to provide manga enthusiasts with an intuitive and engaging shopping experience. Users can browse, search, and filter manga titles by genre, demographics, type, and price while viewing detailed product pages.

This project was built using **Angular** for the frontend, with **Node.js** and **Express** for the backend API. Data is stored in a **PostgreSQL** database.

---

## Features

- **User-Friendly Interface**: Intuitive design with responsive layouts.
- **Dynamic Product Display**: Display the top 100 manga dynamically.
- **Product Details**: Detailed product pages with images, pricing, and descriptions.
- **Search Functionality**: Quickly find manga by name or author.
- **Filtering and Sorting**: Filter by genre, demographics, and type; sort by name, price, or score.
- **Secure Backend**: Node.js API with PostreSQL database integration.

---

## Screenshots

### Home Page
<img width="1920" alt="image" src="https://github.com/user-attachments/assets/355163e0-8956-422f-ae59-808857d28a4f" />

### Shop Page (Product List)
<img width="1920" alt="image" src="https://github.com/user-attachments/assets/bcad6603-f533-4c0a-ba55-5f9980faf140" />

### Shop Page (Product Filters)
<img width="1920" alt="image" src="https://github.com/user-attachments/assets/dfe32008-5ee0-4708-8e4f-4bf4acb2cca5" />

### Product Page
<img width="1919" alt="image" src="https://github.com/user-attachments/assets/1e0e0d9a-1b39-48ad-a905-9b814f26dbaf" />

### Product Stats (Genre, Demographics, Types) 
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/b3f5d26b-1f70-4a33-bbff-936766af9bc1" />

### About Page
<img width="1469" alt="image" src="https://github.com/user-attachments/assets/6112e0ea-42b0-4c16-bccf-f6cc841d214c" />

### Contact Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/9bbafb5f-d4b8-4d64-bdce-9ccdd4db147a" />

### Cart Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/fb8548a5-a3dd-458c-b205-6c7fc0d44ff5" />

### Admin Page
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/a9785d64-24d5-4e16-a38b-87360e52c6ee" />

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Angular CLI](https://angular.io/cli)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/leinapr/Node_Project.git
   cd Node_Project
   ```

2. **Setup backend**:
   ```bash
   cd Node_Project/backend
   npm install
   ```
   - Create a `.env` file and configure the database connection:
     ```env
     DB_HOST=localhost
     DB_USER=your_postgres_user
     DB_PASSWORD=your_postgres_password
     DB_NAME=ecommerce
     DB_PORT=5432
     ```
   - Initialize the database:
     ```bash
     psql -U your_postgres_user -d ecommerce -c "CREATE TABLE products (id SERIAL PRIMARY KEY, name TEXT, type TEXT, score FLOAT, status TEXT, volumes INT, genres TEXT[], demographics TEXT[], authors TEXT[], description TEXT, image TEXT, url TEXT, price FLOAT);"
     psql -U your_postgres_user -d ecommerce -c "COPY products (id, name, type, score, status, volumes, genres, demographics, authors, description, image, url, price) FROM '/your/path/manga.csv' DELIMITER ';' CSV HEADER;"
     ```
   - Start the backend server:
     ```bash
     node server.js
     ```

3. **Setup frontend**:
   ```bash
   cd Node_Project/frontend/ecommerce-frontend
   npm install
   ng serve
   ```

4. Open the application in your browser at [http://localhost:4200](http://localhost:4200).

---

## Usage guide

### Shop Page 
* **Browsing products**: Browse through the list of manga titles. By default, the top 100 products are displayed.
* **Filtering products**: Use the dropdowns to filter by:
    * Genre: Action, Adventure, Drama, etc.
    * Demographics: Shonen, Seinen, Shojo, etc.
    * Type: Manga, Novel, Light Novel, etc.
    * Price Range.
* **Sorting products**: Sort the products by Name, Price, or Score.

### Product Page
* **Viewing product details**: Click on any product to view its detailed information. Product details include the title, price, genre, demographics, type, and rating.
* **Adding Products to the Cart**: Click on the button 'Add to Cart' to add a product to the cart or click on 'Buy Now' to purchase the product directly. This will redirect you to the 'Cart' page.

### Contact Page
* Enter your name.
* Enter your email address.
* Write your message.
* We will reply to you as soon as possible.

### About Page
* Navigate to this page to know more about us.

### Cart Page
The Cart Page provides essential e-commerce functionalities for managing selected products before checkout. Key features include:
* **Add Products**: Items added from the shop are displayed in the cart for review.
* **Remove Products**: Users can remove unwanted items from the cart.
* **Update Quantities**: Adjust the quantity of each product directly within the cart.
* **Apply Promo Code (DISCOUNT10)**: Users can enter a valid promotional code to receive discounts on their total purchase.
* **Cart Summary**: Displays a breakdown of the cart, including individual item prices, subtotal, discounts, and the final total.

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

