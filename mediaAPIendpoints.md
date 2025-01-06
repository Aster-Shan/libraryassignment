<!--This is a simple setup often used for RESTful APIs in documentation or code comments, especially in OpenAPI or Swagger-style formats.
You should include as markdown file in your github repository and include the link to the folder in the report.-->

### Search Branches by Media

**Endpoint**:
[HTTP Method] GET [/api/inventory/search-branches]  
**Description**: [Retrieves a list of branches that have a particular media item available.]  
**Headers**:
- `Authorization`: Bearer [token] (required if the endpoint is protected)

- `Content-Type`: application/json

**Query Parameters** :
mediaId (type: Long, required): The ID of the media to search for across branches.


- `param_name` (type: string, required/optional): Description of the query parameter.

**Request Body**:

```json
{
   "id": 1,
    "name": "Branch 1",
    "address": "123 Main St, City A",
    "city": "City A"
  },
  {
    "id": 2,
    "name": "Branch 2",
    "address": "456 Elm St, City B",
    "city": "City B
}

```

### Search Inventory by Branch ID
**Endpoint**:
[HTTP Method] GET [/api/inventory/by-branch-id]  
**Description**: [Retrieves a list of media items available in a specific branch.]  
**Headers**:
- `Authorization`: Bearer [token] (required if the endpoint is protected)

- `Content-Type`: application/json

**Query Parameters** :
branchId (type: Long, required): The ID of the branch to search for available inventory.

**Request Body**:
Status: 200 OK
Body:

```json
{
  {
    "id": 12345,
    "title": "Media Title 1",
    "author": "Author 1",
    "available": true
  },
  {
    "id": 12346,
    "title": "Media Title 2",
    "author": "Author 2",
    "available": false
  }
}
```
###Borrow Media
**Endpoint**:
[HTTP Method] POST [/api/inventory/borrow ]
**Description**: [Allows a user to borrow a media item from a specific branch.]  
**Headers**:
- `Authorization`: Bearer [token] (required if the endpoint is protected)

- `Content-Type`: application/json

**Request Body**:


```json
{
  {
  "mediaId": 12345,
  "branchId": 1,
  "userId": 67890
  }
}
```

***Response***:
Status: 200 OK
Body:

```json
{
  "message": "Media borrowed successfully",
  "dueDate": "2024-11-20T00:00:00Z"
}
```

### Transfer Media Between Branches

**Endpoint**:  POST /api/inventory/transfer
**Description**:Transfers a media item from one branch to another.

**Headers**:

- `Authorization`: Bearer [token] (required)
- `Content-Type`: application/json

**Request Body**:

```json
{
"inventoryId": 12345,
  "toBranchId": 2
}
```

***Response***:

- Status: 201 Created
- Body:

```json
{
    "inventoryId": 12345,
  "branchId": 2,
  "message": "Media transferred successfully"
}
```

### Search Borrowed Media by User ID
**Endpoint**:
[HTTP Method] GET [/api/media-circulation/search]  
**Description**: [Retrieves a list of borrowed media items for a specific user.]  
**Headers**:
- `Authorization`: Bearer [token] (required if the endpoint is protected)

- `Content-Type`: application/json

**Query Parameters** :
userId (type: Long, required): The ID of the user to search for borrowed media.

**Request Body**:
Status: 200 OK
Body:

```json
{
  {
    "id": 12345,
    "title": "Media Title 1",
    "author": "Author 1",
    "borrowDate": "2024-11-01T00:00:00Z",
    "dueDate": "2024-11-20T00:00:00Z",
    "branchFullAddress": "123 Main St, City A",
    "renewalCount": 0
  },
  {
    "id": 12346,
    "title": "Media Title 2",
    "author": "Author 2",
    "borrowDate": "2024-11-03T00:00:00Z",
    "dueDate": "2024-11-23T00:00:00Z",
    "branchFullAddress": "456 Elm St, City B",
    "renewalCount": 1
  }
}
```

### Renew Borrowed Media

**Endpoint**:  POST [/api/media-circulation/renew]
**Description**:Renews the borrowing of a media item for the user.

**Headers**:

- `Authorization`: Bearer [token] (required)
- `Content-Type`: application/json

**Request Body**:

```json
{
"mediaCirculationId": 12345
}
```

***Response***:

- Status: 201 Created
- Body:

```json
{
   "id": 12345,
  "title": "Media Title 1",
  "author": "Author 1",
  "borrowDate": "2024-11-01T00:00:00Z",
  "dueDate": "2024-12-01T00:00:00Z",
  "branchFullAddress": "123 Main St, City A",
  "renewalCount": 1

}
```
### Return Borrowed Media

**Endpoint**:  POST [/api/media-circulation/return]
**Description**:Marks a borrowed media item as returned.
**Headers**:

- `Authorization`: Bearer [token] (required)
- `Content-Type`: application/json

**Request Body**:

```json
{
"mediaCirculationId": 12345
}
```

***Response***:

- Status: 201 Created
- Body:

```json
{
    "message": "Media returned successfully"
}