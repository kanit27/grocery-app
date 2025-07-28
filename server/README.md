# 🚀 User Registration Process

## 📌 Overview
This document provides a detailed guide on the **User Registration Process**, covering:
- 🔹 API Endpoints
- 🔹 Request & Response Format
- 🔹 Validation Rules
- 🔹 Backend Flow
- 🔹 Project Structure

-------------------------------------------------------------------------------------------------

## 🔗 API Endpoint
### **🔹 POST /users/register**
This endpoint allows new users to register and receive an authentication token for future access.

-------------------------------------------------------------------------------------------------

## 📥 Request & 📤 Response
### **📌 Request Process**
✅ The client submits a request with the user’s **full name, email, and password**.
✅ The system **hashes** the password before storing it securely.

### ✅ **Success Response (201 Created)**
✔️ Returns user details (**excluding password**) and a **JWT authentication token**.
✔️ The token can be used for future authenticated requests.

### ❌ **Error Handling**
⚠️ **400 Bad Request:** Invalid input (e.g., incorrect email format, short password).
⚠️ **409 Conflict:** Email already exists in the system.
⚠️ **500 Internal Server Error:** Unexpected server issue.

-------------------------------------------------------------------------------------------------

## ✅ Validation Rules
To ensure data integrity, the following validation is enforced:
- 📧 **Email:** Must be a valid format.
- 🔤 **First Name:** At least **3 characters long**.
- 🔑 **Password:** Must contain **at least 6 characters**.

If validation fails, the system responds with an error message, preventing incorrect data entry.

-------------------------------------------------------------------------------------------------

## 🔄 Backend Flow
### **📌 Step-by-Step Execution**
1️⃣ **Incoming Request** → User data is sent to the `/register` endpoint.
2️⃣ **Validation Checks** → Ensures compliance with input rules.
3️⃣ **Password Encryption** → Securely hashes the password before storing.
4️⃣ **Database Entry** → User record is saved in MongoDB.
5️⃣ **Token Generation** → A JWT token is issued for authentication.
6️⃣ **Response Sent** → Returns user details and authentication token.

-------------------------------------------------------------------------------------------------

## 📂 Project Structure
### **Key Components & Responsibilities**
🛠 **Routes:** Defines API paths & enforces input validation.
🛠 **Controllers:** Manages request handling & response generation.
🛠 **Services:** Handles business logic such as user creation.
🛠 **Models:** Defines database structure, handles password hashing & token generation.

This modular approach ensures **scalability and maintainability**.

-------------------------------------------------------------------------------------------------

# 🔐 User Login Process

## 📌 Overview
This document provides a detailed guide on the **User Login Process**, covering:
- 🔹 API Endpoints
- 🔹 Request & Response Format
- 🔹 Validation Rules
- 🔹 Backend Flow
- 🔹 Project Structure

-------------------------------------------------------------------------------------------------

## 🔗 API Endpoint
### **🔹 POST /users/login**
This endpoint allows existing users to authenticate by providing valid credentials.

-------------------------------------------------------------------------------------------------

## 📥 Request & 📤 Response
### **📌 Request Process**
✅ The client submits a request with the **email and password**.
✅ The system verifies the credentials and returns an authentication token if valid.

### ✅ **Success Response (200 OK)**
✔️ Returns user details (**excluding password**) and a **JWT authentication token**.
✔️ The token can be used for future authenticated requests.

### ❌ **Error Handling**
⚠️ **400 Bad Request:** Invalid input (e.g., incorrect email format, missing password).
⚠️ **401 Unauthorized:** If email or password is incorrect.
⚠️ **500 Internal Server Error:** Unexpected server issue.

-------------------------------------------------------------------------------------------------

## ✅ Validation Rules
Before processing the request, input fields are validated:
- 📧 **Email:** Must be in a valid format.
- 🔑 **Password:** Minimum 6 characters required.

If validation fails, an error message is returned to the client, preventing incorrect login attempts.

-------------------------------------------------------------------------------------------------

## 🔄 Backend Flow
### **📌 Step-by-Step Execution**
1️⃣ **Incoming Request** → User submits email and password to `/login`.
2️⃣ **Validation Checks** → Ensures compliance with input rules.
3️⃣ **Find User in Database** → Checks if the user exists.
4️⃣ **Password Verification** → Compares the provided password with the stored hashed password.
5️⃣ **Token Generation** → Issues a JWT token upon successful authentication.
6️⃣ **Response Sent** → Returns user details and authentication token.

-------------------------------------------------------------------------------------------------

## 📂 Project Structure
### **Key Components & Responsibilities**
🛠 **Routes:** Defines API paths & enforces input validation.
🛠 **Controllers:** Manages request handling & response generation.
🛠 **Services:** Handles business logic such as authentication.
🛠 **Models:** Defines database structure, handles password comparison & token generation.

This modular approach ensures **scalability and maintainability**.

-------------------------------------------------------------------------------------------------

# 🔐 Middleware (User Authentication)

#### 📌 What is Authentication Middleware?
Authentication middleware ensures that only authenticated users can access protected routes. It acts as a security checkpoint, verifying JWT tokens and checking if they are blacklisted.

