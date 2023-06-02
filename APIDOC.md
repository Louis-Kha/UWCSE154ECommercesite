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

### Name: Get Account Information
* Description: Gets all account information such as account name, purchase history, balance
* Side Effects: None
* Method: GET
* Parameters: Account ID
* Return Type: JSON Object
* Example Request: .../123
* Example Response
```json
{
  "username" : "Account"
  "password" : "hash"
  "balance" : 123
  [
    {
      "name": "Banana"
      "price": "$1.20"
      "picture": "/items/banana.png"
      "type": "fruit"
      "description": "A potassium filled fruit!"
    },
    {
      "name": "Banana"
      "price": "$1.20"
      "picture": "/items/banana.png"
      "type": "fruit"
      "description": "A potassium filled fruit!"
    }
  ]
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

### POST

### Name: Log in
* Description: Allows the user to log in
* Side Effects: None
* Method: POST
* Parameters: Form Data (Email, Password)
* Return Type: Promise
* Example Request: /newUsername=?&newPassword=?
* Example Response: True or False;
* Errors:
  * Possible 400 Request (all plain text):
    * "Username or Password is wrong"
  * Possible 500 Request (all plain text):
    * "Trouble reaching website, try again at another time."

### Name: Create account
* Description: Allows the user to create an account
* Side Effects: Adds username and password to database.
* Method: POST
* Parameters: Form Data (Email, Password)
* Return Type: Promise
* Example Request: /newUsername=?&newPassword=?
* Example Response: True or False;
* Errors:
  * Possible 400 Request (all plain text): "Username already exists"
  * Possible 500 Request (all plain text): "Trouble reaching website, try again at another time."


### Name: Purchase Items
* Description: Allows the user to purchase items with their account if they have enough balance
* Side Effects: Decreases balance, adds to purchase history
* Method: POST
* Parameters: All Items in cart, Account ID
* Return Type: Promise
* Example Request: items=?&accountID=123
* Example Response: ItemPurchaseID : 123
* Errors:
  * Possible 400 Request (all plain text): "Insufficient Balance"
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