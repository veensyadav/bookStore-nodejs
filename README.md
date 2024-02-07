# Bookstore Management System

## Overview

The Book Store Application is a Node.js-based backend system designed for managing a bookstore. It includes user management, book management, purchase history tracking, and revenue tracking for authors.


## The logic for computing sellCount :
- Each book has a column called sellCount, representing the total number of times that specific book has been sold.
- When a new book is added to the store, it starts with sellCount as zero.
- When someone buys a book, the sellCount of that book increases.
- For example, if the book's sellCount was 3, and a customer buys 2 more copies, the new sellCount becomes 5.
- In code there is a route "http://localhost:8080/api/v1/purchase/buy-book" that handles book purchases and when this api hits or the purchase happens, then the sellCount for the specific book is incremented by the quantity of books purchased.
- If you want to know how many times a book has been sold, you can simply look at its sellCount.

----

## The mechanism for sending email notifications:
- Use npm to install the SendGrid Node.js library.
   ```
   npm install @sendgrid/mail
   ```
- Sign up for a SendGrid account and obtain your API key.
- Use the @sendgrid/mail library to configure the API key.
   ```
    const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey('YOUR_SENDGRID_API_KEY');
   ```
- Use the sgMail.send method to compose and send emails. You can customize the content, subject, recipients, and other details. Customize the msg object with the relevant details for your email content.
- Implement error handling to log any issues during the email sending process.
   ```
       sgMail.send(msg)
            .then(() => console.log('Email sent successfully'))
            .catch((error) => {
              console.error('Error sending email:', error);
            });
   ```
----

## The choices made in terms of database design and implementation.

### Database Design
#### a. User Management:
- Use a Users table to store user information.
- Include fields such as userId, firstName, lastName, password (hashed), role (Author, Admin, Retail User).

#### b. Book Management:
- Create a Books table to store book details.
- Fields include bookId, authors (can be an array for multiple authors), sellCount (can be computed dynamically), title, description, and price.

#### c. Purchase History:
- Implement a PurchaseHistory table to store purchase records.
- Fields include purchaseId, bookId, userId, purchaseDate, price, and quantity.

#### d. Revenue Tracking:
- To track revenue for authors, calculate and store revenue in the Authors table.
- Authors table may include fields like authorId, authorName, totalRevenue, etc.

#### e. Email Notification:

- Use a separate EmailQueue table to queue up email notifications.
- Fields include emailId, recipient, subject, body, and status.
- Process this queue asynchronously using a background job or message queue.
  
### Database Implementation:

**a. User Management:**
1. Use Sequelize to define the Users model with necessary validations and associations.
2. Implement authentication using techniques like JWT (JSON Web Tokens) for secure user sessions.


**b. Book Management:**
1. Define the Books model using Sequelize, enforcing uniqueness on bookId and title.
2. Implement a separate logic to update sellCount based on purchase history.

   
**c. Purchase History:**
1. Create a Sequelize model for PurchaseHistory with associations to Users and Books.
2. Generate unique purchaseId using Sequelize hooks.


**d. Revenue Tracking:**
1. Integrate revenue tracking logic within the purchase process.
2. Use separate functions to update author revenue when a book is purchased.



   