#### ✅ How It Works (Step-by-Step)
1. **Extract Token** → Middleware retrieves the token from the request headers or cookies.
2. **Check Blacklist** → The token is checked against the blacklisted tokens database (to prevent reuse after logout).
3. **Verify Token** → If the token is valid, it is decoded to extract user details.
4. **Find User** → The user associated with the token is fetched from the database.
5. **Attach User to Request** → If authentication is successful, the user object is added to the request, allowing access to protected routes.

#### ❌ Error Handling
- **401 Unauthorized** → If the token is missing, invalid, expired, or blacklisted.
- **403 Forbidden** → If the token is valid but the user lacks required permissions.

#### 🔄 Why is Authentication Middleware Important?
- ✅ Prevents unauthorized users from accessing sensitive routes.
- ✅ Blocks blacklisted tokens from being used again.
- ✅ Strengthens security by ensuring valid authentication before access is granted.

-------------------------------------------------------------------------------------------------

# 🚪 User Logout Process

#### 📌 What is the Logout Process?
The logout process invalidates a user’s session by blacklisting the authentication token and ensuring it cannot be used again.

#### ✅ How It Works (Step-by-Step)
1. **Extract Token** → The token is retrieved from the request headers or cookies.
2. **Verify Token** → The token is decoded to extract user information.
3. **Find User** → The user associated with the token is identified.
4. **Blacklist Token** → The token is stored in the Blacklist Token Model, preventing reuse.
5. **Clear Cookie** → The authentication token is removed from the client’s storage.
6. **Send Response** → The system confirms logout success to the user.

#### 🚫 Token Blacklisting
- Ensures that logged-out users cannot reuse their token.
- Blacklisted tokens expire after 24 hours to maintain database efficiency.
- Middleware checks every request against the blacklist to prevent unauthorized access.

#### ❌ Error Handling
- **400 Bad Request** → No token provided in the request.
- **401 Unauthorized** → Token is already invalid or user not found.
- **500 Internal Server Error** → Unexpected logout failure.

#### 🔄 Why is Logout Important?
- ✅ Prevents unauthorized access after logout.
- ✅ Strengthens security by blacklisting old tokens.
- ✅ Ensures users must re-authenticate after logging out.

-------------------------------------------------------------------------------------------------

# 🚀 Caption Registration Process

## 📌 Overview
This document provides a detailed guide on the **Caption Registration Process**, covering:
- 🔹 API Endpoints
- 🔹 Request & Response Format
- 🔹 Validation Rules
- 🔹 Backend Flow
- 🔹 Project Structure

-------------------------------------------------------------------------------------------------

## 🔗 API Endpoint
### **🔹 POST /caption/register**
This endpoint allows new captions to register and receive an authentication token for future access.

-------------------------------------------------------------------------------------------------

## 📥 Request & 📤 Response
### **📌 Request Process**
✅ The client submits a request with the caption’s **full name, email, password, and vehicle details**.
✅ The system **hashes** the password before storing it securely.

### ✅ **Success Response (201 Created)**
✔️ Returns caption details (**excluding password**) and a **JWT authentication token**.
✔️ The token can be used for future authenticated requests.

### ❌ **Error Handling**
⚠️ **400 Bad Request:** Invalid input (e.g., incorrect email format, short password, missing vehicle details).
⚠️ **409 Conflict:** Email or vehicle plate already exists in the system.
⚠️ **500 Internal Server Error:** Unexpected server issue.

-------------------------------------------------------------------------------------------------

## ✅ Validation Rules
To ensure data integrity, the following validation is enforced:
- 📧 **Email:** Must be a valid format.
- 🔤 **First Name:** At least **3 characters long**.
- 🔑 **Password:** Must contain **at least 6 characters**.
- 🚗 **Vehicle Color:** At least **3 characters long**.
- 🔢 **Vehicle Plate:** At least **3 characters long**.
- 🔢 **Vehicle Capacity:** Must be a number.
- 🚗 **Vehicle Type:** Must be one of **car, motorcycle, or auto**.

If validation fails, the system responds with an error message, preventing incorrect data entry.

-------------------------------------------------------------------------------------------------

## 🔄 Backend Flow
### **📌 Step-by-Step Execution**
1️⃣ **Incoming Request** → Caption data is sent to the `/register` endpoint.
2️⃣ **Validation Checks** → Ensures compliance with input rules.
3️⃣ **Password Encryption** → Securely hashes the password before storing.
4️⃣ **Database Entry** → Caption record is saved in MongoDB.
5️⃣ **Token Generation** → A JWT token is issued for authentication.
6️⃣ **Response Sent** → Returns caption details and authentication token.

-------------------------------------------------------------------------------------------------

## 📂 Project Structure
### **Key Components & Responsibilities**
🛠 **Routes:** Defines API paths & enforces input validation.
🛠 **Controllers:** Manages request handling & response generation.
🛠 **Services:** Handles business logic such as caption creation.
🛠 **Models:** Defines database structure, handles password hashing & token generation.

