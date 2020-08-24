
export const CONNECT_LIST = {
  "WO NUM":"Name",
  "Reference ":"REFERENCE#",
  "PWO NUM":"PARENT WO#",
  "Customer":"Customer",
  "WO Description ":"WO DESCRIPTION",
  "QTY Ordered":"QTY",
  "3rd Item NUM":"3rd Item Number",
  "Planned Complete":"Projected Completion",
  "Order Date":"Order Date",
  "Start Date":"Release Date",
  "ALL PARTS ORDERED":"ALL PARTS ORDERED",
  "Complete Date":"Closed Date",
  "KIT RCVD":"Received Date",
  "Recieve":"ALL PARTS RCVD",
  "Status":"Status",
  "Full Item Description":"Full Item Description",
  "ASSEMBLY":"ASSEMBLY",
  "QC/TESTING":"QC/TESTING",
  "Close Safely?":"Close Safely?",
  //"Close Warning/Caution Reason":"Unsafe Closed Causes",
  "BOM Date":"BOM Updated Date",
  "Revised Part List Date":"Revised Part List Date",
  "isBOMChanged":"BOM Changed?"
}

export const header = {
  'headerIndex': 0,
}

export const ids = ['WO NUM']

export const exclusiveLabels = {
  'ALL PARTS RCVD': ["Kit Incomplete"],
  'Status': ['ON HOLD'],
  'ASSEMBLY': ['On Hold'],
  'QC/TESTING': ['On Hold'],
} 

export const criteria = {
  'Status': ['DONE,!=']
}