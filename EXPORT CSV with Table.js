/**
 * Google Script code para distribucion de notas de escuelas publicas.
 * Carlos Sanchez
 */


/**
 * A special function that runs when the spreadsheet is open, used to add a
 * custom menu to the spreadsheet.
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuItems = [
    {name: 'Generar distribucion de notas por grado para todos las clases.', functionName: 'all_courses'},
    {name: 'Generar distribucion de notas por grado para MATE,INGL,CIEN,ESPA.', functionName: 'MICE_courses'}
    ];
  spreadsheet.addMenu('Generar informes', menuItems);
}

/**
 * Functions called directly by the user to generate reports.
 */

function all_courses() {
  generar_informes(false);
  return;
}
function MICE_courses() {
  generar_informes(true);
  return;
}

function generar_informes(MICE) {
  var sheet = SpreadsheetApp.openByUrl("INSERT YOUR DATA SHEET'S URL");
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues(); // [ [row0 ], [row1 ], [row2 ], ... ]
  //Unused headers var just for reference.
  //var headers = values[0]; //Estudiante	ID Estudiante	Grado	Curso	Sección(es)	Título	Nombre del Maestro	Período Académico	Tipo evaluación	1	2	3	4

  //result dictionaries with counts:
  var notasPorGrado = {};
  var notasPorCurso = {};
  var notasPorEst = {}; // contiene los SIE de cada nota dada por semana y curso.
  var Duplicates = []; // = [ [nota1,nota2, nombre, SIE, curso, titCurso, semana, Grado X], ... ] 1 elem por cada dup.
  var clase = {}; // contiene el titulo de cada
  var semanas = ["10semanas","20semanas","30semanas","40semanas"];


  // Initialize discardable vars used in for loop.
  var nota, semana, thisRow;
  var nombreEst, numSIE, grado, curso, seccion, titCurso, maestro, periodo, tipoEval, nota10, nota20, nota30, nota40;

  // Data has headers start counting at x=1
  // Iterate through entire data once and populate all variables at once.
  // Grades can be either an int, a char or blank, but we ignore all non ints.
  for (var x = 1; x < values.length; x++) {
    thisRow = values[x];
    // separate and name each column for easier parsing.
    [nombreEst, numSIE, grado, curso, seccion, titCurso, maestro, periodo, tipoEval, nota10, nota20, nota30, nota40] = thisRow;

    // identify which week the current grade is for.
    [semana, nota] = cual_semana([nota10, nota20, nota30, nota40]);

    // si se pidio solo MATE,ING,CIEN,ESPA y el row no es uno de esos, ignoralo.
    if (MICE && not_MICE(curso)) {continue;}
    // si nota == -1, no tiene nota este row.
    if (nota == -1) {continue;}

    // DUPLICATE GRADES COUNT BOTH IN DISTRO. YOU MUST REMOVE THE COUNT MANUALLY.
    //Check for duplicate student entries for each curso in each week.
    if (curso in notasPorEst) {
      //if its a dup, then add it to the list of dups
      if (numSIE in notasPorEst[curso][semana]) {
        Duplicates.push( [nota, notasPorEst[curso][semana][numSIE], nombreEst, numSIE, curso, titCurso, semana, "Grado ".concat(grado)] );
      } else {notasPorEst[curso][semana][numSIE] = nota;}

    } else {
      notasPorEst[curso] = {};
      for (var sem in semanas) {notasPorEst[curso][semanas[sem]] = {}; }
      notasPorEst[curso][semana][numSIE] = nota;
    }


    // add ABCDF to notasPorCurso, for multigrade notas of courses.
    if (curso in notasPorCurso) {
      notasPorCurso[curso][semana][abcdf(nota)] += 1;
    }
    // if curso not in notasPorCurso:
    else {
      notasPorCurso[curso] = {};
      for (var sem in semanas) {notasPorCurso[curso][semanas[sem]] = {"A":0,"B":0,"C":0,"D":0,"F":0};}
      notasPorCurso[curso][semana][abcdf(nota)] += 1;
    }

    // add ABCDF to notasPorGrado, for standard grade analysis.
    if (grado in notasPorGrado) {
      if (curso in notasPorGrado[grado]) {
        notasPorGrado[grado][curso][semana][abcdf(nota)] += 1;
      }
      // if curso not in notas[grado], then initialize it and update with current count.
      else {
        clase[curso] = titCurso;
        notasPorGrado[grado][curso] = {};
        for (var sem in semanas) {notasPorGrado[grado][curso][semanas[sem]] = {"A":0,"B":0,"C":0,"D":0,"F":0}; }
        notasPorGrado[grado][curso][semana][abcdf(nota)] += 1;
      }

    }
    // if grado not in notasPorGrado
    else {
      notasPorGrado[grado] = {};
      notasPorGrado[grado][curso] = {};
      for (var sem in semanas) {notasPorGrado[grado][curso][semanas[sem]] = {"A":0,"B":0,"C":0,"D":0,"F":0}; }

      clase[curso] = titCurso;
      notasPorGrado[grado][curso][semana][abcdf(nota)] += 1;
    }
  }// ENDS FOR LOOP

  export_Duplicates(Duplicates,sheet);
  export_por_grado(notasPorGrado, sheet, clase);
  export_por_curso(notasPorCurso, sheet, clase);

  return;
}


