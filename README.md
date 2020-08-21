# MondayBoardUpdate

This Web App still is in developing phase.

## Purpose of this app
We use an ERP to manage our daily jobs, but the ERP is very poor to present job flows.

Monday can visualize job flows clearely and let users share information easiliy. 

In addition, Monday has awesome intergration and automation functions to make daily routine jobs easier and more efficiently.

Monday.com allows users to upload Excel file to initiate Board.

However, users have to upload new data on their exisinting board manually.

In our use case, it is a serious bottleneck.

Sometimes, we have to upload a few dozens jobs in a day.

The intense manual data entry task is not only to waste our colleagues' productive time but also cause data integrity problem which might cause serious problem.

This application can take Excel file and update jobs via Monday GraphQL API.

User can specify id on Monday board data and local Excel data, so this app choose new data from Excel file and upload them.

This app let our collegues release their tedious data entry tasks and provides error free data entry services.

## Technologies
This app is composed of Node.js and React.js

