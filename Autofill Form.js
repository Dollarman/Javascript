function myFunction() {
  var form = FormApp.openByUrl('INSERT FORM URL YOUR WANT TO AUTOFILL');
  var sheet = SpreadsheetApp.openByUrl("INSERT SPREADSHEET URL WITH DATA TO FILL THE FORM");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues(); // [ [row0 ], [row1 ], [row2 ], ... ]

  // Start at index x=1 because the speadsheet has headers in  the first row.
  for (var x = 1; x < values.length; x++) {
    var formResponse = form.createResponse();
    var items = form.getItems();
    var row = values[x];

    // Item 0: Nombre del Maestro
    var formItem0 = items[0.0].asMultipleChoiceItem();
//    var response = formItem.createResponse(row[0]);
    formResponse.withItemResponse( formItem0.createResponse(row[0]) );

    // Item 1: Fecha
    var formItem1 = items[1.0].asDateItem();
//    var response = formItem1.createResponse(row[1]);
    formResponse.withItemResponse( formItem1.createResponse(row[1]) );

    // Item 2: Materia
    var formItem2 = items[2.0].asMultipleChoiceItem();
//    var response = formItem2.createResponse(row[2]);
    formResponse.withItemResponse( formItem2.createResponse(row[2]) );

    // Item 3: Fase
    var formItem3 = items[3.0].asMultipleChoiceItem();
//    var response = formItem3.createResponse(row[3]);
    formResponse.withItemResponse( formItem3.createResponse(row[3]) );

    // Item 4: Coaching Ind.
    var formItem4 = items[4.0].asMultipleChoiceItem();
//    var response = formItem4.createResponse(row[4]);
    if (row[4] != "") {
      formResponse.withItemResponse( formItem4.createResponse(row[4]) );
    }

    // Item 5: Seguimiento
    var formItem5 = items[5.0].asMultipleChoiceItem();
//    var response = formItem5.createResponse(row[5]);
    if (row[5] != "") {
      formResponse.withItemResponse( formItem5.createResponse(row[5]) );
    }

    // Submit form when done filling.
    formResponse.submit();
    Utilities.sleep(500);
    // delay to avoid being timed-out for doing too much I/O.
  }
}
