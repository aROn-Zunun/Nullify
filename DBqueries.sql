##ds.js should handle if the databas isnt made yet , but to get admin status run this query to get admin privileg and set the username to the correct one


UPDATE users SET is_admin = 1 WHERE username = 'YOUR_USERNAME';