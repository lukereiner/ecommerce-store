<h1>🛒 Full-Stack E-Commerce Platform</h1>

<p>
  A production-grade, end-to-end e-commerce web application built using the <strong>PERN stack</strong> (PostgreSQL, Express, React, Node.js). 
  Designed with modern developer and user experience in mind, this project demonstrates secure local authentication, persistent shopping cart state, PCI-compliant payment processing, and full order lifecycle management including payment refunds.
</p>

<p>
  <strong>🌐 Live Application:</strong> <a href="https://ecommerce-store-backend-m0nn.onrender.com/" target="_blank">https://ecommerce-store-backend-m0nn.onrender.com/</a>
</p>

---

<h2>🎬 Demos</h2>

<table width="100%">
  <tr>
    <td align="center" width="50%">
      <h3>🖥️ Desktop Walkthrough</h3>
      <img src="https://youtu.be/Fa_onVQ0_o8" alt="Desktop Demo" width="100%"/>
      <p><em>Desktop demo video coming soon / linked here</em></p>
    </td>
    <td align="center" width="50%">
      <h3>📱 Mobile Responsive Walkthrough</h3>
      <img src="https://youtu.be/TUr_WsKLrp8" alt="Mobile Demo" width="100%"/>
      <p><em>Mobile demo video coming soon / linked here</em></p>
    </td>
  </tr>
</table>

---

<h2>📋 Project Overview</h2>

<p>
  This application serves as a fully functional storefront platform featuring a modern client interface and a REST API architecture.
</p>

<h3>For General Users</h3>
<ul>
  <li><strong>Account Management:</strong> Register a new user account, securely log in, and maintain an active session across visits.</li>
  <li><strong>Product Discovery:</strong> Browse a catalog of items with real-time inventory and pricing feedback.</li>
  <li><strong>Cart Operations:</strong> Seamlessly add, update, and remove items from the shopping cart.</li>
  <li><strong>Secure Checkout:</strong> Complete purchases safely using integrated credit card processing powered by Square.</li>
</ul>

<h4>Credit Card Information - Simulate Payments</h4>
<dl>
    <dt>Card Number</dt>
    <dd>4111111111111111</dd>
    <dt>Expiration Date</dt>
    <dd>12/30</dd>
    <dt>CVV</dt>
    <dd>123</dd>
    <dt>Zip Code</dt>
    <dd>90218</dd>
</dl>

<h3>For Developers</h3>
<ul>
  <li><strong>Raw SQL Efficiency:</strong> Utilizes native PostgreSQL queries via <code>node-postgres</code> (<code>pg</code>) without an ORM layer for maximum query optimization and direct database control.</li>
  <li><strong>Session-Based Auth:</strong> Implements local authentication using <code>Passport.js</code>, <code>bcrypt</code> password hashing, and persistent cookie sessions.</li>
  <li><strong>PCI-Compliant Payment Pipeline:</strong> Integrates the Square Web Payments SDK to client-side tokenize card data, ensuring sensitive credit card numbers never hit the application server.</li>
  <li><strong>Refund & Order Lifecycle:</strong> Leverages the Square Payments API backend SDK to process payment charges, capture transactions, and handle programmatic payment refunds.</li>
  <li><strong>Modern Front-End:</strong> Built with React, Vite, and Tailwind CSS for rapid rendering, strict build step optimization, and a fully responsive layout across all device viewports.</li>
</ul>

---

<h2>🛠️ Tech Stack</h2>

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technologies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>React, Vite, Tailwind CSS, Axios, React Router</td>
    </tr>
    <tr>
      <td><strong>Backend</strong></td>
      <td>Node.js, Express.js, Passport.js (Local Strategy)</td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>PostgreSQL, <code>node-postgres</code> (<code>pg</code>) driver</td>
    </tr>
    <tr>
      <td><strong>Payment Infrastructure</strong></td>
      <td>Square Web Payments SDK, Square Node.js SDK</td>
    </tr>
    <tr>
      <td><strong>Hosting & Deployment</strong></td>
      <td>Render / PostgreSQL Cloud Hosting</td>
    </tr>
  </tbody>
