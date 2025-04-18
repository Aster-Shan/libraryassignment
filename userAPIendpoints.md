### Register User
**Endpoint:**
**[HTTP Method]** POST [/api/users/register]
**Description:** Registers a new user.
**Headers:**

Content-Type: application/json
**Request Body:**

json

{
  "id": 1,
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
**Response:**

Status: 200 OK
Body:
json

{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe"
}


### Login
**Endpoint:**
[HTTP Method] POST [/api/users/login]
**Description:** Logs in a user with email and password.
Headers:

**Content-Type:** application/json
**Request Body:**

json

{
  "email": "user@example.com",
  "password": "password123"
}
**Response:**

Status: 200 OK
Body:
json

{
  "token": "jwt-token",
  "userId": 1,
  "message": "Login successful"
}


### Forgot Password
**Endpoint:**
[HTTP Method] POST [/api/users/forgot-password]
**Description:** Initiates the password reset process for the provided email.
**Headers:**

Content-Type: application/json
**Request Body:**

json

{
  "email": "user@example.com"
}
**Response:**

Status: 200 OK
Body:
json

{
  "message": "Password reset link sent to email"
}

### Reset Password
**Endpoint:**
[HTTP Method] PUT [/api/users/reset-password]
**Description:** Resets the password using a token and a new password.
Headers:

Content-Type: application/json
**Query Parameters:**

token (type: String, required): The token received in the email for password reset.
**Request Body:**

json

{
  "newPassword": "newpassword123"
}
**Response:**

Status: 200 OK
Body:
json

{
  "message": "Password reset successfully"
}


### Verify Email
**Endpoint:**
[HTTP Method] POST [/api/users/verify-email]
**Description:** Verifies the email address using a token.
**Headers:**

Content-Type: application/json
Query Parameters:

token (type: String, required): The verification token.
Response:

Status: 200 OK
Body:
json

{
  "message": "Email verified successfully!"
}

### Update User
**Endpoint:**
[HTTP Method] PUT [/api/users/update]
**Description:** Updates the details of an existing user.
Headers:

Content-Type: application/json
**Request Body:**

json

{
  "id": 1,
  "email": "updateduser@example.com",
  "name": "Updated Name"
}
**Response:**

Status: 200 OK
Body:
json

{
  "id": 1,
  "email": "updateduser@example.com",
  "name": "Updated Name"
}

### Update Password
**Endpoint:**
[HTTP Method] POST [/api/users/update-password]
**Description:** Updates the password for an existing user.
Headers:

Content-Type: application/json
**Request Body:**

json

{
  "user": {
    "id": 1,
    "email": "updateduser@example.com"
  },
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
**Response:**

Status: 200 OK
Body:
json

{
  "id": 1,
  "email": "updateduser@example.com",
  "message": "Password updated successfully"
}
