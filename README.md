# MondayBoardUpdate

This Web App still is in developing phase.

## Purpose of this app
We use an ERP to manage essential job flows, but the ERP is very poor to present job flows.
Monday can visualize job flows clearely and let users share information easiliy. 
In addition, Monday has awesome intergration and automation functions to make daily routine jobs easier.
Monday.com allows users to upload Excel file to initiate Board.
However, users have to upload new data on their exisinting board manually.
In our use case, it is a serious bottleneck.
Sometimes, we have to upload a few dozens jobs.
This application can take Excel file and update jobs via Monday GraphQL API.
User can specify id on Monday board data and local Excel data, so this app choose new data from Excel file and upload them.

## Technologies
This app is composed of Node.js and React.js