</table>

---

<h2>🏗️ System Architecture & Workflow</h2>

<pre><code>
 [ User Client ]
        │
        ▼ (Vite / React + Tailwind CSS - Port 5173)
┌─────────────────────────────────────────────────────────┐
│  - User Authentication Views & State Management        │
│  - Shopping Cart Management                             │
│  - Square Web Payments SDK (Card Tokenization)          │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ Secure REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ Node.js / Express Server (Port 3000)                    │
│                                                         │
│  ├── Passport.js (Local Strategy, Express Session)      │
│  ├── Raw SQL Repositories (node-postgres / pg)         │
│  └── Square Payment Controller (Charges & Refunds)      │
└───────────────┬─────────────────────────────┬───────────┘
                │                             │
    Raw SQL     │                             │ API Requests
    Queries     ▼                             ▼
┌──────────────────────┐        ┌─────────────────────────┐
│ PostgreSQL Database  │        │ Square Payment Gateway  │
│ (Port 5432)          │        │ (Sandbox / Production)  │
└──────────────────────┘        └─────────────────────────┘
</code></pre>

---

<h2>⚙️ Local Development Setup</h2>

<h3>Prerequisites</h3>
<ul>
  <li><strong>Node.js:</strong> v18.x or higher</li>
  <li><strong>PostgreSQL:</strong> Local server running on port <code>5432</code> or a remote instance URL</li>
  <li><strong>Square Developer Account:</strong> Application ID, Access Token, and Location ID (Sandbox or Production)</li>
</ul>

---

<h3>1. Backend Setup</h3>

<p>Navigate to the server directory, install dependencies, configure environment variables, and start the development server:</p>

<pre><code># Navigate into backend directory
cd server

# Install Node dependencies
npm install

# Create environment configuration file
cp .env.example .env
</code></pre>

<p>Configure your <code>.env</code> file with the appropriate credentials:</p>

<pre><code>
# SERVER
PORT=3000
# For local development
CLIENT_URL=http://localhost:5173
# Deployment in Render
DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/ecommerce_db

# DATABASE
PGHOST='localhost'
PGUSER='api'
PGDATABASE='api'
PGPASSWORD='api'
PGPORT=5432

SESSION_SECRET=your_secure_random_session_secret

# Square Developer Variables
SQUARE_ACCESS_TOKEN=your_square_access_token
VITE_SQUARE_LOCATION_ID=your_square_location_id
VITE_SQUARE_APP_ID=sandbox
</code></pre>

<p>Run database migrations/scripts and start the API server:</p>

<pre><code># Run database setup / migration scripts 001-009 in <code>/db</code> folder

# Start development server
node --watch server.js
</code></pre>

<p>The Express API server will start at <code>http://localhost:3000</code>.</p>

---

<h3>2. Frontend Setup</h3>

<p>In a separate terminal window, set up and run the React client:</p>

<pre><code># Navigate into root directory & Install Node dependencies
npm install

# Create frontend environment file
cp .env.example .env
</code></pre>

<p>Configure your client <code>.env</code> file:</p>

<pre><code>VITE_API_BASE_URL=http://localhost:3000
VITE_SQUARE_APPLICATION_ID=your_square_application_id
VITE_SQUARE_LOCATION_ID=your_square_location_id
</code></pre>

<p>Start the Vite development server:</p>

<pre><code># Start client application
npm run dev
</code></pre>

<p>The application will be accessible at <code>http://localhost:5173</code>.</p>

---

<h2>🛡️ Security & Quality Highlights</h2>

<ul>
  <li><strong>Credential Isolation:</strong> Sensitive credentials (DB passwords, Square keys, session secrets) are isolated via environment variables and excluded from source control.</li>
  <li><strong>Password Hashing:</strong> User passwords are encrypted using strong salted hashing before storage in PostgreSQL.</li>
  <li><strong>Tokenized Transactions:</strong> Payment information is never processed as plain text on the application server; raw credentials are converted into single-use tokens directly by Square's client SDK.</li>
</ul>