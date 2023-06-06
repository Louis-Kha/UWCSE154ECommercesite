### Name: Get Item Information
* Request Format: /main-view/items
* Side Effects: None
* Request Type: GET
* Parameters: Search, Category
* Description: Gets an item's information, such as price and name, picture, type, etc.
* Example Request: /main-view/items
* Example Request: /main-view/items?search=ba
* Return Type: JSON Object
* Example Response:
```json
{
  "store": [
    {
      "id": 1,
      "name": "Banana",
      "price": "0.65",
      "category": "Fruit",
      "description": "A Delicious yellow elongated fruit rich in potassium.",
      "stock": -1,
      "src": "https://images.heb.com/is/image/HEBGrocery/000377497"
    }
  ]
}
```
* Error Handling:
* Possible 500 Request (all plain text):
  * "An error occurred on the server. Try again later."

### Name: Get Purchase History
* Description: Get's user's entire purchase history
* Side Effects: None
* Example Format: /purchases/history/:username
* Method: GET
* Parameters: Account Username
* Return Type: JSON Object
* Example Request: /purchases/history/username
* Example Response
```json
{
  {
    "name": "Banana"
    "price": "$1.20"
    "src": "/items/banana.png"
    "quantity": 1
  },
  {
    "name": "Banana"
    "price": "$1.20"
    "src": "/items/banana.png"
    "type": "fruit"
    "quantity": 1
  }
}
```

### Name: Get Reviews
* Request Format: /item-view/reviews/:item
* Side Effects: None
* Request Type: GET
* Return Data Format: JSON Object
* Description: Gets all user reviews for an item
* Example Request: /item-view/reviews/:item
* Example Response:
```json
{
  "reviews": [
    {
      "item": "Banana",
      "username": "Carlos",
      "score": 4,
      "review": "I like the color of it when it ripens.",
      "date": "2023-05-29 06:25:12"
    }
  ]
}
```
* Error Handling:
* Possible 400 (invalid request) error (all plain text):
  * "Missing item parameter, please try again!"
* Possible 500 Request (all plain text):
  * "An error occurred on the server. Try again later."

### Name: Check Stock in Cart
* Request Format: /checkout/stock/:username
* Side Effects: None
* Request Type: GET
* Return Data Format: Text
* Description: Checks if  all the items in the user's cart has sufficient stock
* Example Request: /checkout/stock/username
* Example Response: "Sufficient Stock" or "Error: Insufficient Stock"
* Error Handling:
* Possible 400 (invalid request) error (all plain text):
  * "Error: Insufficient Stock"
* Possible 500 Request (all plain text):
  * "An error occurred on the server. Try again later."

### Name: Check Stock in Purchases
* Request Format: /purchases/stock/:username/:orderNumber
* Side Effects: None
* Request Type: GET
* Return Data Format: Text
* Description: Checks if all the items in the user's requested purchase has sufficient stock
* Example Request: /purchases/stock/username/123456
* Example Response: "Sufficient Stock" or "Error: Insufficient Stock"
* Error Handling:
* Possible 400 (invalid request) error (all plain text):
  * "Error: Insufficient Stock"
* Possible 500 Request (all plain text):
  * "An error occurred on the server. Try again later."

### Name: Check UID
* Request Format: /checkout/uid
* Side Effects: None
* Request Type: GET
* Return Data Format: Text
* Description: Checks if the given UID exists in the table already or not
* Example Request: /checkout/uid?uid=123456
* Example Response: 0 or 1
* Error Handling:
* Possible 500 Request (all plain text):
  * "An error occurred on the server. Try again later."

### Name: Get All Cart Items
* Request Format: /checkout/cart/:username
* Side Effects: None
* Request Type: GET
* Return Data Format: Text
* Description: Returns a JSON object of all items currently in the user's cart
* Example Request: /checkout/cart/username
* Example Response:
```json
{
  {
    "name": "Banana"
    "price": "$1.20"
    "src": "/items/banana.png"
    "quantity": 1
  },
  {
    "name": "Banana"
    "price": "$1.20"
    "src": "/items/banana.png"
    "type": "fruit"
    "quantity": 1
  }
}
```
* Error Handling:
* Possible 500 Request (all plain text):
  * "An error occurred on the server. Try again later."