This modular approach ensures **scalability and maintainability**.

-------------------------------------------------------------------------------------------------

# 🔐 Caption Login Process

## 📌 Overview
This document provides a detailed guide on the **Caption Login Process**, covering:
- 🔹 API Endpoints
- 🔹 Request & Response Format
- 🔹 Validation Rules
- 🔹 Backend Flow
- 🔹 Project Structure

-------------------------------------------------------------------------------------------------

## 🔗 API Endpoint
### **🔹 POST /caption/login**
This endpoint allows existing captions to authenticate by providing valid credentials.

-------------------------------------------------------------------------------------------------

## 📥 Request & 📤 Response
### **📌 Request Process**
✅ The client submits a request with the **email and password**.
✅ The system verifies the credentials and returns an authentication token if valid.

### ✅ **Success Response (200 OK)**
✔️ Returns caption details (**excluding password**) and a **JWT authentication token**.
✔️ The token can be used for future authenticated requests.

### ❌ **Error Handling**
⚠️ **400 Bad Request:** Invalid input (e.g., incorrect email format, missing password).
⚠️ **401 Unauthorized:** If email or password is incorrect.
⚠️ **500 Internal Server Error:** Unexpected server issue.

-------------------------------------------------------------------------------------------------

## ✅ Validation Rules
Before processing the request, input fields are validated:
- 📧 **Email:** Must be in a valid format.
- 🔑 **Password:** Minimum 6 characters required.

If validation fails, an error message is returned to the client, preventing incorrect login attempts.

-------------------------------------------------------------------------------------------------

## 🔄 Backend Flow
### **📌 Step-by-Step Execution**
1️⃣ **Incoming Request** → Caption submits email and password to `/login`.
2️⃣ **Validation Checks** → Ensures compliance with input rules.
3️⃣ **Find Caption in Database** → Checks if the caption exists.
4️⃣ **Password Verification** → Compares the provided password with the stored hashed password.
5️⃣ **Token Generation** → Issues a JWT token upon successful authentication.
6️⃣ **Response Sent** → Returns caption details and authentication token.

-------------------------------------------------------------------------------------------------

## 📂 Project Structure
### **Key Components & Responsibilities**
🛠 **Routes:** Defines API paths & enforces input validation.
🛠 **Controllers:** Manages request handling & response generation.
🛠 **Services:** Handles business logic such as authentication.
🛠 **Models:** Defines database structure, handles password comparison & token generation.

This modular approach ensures **scalability and maintainability**.

-------------------------------------------------------------------------------------------------

# 🔐 Middlware (Caption Authentication)

#### 📌 What is Caption Authentication Middleware?
Caption authentication middleware ensures that only authenticated captions can access protected routes. It acts as a security checkpoint, verifying JWT tokens and checking if they are blacklisted.

#### ✅ How It Works (Step-by-Step)
1. **Extract Token** → Middleware retrieves the token from the request headers or cookies.
2. **Check Blacklist** → The token is checked against the blacklisted tokens database (to prevent reuse after logout).
3. **Verify Token** → If the token is valid, it is decoded to extract caption details.
4. **Find Caption** → The caption associated with the token is fetched from the database.
5. **Attach Caption to Request** → If authentication is successful, the caption object is added to the request, allowing access to protected routes.

#### ❌ Error Handling
- **401 Unauthorized** → If the token is missing, invalid, expired, or blacklisted.
- **403 Forbidden** → If the token is valid but the caption lacks required permissions.

#### 🔄 Why is Caption Authentication Middleware Important?
- ✅ Prevents unauthorized captions from accessing sensitive routes.
- ✅ Blocks blacklisted tokens from being used again.
- ✅ Strengthens security by ensuring valid authentication before access is granted.

-------------------------------------------------------------------------------------------------

# 🚪 Caption Logout Process 

#### 📌 What is the Caption Logout Process?
The logout process invalidates a caption’s session by blacklisting the authentication token and ensuring it cannot be used again.

#### ✅ How It Works (Step-by-Step)
1. **Extract Token** → The token is retrieved from the request headers or cookies.
2. **Verify Token** → The token is decoded to extract caption information.
3. **Find Caption** → The caption associated with the token is identified.
4. **Blacklist Token** → The token is stored in the Blacklist Token Model, preventing reuse.
5. **Clear Cookie** → The authentication token is removed from the client’s storage.
6. **Send Response** → The system confirms logout success to the caption.

#### 🚫 Token Blacklisting
- Ensures that logged-out captions cannot reuse their token.
- Blacklisted tokens expire after 24 hours to maintain database efficiency.
- Middleware checks every request against the blacklist to prevent unauthorized access.

#### ❌ Error Handling
- **400 Bad Request** → No token provided in the request.
- **401 Unauthorized** → Token is already invalid or caption not found.
- **500 Internal Server Error** → Unexpected logout failure.

#### 🔄 Why is Logout Important?
- ✅ Prevents unauthorized access after logout.
- ✅ Strengthens security by blacklisting old tokens.
- ✅ Ensures captions must re-authenticate after logging out.

-------------------------------------------------------------------------------------------------