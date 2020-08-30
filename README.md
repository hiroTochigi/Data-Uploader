# Data Uploader

## Inspiration
We use an ERP to manage our daily jobs, but the ERP is very poor to present job flows.

[Monday.com](https://monday.com/) can visualize job flows clearly and let users share information easiliy. 

In addition, Monday has awesome integration and automation functions to make daily routine jobs easier and more efficient.

Monday.com allows users to upload Excel file to initiate Board.

However, users have to upload new data on their existing board manually.

In our use case, it is a serious bottleneck.

Sometimes, we have to upload a few dozens jobs in a day.

The intense manual data entry task is not only to waste our colleagues' productive time but also cause data integrity problem which might cause serious problem.

This application can take Excel file and update jobs via Monday GraphQL API.

User can specify id on Monday board data and local Excel data, so this app choose new data from Excel file and upload them.

This app let our colleges release their tedious data entry tasks and provides error free data entry services.

## What it does
Data Uploader takes local Excel file and update Monday board.
This application compares the local data and the data on the Monday board, and if the program detects difference, add new items or update the existing in the Monday board.
This application can update the following columns: name, text, number, date, long-text, and label.

## How I built it
I build it by React.js

## Challenges I ran into
Generate GraphQL query according to the data type.
Transform Excel/CSV Data format into JavaScript Data format. 
Come up with the data structure to compare two data set.
Asynchronous function calls 

## Accomplishments that I'm proud of
Generate configuration data from Configuration variables.

## What I learned
JavaScript, mainly how to use Promise Object and functional programming paradigm
React.js

## What's next for Data Uploader
Prevent the users from making the wrong configuration file.
Almost all errors are generated because of the incorrect configuration file or the wrong data in the local data set, such as number column having text and label column having non-existing label.

Add GUI configuration file generator to prevent typo.
Add more user friendly error handling method, such as before generating query, scan each local column data and warning the potential problem to users.
Add history mode: reverse the uploading event.