// Returns true if curso is not in: [ESPA, MATE, INGL, CIEN]
function not_MICE(curso,MICE) {
  var sub = curso.substring(0,4);
  var materias = ["ESPA","MATE","INGL","CIEN"];
  for (var mat in materias){
    if (sub == materias[mat]) {
      return false;
    }
  }
  return true;
}

function print(notas, sheet, clase,sheetname,duplicates) {
  var ss;
  sheet.insertSheet(sheetname);
  ss = sheet.getSheetByName(sheetname);
  ss.activate();
  ss.appendRow([sheetname]); // first row: GRADO 10
  ss.appendRow([" "]);
      //    Ejemplo de formato:
//
//    ALGEBRA
//    MATE 101 | A | B | C | D | F | TOTAL
//    10Semanas| 5 | 4 | 3 | 2 | 1 | 15
//    20Semanas| 1 | 2 | 3 | 4 | 5 | 15
  for (var curso in notas) {

    ss.appendRow([clase[curso]]); // Titulo del curso: ALGEBRA
    // codigo del curso
    ss.appendRow([curso, "A", "B","C","D","F", "TOTAL"]);  // MATE101 A|B|C|D|F
    for (var semana in notas[curso]) {
      var c = notas[curso][semana];
      var total = c["A"]+c["B"]+c["C"]+c["D"]+c["F"];

      // conteo de notas
      ss.appendRow([semana,c["A"],c["B"],c["C"],c["D"],c["F"], total]);
      //porcientos
      if (total != 0) {
        ss.appendRow(["",c["A"]/total,c["B"]/total,c["C"]/total,c["D"]/total,c["F"]/total]);
        //format last row as percentage.
        ss.getRange(ss.getLastRow() , 1, 1, 6).setNumberFormat('0.0%');
        // %ABC %DF
        ss.appendRow(["%ABC, %DF", (c["A"]+c["B"]+c["C"])/total, "", "", (c["D"]+c["F"])/total ])
        var lr = ss.getLastRow();
        ss.getRange(lr, 1, 1, 7).setNumberFormat('0.0%');
        ss.getRange(lr, 2, 1, 3).mergeAcross();
        ss.getRange(lr, 5, 1, 2).mergeAcross();
        ss.getRange(lr, 1, 1, 7).setHorizontalAlignment('center');
      }
    }
    // Add empty space between cursos.
    ss.appendRow([" "]);
    ss.appendRow([" "]);
  }
  return ;
}

// Duplicates is a list of lists containing each row to output
function export_Duplicates(Duplicates, sheet,sheetname) {
  var sheetname = "DUPLICADOS";
  var ss;
  sheet.insertSheet(sheetname);
  ss = sheet.getSheetByName(sheetname);
  ss.activate();
  ss.appendRow([sheetname]); // first row: GRADO 10
  ss.appendRow(["Duplicados estan contados ambos en la distribucion, se tienen que remover por separado cada una de las notas incorrectas del conteo."]);
  ss.appendRow(["nota1","nota2", "Nombre", "SIE", "Curso", "Nombre del Curso", "Semana", "Grado"]);
  // each row: [
  for (var row in Duplicates) {ss.appendRow( Duplicates[row] );}
  return;
}

function export_por_grado(notas, sheet, clase) {
  // for each grade: make new sheet and save data for that grade by week and course.
  for (var grado in notas){
    print(notas[grado],sheet,clase,"Grado ".concat(grado));
  }
  return;
}

function export_por_curso(notas, sheet, clase) {
  print(notas,sheet,clase,"Notas Por Curso");
  return;
}
  // SAVE DATA TO NEW SHEET IN SAME DOC


function sum(arr) {
  var res=0;
  for (var i in arr) {
    res += i;
  }
  return res;
}

function tformat() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('11');
  ss.getRange(ss.getLastRow() , 1, 1, 6).setNumberFormat('0.0%');
  return
}

// Asigna A,B,C,D,F segun el valor numerico de la nota.
function abcdf(nota) {
  if (nota >= 90) {
    return "A";
  }
  else if (90 > nota && nota >= 80) {
    return "B";
  }
  else if (80 > nota && nota >= 70) {
    return "C";
  }
  else if (70 > nota && nota >= 60) {
    return "D";
  }
  else if (60 > nota) {
    return "F";
  }
}

// This function parses each row to find out which week the grade belongs to. If it returns [-1,-1] the row doesn't have a grade.
// If format of data has more than 1 grade per row, this function will stop at the first found.
// Dado que solo una nota por row en la data, esta funcion la encuentra y dice a que semana pertenece segun su columna.
function cual_semana(notas) {
  var lanota = -1;
  var index =-1;
  // notas.length should be 4, one for each week, even if there are blanks.
  for (var i=0; i<notas.length;i++) {
  // the only int in the row is the one we want.
    if (typeof notas[i] === 'number') {
        lanota = notas[i];
        index = i;
    } //else the row doesn't contain a number, so ignore it.
  }
  switch (index) {
    case 0: return ["10semanas",lanota];
    case 1: return ["20semanas",lanota];
    case 2: return ["30semanas",lanota];
    case 3: return ["40semanas",lanota];
  }

  return [-1,-1];
}
