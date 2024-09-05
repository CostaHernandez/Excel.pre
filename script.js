document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById("editable-table");
    const imageInput = document.getElementById("image-input");
    const imageSizeInput = document.getElementById("image-size");

    // Format Controls
    const bgColorInput = document.getElementById("bg-color");
    const textColorInput = document.getElementById("text-color");
    const fontFamilySelect = document.getElementById("font-family");
    const textAlignSelect = document.getElementById("text-align");
    const searchText = document.getElementById("search-text");

    // Buttons
    const searchButton = document.getElementById("search-button");
    const addRowButton = document.getElementById("add-row");
    const addColumnButton = document.getElementById("add-column");
    const deleteRowButton = document.getElementById("delete-row");
    const deleteColumnButton = document.getElementById("delete-column");
    const applyFormatButton = document.getElementById("apply-format");
    const insertImageButton = document.getElementById("insert-image");
    const exportButton = document.getElementById("export");
    const clearDataButton = document.getElementById("clear-data");
    const recoverDataButton = document.getElementById("recover-data");

    const numRowsInput = document.getElementById("num-rows");
    const numColumnsInput = document.getElementById("num-columns");
    const createTableButton = document.getElementById("create-table");


    let selectedCell;


      // Selecciona el botón de cargar
      const loadButton = document.getElementById("load");
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "application/json";
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);
  
      // Función para cargar los datos de la tabla desde un archivo JSON
      loadButton.addEventListener("click", () => {
          fileInput.click();
      });
  
      fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                  try {
                      const json = event.target.result;
                      const tableData = JSON.parse(json);
  
                      // Obtiene la tabla
                      const table = document.getElementById("editable-table");
  
                      // Borra el contenido actual de la tabla
                      while (table.rows.length > 1) {
                          table.deleteRow(1);
                      }
  
                      // Crea las filas y columnas de la tabla
                      tableData.forEach((rowData, rowIndex) => {
                          const row = table.insertRow();
                          if (rowIndex === 0) {
                              // Crea la primera fila con encabezados
                              const th = document.createElement("th");
                              th.textContent = "";
                              row.appendChild(th);
                              rowData.forEach((_, colIndex) => {
                                  const th = document.createElement("th");
                                  th.textContent = String.fromCharCode(65 + colIndex); // Letras de columna
                                  row.appendChild(th);
                              });
                          } else {
                              // Crea las filas de datos
                              const th = document.createElement("th");
                              th.textContent = rowIndex;
                              row.appendChild(th);
                              rowData.forEach((cellData) => {
                                  const cell = row.insertCell();
                                  cell.contentEditable = "true";
                                  cell.textContent = cellData;
                              });
                          }
                      });
  
                      // Añade encabezado de columnas si no está presente
                      if (table.rows[0].cells.length === 1) {
                          const colCount = tableData[0].length;
                          const headerRow = table.rows[0];
                          for (let i = 0; i < colCount; i++) {
                              const th = document.createElement("th");
                              th.textContent = String.fromCharCode(65 + i); // Letras de columna
                              headerRow.appendChild(th);
                          }
                      }
  
                  } catch (e) {
                      console.error("Error al cargar el archivo:", e);
                  }
              };
              reader.readAsText(file);
          }
      });

    // Selecciona el botón de guardar
    const saveButton = document.getElementById("save");
    
    // Función para guardar los datos de la tabla
    saveButton.addEventListener("click", () => {
        // Obtiene el contenido de la tabla
        const table = document.getElementById("editable-table");
        const rows = table.rows;
        const tableData = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowData = [];
            
            for (let j = 1; j < row.cells.length; j++) {
                rowData.push(row.cells[j].innerText);
            }
            
            tableData.push(rowData);
        }

        // Convierte los datos a formato JSON
        const json = JSON.stringify(tableData);

        // Crea un blob con el JSON
        const blob = new Blob([json], { type: "application/json" });

        // Crea un enlace para descargar el archivo
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "table-data.json";
        a.click();

        // Limpia el objeto URL después de la descarga
        URL.revokeObjectURL(a.href);
    });


     // Create a table with specified rows and columns
     createTableButton.addEventListener("click", () => {
        const numRows = parseInt(numRowsInput.value);
        const numColumns = parseInt(numColumnsInput.value);

        // Clear existing table
        table.innerHTML = "";

        // Create table header
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        const th = document.createElement("th");
        headerRow.appendChild(th);

        for (let i = 0; i < numColumns; i++) {
            const th = document.createElement("th");
            th.textContent = String.fromCharCode(65 + i); // Letras A, B, C, ...
            headerRow.appendChild(th);
        }

        // Create table body
        const tbody = table.createTBody();

        for (let i = 0; i < numRows; i++) {
            const row = tbody.insertRow();
            const th = document.createElement("th");
            th.textContent = i + 1; // Números de fila
            row.appendChild(th);

            for (let j = 0; j < numColumns; j++) {
                const cell = row.insertCell();
                cell.contentEditable = "true";
                cell.style.backgroundColor = "white"; // Fondo blanco por defecto
            }
        }
    });

     // Función para exportar la tabla
     const exportTable = () => {
        const exportFormat = document.getElementById("export-format").value;
        if (exportFormat === "xlsx") {
            const wb = XLSX.utils.table_to_book(table);
            XLSX.writeFile(wb, "table.xlsx");
        } else if (exportFormat === "txt") {
            let text = "";
            for (let i = 0; i < table.rows.length; i++) {
                for (let j = 0; j < table.rows[i].cells.length; j++) {
                    text += table.rows[i].cells[j].textContent + "\t";
                }
                text += "\n";
            }
            const blob = new Blob([text], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "table.txt";
            link.click();
        }
        // Se pueden agregar más formatos si es necesario
    };

    // Función para limpiar los datos de la tabla
    const clearTableData = () => {
        const cells = table.getElementsByTagName("td");
        Array.from(cells).forEach(cell => {
            cell.textContent = "";
        });
    };
      
    // Clear data and reset background color
    clearDataButton.addEventListener("click", () => {
        const cells = table.getElementsByTagName("td");

        Array.from(cells).forEach(cell => {
            cell.textContent = "";
            cell.style.backgroundColor = "white";  // Restablecer fondo blanco
        });
    });

    // Función para recuperar datos de la tabla
    const recoverTableData = () => {
        const savedData = localStorage.getItem("tableData");
        if (savedData) {
            const tableData = JSON.parse(savedData);
            for (let i = 0; i < table.rows.length; i++) {
                for (let j = 0; j < table.rows[i].cells.length; j++) {
                    if (tableData[i] && tableData[i][j] !== undefined) {
                        table.rows[i].cells[j].textContent = tableData[i][j];
                    }
                }
            }
        } else {
            alert("No hay datos guardados.");
        }
    };

    // Función para guardar datos de la tabla en localStorage
    const saveTableData = () => {
        const tableData = [];
        for (let i = 0; i < table.rows.length; i++) {
            const rowData = [];
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                rowData.push(table.rows[i].cells[j].textContent);
            }
            tableData.push(rowData);
        }
        localStorage.setItem("tableData", JSON.stringify(tableData));
    };

    // Event Listeners para los botones
    exportButton.addEventListener("click", exportTable);
    clearDataButton.addEventListener("click", clearTableData);
    recoverDataButton.addEventListener("click", recoverTableData);

    // Ejemplo: Guardar datos antes de limpiar
    clearDataButton.addEventListener("click", saveTableData);

    // Add a new row
    addRowButton.addEventListener("click", () => {
        const row = table.insertRow();
        const rowCount = table.rows.length;
        const colCount = table.rows[0].cells.length;

        const th = document.createElement("th");
        th.textContent = rowCount - 1;
        row.appendChild(th);

        for (let i = 1; i < colCount; i++) {
            const cell = row.insertCell();
            cell.contentEditable = "true";
            cell.style.backgroundColor = "white";  // Fondo blanco por defecto
        }
    });

    // Add a new column
    addColumnButton.addEventListener("click", () => {
        const rows = table.rows;
        const colCount = rows[0].cells.length;

        for (let i = 0; i < rows.length; i++) {
            if (i === 0) {
                const th = document.createElement("th");
                th.textContent = String.fromCharCode(65 + colCount - 1); // Columna con letras
                rows[i].appendChild(th);
            } else {
                const cell = rows[i].insertCell();
                cell.contentEditable = "true";
                cell.style.backgroundColor = "white";  // Fondo blanco por defecto
            }
        }
    });

    // Delete the last row
    deleteRowButton.addEventListener("click", () => {
        if (table.rows.length > 2) {
            table.deleteRow(-1);
        }
    });

    // Delete the last column
    deleteColumnButton.addEventListener("click", () => {
        const rows = table.rows;
        if (rows[0].cells.length > 2) {
            for (let i = 0; i < rows.length; i++) {
                rows[i].deleteCell(-1);
            }
        }
    });

    // Apply formatting to selected cell
    table.addEventListener("click", (e) => {
        if (e.target.tagName === "TD") {
            selectedCell = e.target;
        }
    });

    applyFormatButton.addEventListener("click", () => {
        if (selectedCell) {
            selectedCell.style.backgroundColor = bgColorInput.value;
            selectedCell.style.color = textColorInput.value;
            selectedCell.style.fontFamily = fontFamilySelect.value;
            selectedCell.style.textAlign = textAlignSelect.value;
        }
    });

    // Search functionality
    searchButton.addEventListener("click", () => {
        const term = searchText.value.toLowerCase();
        const cells = table.getElementsByTagName("td");

        Array.from(cells).forEach(cell => {
            cell.style.backgroundColor = cell.textContent.toLowerCase().includes(term) ? "yellow" : "white";
        });
    });

    // Insert Image functionality
    insertImageButton.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && selectedCell) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.style.width = `${imageSizeInput.value}px`; // Ajuste de tamaño
                img.style.height = "auto";
                selectedCell.innerHTML = "";
                selectedCell.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // Update image size dynamically
    imageSizeInput.addEventListener("input", () => {
        if (selectedCell && selectedCell.querySelector("img")) {
            const img = selectedCell.querySelector("img");
            img.style.width = `${imageSizeInput.value}px`;
        }
    });

     // Function to apply formatting to selected cells
     const applyFormat = () => {
        if (!selectedCell) return;

        // Apply background color, text color, font family, and text alignment
        selectedCell.style.backgroundColor = bgColorInput.value;
        selectedCell.style.color = textColorInput.value;
        selectedCell.style.fontFamily = fontFamilySelect.value;
        selectedCell.style.textAlign = textAlignSelect.value;
    };

    // Function to search for a word in the table and highlight matching cells
    const searchTable = () => {
        const searchTerm = searchText.value.toLowerCase();
        if (!searchTerm) return;

        // Remove previous highlights
        const cells = table.querySelectorAll("td[contenteditable='true']");
        cells.forEach(cell => {
            cell.style.outline = "";  // Reset outline
            if (cell.textContent.toLowerCase().includes(searchTerm)) {
                cell.style.outline = "2px solid red";  // Highlight matching cells
            }
        });
    };

    // Event listener to keep track of the selected cell
    table.addEventListener("click", (event) => {
        if (event.target.tagName === "TD" && event.target.contentEditable === "true") {
            selectedCell = event.target;
        }
    });

    // Apply formatting on blur (when focus leaves the cell)
    table.addEventListener("blur", applyFormat, true);

    // Search functionality
    searchButton.addEventListener("click", searchTable);

    
});