### POST

### Name: Log in
* Description: Allows the user to log in
* Side Effects: None
* Method: POST
* Parameters: Form Data (Email, Password)
* Return Type: Promise
* Example Request: /login
* Example Response: Username or "Incorrect Username or Password";
* Errors:
  * Possible 400 Request (all plain text):
    * "Username or Password is wrong"
  * Possible 500 Request (all plain text):
    * "Trouble reaching website, try again at another time."

### Name: Purchase Items
* Description: Allows the user to purchase items with their account if they have there is enough stock
* Side Effects: Adds to purchase history
* Method: POST
* Parameters: {username, itemName, quantity, date, uid}
* Return Type: Promise
* Example Request: /checkout/buy
* Example Response: ItemPurchaseID : 123456
* Errors:
  * Possible 400 Request (all plain text): "Insufficient Stock"
  * Possible 500 Request (all plain text): "Trouble reaching website, try again at another time."

### Name: Change Stock
* Description: Reduces the specified item's stock by the quantity just bought
* Side Effects: Reduces "stock" in store table
* Method: POST
* Parameters: {itemName, stock}
* Return Type: Text
* Example Request: /checkout/changeStock
* Example Response: "Stock Changed"
* Errors:
  * Possible 500 Request (all plain text): "Trouble reaching website, try again at another time."

  ### Name: Change Quantity
* Description: Changes the specified item's quantity in the user's cart
* Side Effects: Reduces "quantity" in cart table
* Method: POST
* Parameters: {itemName, username, flag}
* Return Type: Text
* Example Request: /checkout/changeStock
* Example Response: 1
* Errors:
  * Possible 500 Request (all plain text): "Trouble reaching website, try again at another time."

### Name: Clear Cart
* Description: Clear's the current user's cart
* Side Effects: Removes all indecies of the current user in the cart table
* Method: POST
* Parameters: {username}
* Return Type: Text
* Example Request: /checkout/clear
* Example Response: cleared
* Errors:
  * Possible 500 Request (all plain text): "Trouble reaching website, try again at another time."


### Name: Edit account information
* Description: Allows user to change password / account information
* Side Effects: Changes User email, password, or account information
* Method: POST
* Parameters: Form Data (Account ID, What's being changed, New value)
* Return Type: Promise
* Example Request: newUser=?&newEmail=?&newPassword=?
* Example Response: True or False
* Errors:
  * Possible 400 Request (all plain text): "Username already exists"
  * Possible 500 Request (all plain text): "Trouble reaching website, try again at another time."


### Name: Post reviews
* Request Format: /rate endpoint with POST parameters of "item" and "username" and "review" and "score"
* Request Type: POST
* Returned Data Format: Plain Text
* Description: Allows user to post a review of an item
* Parameters: Form Data (item, username, review, score)
* Return Type: Promise
* Example Request: /review endpoint with POST parameters of item=Banana and username=carlos and review="its pretty good" and score=5
* Example Response: "Successfully Added Review!"
* Error Handling:
  * Possible 400 (invalid request) errors (all plain text):
    * If missing itemid, an error is returned with the message: "Missing one or more parameters, please try again!"
    * If missing score, an error is returned with the message: "Missing one or more parameters, please try again!"
    * If missing review, an error is returned with the message: "Missing one or more parameters, please try again!"
  * Possible 500 Request (all plain text):
    * "An error occurred on the server. Try again later."

### Name: Add Item to Cart
* Request Format: /itemview/add
* Request Type: POST
* Returned Data Format: Plain Text
* Description: Adds an item to the current user's cart, and if the item is already in the cart, it increases the quantity by 1 instead
* Parameters: Form Data (username, itemName)
* Return Type: Text
* Example Request: /itemview/add
* Example Response: "Added item into cart"
* Error Handling:
  * Possible 500 Request (all plain text):
    * "An error occurred on the server. Try again later."