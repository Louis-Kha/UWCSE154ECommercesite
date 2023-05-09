GET 
Name: Get Item Information
Description: Gets all items that are being sold and their information, such as price and name picture, type, etc.
Side Effects: No side effects 
Method: GET
Parameters: Item ID 
Return Type: JSON Object 
Example Request 
Example Response 
Errors 

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
Description: Gets all user reviews for an item
Side Effects 
Method: GET 
Parameters: Item ID 
Return Type: JSON Text 
Example Request 
Example Response 
Errors 

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
Description: Allows user to post a review of an object 
Side Effects: Adds new review linked to item 
Method: Post
Parameters: Form Data (Item ID, Account ID, review) 
Return Type: Promise 
Example Request 
Example Response 
Errors 
