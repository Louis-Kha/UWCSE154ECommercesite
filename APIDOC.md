Name: Get Item Information
Request Format: /:itemID
Request Type: GET
Description: Gets an items information, such as price and name, picture, type, etc.
Example Request: /0001
Return Type: JSON Object
Example Response:
{
  "name": "Banana"
  "price": "$1.20"
  "picture": "/items/banana.png"
  "type": "fruit"
  "description": "A potassium filled fruit!"
}
Error Handling:
Possible 400 (invalid request) error (all plain text):
  "Item ID does not match any item in store."
Possible 500 Request (all plain text):
  "Trouble reaching website, try again at another time."

Name: Get Account Information
Description: Gets all account information such as account name, purchase history, balance
Side Effects
Method: GET
Parameters: Account ID
Return Type: JSON Object
Example Request
Example Response
Errors

Name: Get Previous Transactions
Description: Gets account previous transactions
Side Effects
Method: GET
Parameters: Account ID
Return Type: JSON Object
Example Request
Example Response
Errors

Name: Get Reviews
Request Format: /:itemID/reviews
Request Type: GET
Return Data Format: JSON Object
Description: Gets all user reviews for an item
Example Request: /:itemID/reviews
Example Response:
{
  "userid": "12345"
  "review": "This banana is very delicious and filled with potassium!"
  "rating": "5"
}
Error Handling:
Possible 400 (invalid request) error (all plain text):
  "Item ID does not match any item in store."
Possible 400 (invalid request) error (all plain text):
  "Item does not have any reviews."
Possible 500 Request (all plain text):
  "Trouble reaching website, try again at another time."


POST
-
Name: Log in / create account
Description: Allows the user to log in or create an account
Side Effects: If the user doesn't have an account, adding their information to the database
Method: POST
Parameters: Form Data (Email, Password)
Return Type: Promise
Example Request
Example Response
Errors

Name: Purchase Items
Description: Allows the user to purchase items with their account if they have enough balance
Side Effects: Decreases balance, adds to purchase history
Method: POST
Parameters: All Items in cart, Account ID
Return Type: Promise
Example Request
Example Response
Errors

Name: Edit account information
Description: Allows user to change password / account information
Side Effects: Changes User email, password, or account information
Method: POST
Parameters: Form Data (Account ID, What's being changed, New value)
Return Type: Promise
Example Request
Example Response
Errors

Name: Post reviews
Request Format: /review endpoint with POST parameters of "itemID" and "score" and "review" and "userID"
Request Type: POST
Returned Data Format: Plain Text
Description: Allows user to post a review of an item
Parameters: Form Data (Item ID, Account ID, review)
Return Type: Promise
Example Request: /review endpoint with POST parameters of itemid=00001 and score=5 and review="its pretty good" and userid=12345
Example Response: "Review Successfully Posted!"
Error Handling:
Possible 400 (invalid request) errors (all plain text):
  If missing itemid, an error is returned with the message: "No Item selected to review"
  If missing score, an error is returned with the message: "No score given to item"
  If missing review, an error is returned with the message: "No review written for item"
  If missing userid, an error is returned with the message: "Invalid user, log in to post review"

