# FramFresh Web Application

A full-stack web application to streamline bulk vegetable and fruit orders. Buyers can browse products, place bulk orders, and track them, while admins can efficiently manage inventory and order fulfillment.

---

## 🌟 Features

### 🛒 Buyer/User Side
- Browse available vegetables/fruits
- Place bulk orders with delivery details
- Track order status via order ID
- View all personal orders

### 🛠️ Admin Side
- View all incoming orders
- Update order statuses: `Pending → In Progress → Delivered`
- Add, update, or delete products
- View personal product catalogue

---

## 🧑‍💻 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based login/register (Buyer & Admin)

---

## ⚙️ Project Setup

### 1. Clone the Repository
```bash
    git clone https://github.com/Manideepchopperla/FarmFresh.git
    cd FarmFresh
```
2. **Install dependencies**:

    ```bash
    cd Client
      npm install
    cd ../Server
      npm install
    ```

3. **Start the development server**:
    1. Build the frontend : 
    ```bash
    cd Client 
    npm run build
    ```
    
    2. Serve the frontend : 
    ```bash
    cd ../Server
    node index.js


4. Open your browser and navigate to `http://localhost:3000` to view the app.

## 🗄️ MongoDB Setup

### 1. Create a MongoDB Database
- Sign up or log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Create a new project and then a new cluster.
- Choose a free tier if you're just testing.

### 2. Configure Database Access
- Go to the "Database Access" section.
- Create a new database user with read and write access.
- Note down the username and password.

### 3. Whitelist Your IP Address
- In the "Network Access" section, add your current IP address to allow connections.

### 4. Get Your Connection String
- In the "Clusters" section, click on "Connect" and then "Connect your application".
- Copy the connection string provided.

### 5. Update Your Environment Variables
- Create a `.env` file in the root of the `Server` directory:
    ```bash
    MONGODB_URI=your_mongo_connection_string
    PORT=3000
    JWT_SECRET=your_jwt_secret
    ```
- Replace `your_mongo_connection_string` with the connection string you copied earlier, ensuring to replace `<username>` and `<password>` with your actual MongoDB username and password.

**Note:** Do not commit this file to the repository..

## Contact

For any inquiries, please reach out to:

- **Name:** Manideep Chopperla
- **Email:** [manideepchopperla1808@gmail.com](mailto:manideepchopperla1808@gmail.com)
- **GitHub:** [Manideepchopperla](https://github.com/Manideepchopperla)





