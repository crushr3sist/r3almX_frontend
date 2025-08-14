so heres whats up
login flow:

  - user is prompted with google button for logging in
  - user clicks on thier google account
  - user's google token is sent to the backend
  - the backend decodes the token and gains user's info 
  - users data is commited to the database
  - user's data is then fetched from the database 
  - token is issued for the user
  - token is returned as the response
  - once the user is logged in
    - the token is suppose to be a vauge key thats send to the backend 
    - but what ends up happening is that i want it to be a reactive piece of data which controls the frontend application
    - this is done through providers. the providers control the component views.
    - this is made complex due to the notification system, i think i'll have to scrap the frontend functionality for the notifications. 
    - 