const thead_col = document.getElementById("col-header")
const tbody = document.getElementById("table-body")

/* since we require the id of the currentcell */
var currentCell = document.getElementById("apex-cell")

const bold = document.getElementById("bold-button")
const italic = document.getElementById("italic-button")
const underline = document.getElementById("underline-button")

const left_align = document.getElementById("left-align")
const center_align = document.getElementById("center-align")
const right_align = document.getElementById("right-align")

const font_size = document.getElementById("font-size")

const font_family = document.getElementById("font-family")

const cut_button = document.getElementById("cut-button")
const copy_button = document.getElementById("copy-button")
const paste_button = document.getElementById("paste-button")

/* clipboard */
let cutCell

const bg_color = document.getElementById("bg-color")
const text_color = document.getElementById("text-color")

const upload_json = document.getElementById("json-file")

const add_sheet = document.getElementById("add-sheet")
const sheet_container = document.getElementById("new-sheets-container")

const columns = 26
const rows = 100


/* generating the table */
/* var ch  = String.fromCharCode(97 + n) */

/* the columns are resizing so min-width is required */
for (let col = 0; col < columns; col++) {
    let th = document.createElement("th")
    th.innerText = String.fromCharCode(col + 65)

    thead_col.append(th)
}

for (let row = 1; row <= rows; row++) {
    let tr = document.createElement("tr")
    let th = document.createElement("th")
    th.innerText = row

    tr.append(th)

    for (let col = 0; col < columns; col++) {
        let td = document.createElement("td")

        /* this attribute can be set for any html tag */
        /* just making the table cells editable */
        td.setAttribute('contenteditable', 'true')

        /* setting the id of each cell here */
        td.setAttribute('id', `${String.fromCharCode(col + 65)}${row}`)

        /* capturing every input/on the fly */
        td.addEventListener("input", (event) => onInput(event))

        /* just putting the event.target into focus */
        td.addEventListener("focus", (event) => onFocus(event))

        tr.append(td)
    }
    tbody.append(tr)
}

/* triggering this function whenever anything is being written in a cell */
function onInput(event) {
    updateMatrix(event.target)
}


function onFocus(event) {
    currentCell = event.target
    // updateMatrix(currentCell)
    document.getElementById("apex-cell").innerHTML = currentCell.id
}


/* thead buttons and functionality */

/* bold */
bold.addEventListener("click", (event) => {
    if (currentCell.style.fontWeight === 'bold') {
        currentCell.style.fontWeight = 'normal'
    } else {
        currentCell.style.fontWeight = 'bold'
    }
    updateMatrix(currentCell)
})

/* italic */
/* https://www.w3schools.com/cssref/pr_font_font-style.php */
italic.addEventListener("click", (event) => {
    if (currentCell.style.fontStyle === 'italic') {
        currentCell.style.fontStyle = 'normal'
    } else {
        currentCell.style.fontStyle = 'italic'
    }
    updateMatrix(currentCell)
})

/* underline */
/* https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration */
underline.addEventListener("click", (event) => {
    if (currentCell.style.textDecoration === 'underline') {
        currentCell.style.textDecoration = 'none'
    } else {
        currentCell.style.textDecoration = 'underline'
    }
    updateMatrix(currentCell)
})


/* left-align */
left_align.addEventListener("click", (event) => {
    currentCell.style.textAlign = 'left'
    updateMatrix(currentCell)
})

/* center-align */
center_align.addEventListener("click", (event) => {
    currentCell.style.textAlign = 'center'
    updateMatrix(currentCell)
})

/* right-align */
right_align.addEventListener("click", (event) => {
    currentCell.style.textAlign = 'right'
    updateMatrix(currentCell)
})

/* font-size */
font_size.addEventListener("change", (event) => {
    currentCell.style.fontSize = font_size.value
    updateMatrix(currentCell)
})

/* font-family */
font_family.addEventListener("change", (event) => {
    currentCell.style.fontFamily = font_family.value
    updateMatrix(currentCell)
})

/* cut */
cut_button.addEventListener("click", (event) => {
    cutCell = {
        /* cssText contains all the applied styling values */
        style: currentCell.style.cssText,
        text: currentCell.innerText
    }
    currentCell.innerText = ""
    currentCell.style = null

    /* nullify the copyCell object */
    copyCell.style = null
    copyCell.text = ""

    updateMatrix(currentCell)
})

/* copy */
copy_button.addEventListener("click", (event) => {
    copyCell = {
        /* cssText contains all the applied styling values */
        style: currentCell.style.cssText,
        text: currentCell.innerText
    }
    /* nullify the cutCell object */
    cutCell.style = null
    cutCell.text = ""
})

/* paste */
paste_button.addEventListener("click", (event) => {
    if (cutCell.text) {
        currentCell.style = cutCell.style
        currentCell.innerText = cutCell.text
    } else if (copyCell.text) {
        currentCell.style = copyCell.style
        currentCell.innerText = copyCell.text
    }
    /* nullify the cutCell object */
    cutCell.style = null
    cutCell.text = ""

    updateMatrix(currentCell)
})

/* setting the background color */
/* input allows the drag of change */
bg_color.addEventListener("input", (event) => {
    currentCell.style.backgroundColor = bg_color.value
    updateMatrix(currentCell)
})

/* setting the text color */
/* input allows the drag of change */
text_color.addEventListener("input", (event) => {
    currentCell.style.color = text_color.value
    updateMatrix(currentCell)
})


/* data storage in a multiD array */
/* 
    [
        {},{},
        {},{},
        {},{}
    ]

    [
        [{},{}],
        [{},{}],
        [{},{}]
    ]

    rowidx * (number of cols) + colidx
*/

/* extremely important : cloning sheet */
/* (101 * 27) */
let matrix = new Array(rows)
for (let row = 0; row < rows; row++) {
    /* creating a new array for each row */
    matrix[row] = new Array(columns)

    for (let col = 0; col < columns; col++) {
        /* creating a new object in the inner array */
        matrix[row][col] = {}
    }
}

/* multiple sheets */
let total_sheets = 1
let arrayMatrix = [matrix]
let currentSheet = 1

/* 
    1. iterate over entire sheet and copy each and every cell
    2. while editing, update the changes, on the fly, in the respective cell in 2D matrix 

    matrix[(row - 1)(letter -> number - 65)]
*/
/* update matrix on the fly */
function updateMatrix(currentCell) {
    let temp_object = {
        style: currentCell.style.cssText,
        text: currentCell.innerText,
        id: currentCell.id
    }

    /* id is cell-name, in the form of alphanumeric */
    /* restructuring id to access the cell */
    let id = currentCell.id.split('')

    let i = id[1] - 1,
        j = id[0].charCodeAt(0) - 65;

    matrix[i][j] = temp_object
}


/* download */
function downloadJson() {
    const matrix_string = JSON.stringify(matrix)

    /* converting text form of matrix to downloadable form */
    const blob = new Blob([matrix_string], { type: 'application/json' })

    /* creating a download link */
    const link = document.createElement("a")

    /* converting memory-piece of blob to url */
    link.href = URL.createObjectURL(blob)

    /* naming the file which will be downloaded */
    link.download = "data-sheet.json"

    /* to place the link in the DOM to make it clickable */
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
}

/* upload */
upload_json.addEventListener("change", (event) => {
    /* getting the file */
    const file = event.target.files[0]

    /* reading the uploaded file */
    if (file) {
        /* launching the reader instance */
        const reader = new FileReader()

        /* when reader is used */
        reader.onload = function (event) {
            const file_content = event.target.result

            try {
                const file_content_json = JSON.parse(file_content)

                /* after uploading, this is important to keep matrix in sync with the sheet/table */
                matrix = file_content_json

                /* first method of cloning the matrix */
                file_content_json.forEach((row) => {
                    row.forEach((cell) => {
                        if (cell.id) {
                            var currentCell = document.getElementById(cell.id)
                            currentCell.innerText = cell.text
                            currentCell.style.css = cell.style
                        }
                    })
                })
            } catch (err) {
                prompt("error in reading json file", err)
            }
        }

        /* upon the execution of below code, line 302 is triggered */
        reader.readAsText(file)
    }
})


/* multiple sheets */
add_sheet.addEventListener("click", (event) => {

    if (total_sheets === 1) {
        var current_array = [matrix]
        localStorage.setItem('arrayMatrix', JSON.stringify(current_array))
    } else {
        var prev_sheet_array = JSON.parse(localStorage.getItem('arrayMatrix'))

        /* this is a temporary array, we can push here as well */
        var updated_arrayMatrix = [...prev_sheet_array, matrix]

        localStorage.setItem('arrayMatrix', JSON.stringify(updated_arrayMatrix))
    }

    total_sheets++;
    currentSheet = total_sheets

    /* matrix is virtual memory of current table/sheet */
    /* 
        cleanup virtual memory as we won't make a new table;
        it will only appear as though a new table has been
        created;
    */
    for (let row = 0; row < rows; row++) {
        matrix[row] = new Array(columns)
        for (let col = 0; col < columns; col++) {
            matrix[row][col] = {}
        }
    }

    /* tbody null for new sheet */
    tbody.innerHTML = ``

    /* cleanup table/sheet */
    for (let row = 1; row <= rows; row++) {
        let tr = document.createElement("tr")
        let th = document.createElement("th")
        th.innerText = row
        tr.append(th)

        for (let col = 0; col < columns; col++) {
            let td = document.createElement("td")

            td.setAttribute('contenteditable', 'true')
            td.setAttribute('id', `${String.fromCharCode(col + 65)}${row}`)

            td.addEventListener("input", (event) => onInput(event))
            td.addEventListener("focus", (event) => onFocus(event))

            tr.append(td)
        }
        tbody.append(tr)
    }

    /* creating the new sheet button */
    let new_sheet_button = document.createElement("button")
    new_sheet_button.className = "sheet"
    new_sheet_button.id = `add-sheet ${currentSheet}`
    new_sheet_button.innerText = `Sheet ${currentSheet}`
    new_sheet_button.onclick = `loadTableData(${this.id})`

    sheet_container.append(new_sheet_button)
})

/* re-code required */
/* displaying sheet content upon switching sheets */
function loadTableData() {
    document.getElementById(`add-sheet-${id}`).addEventListener('click', (event) => {
        /* fetching matrix from localStorage requires JSON.parse() */

        var button_id = (event.target.id)
        var button_id_id = button_id[2]
        console.log(button_id);

        var my_array = JSON.parse(localStorage.getItem('arrayMatrix'))
        let tableData = my_array[`${id - 1}`]

        matrix = tableData

        tableData.forEach((row) => {
            row.forEach((cell) => {
                if (cell.id) {
                    var my_cell = document.getElementById("cell.id")
                    my_cell.innerText = cell.innerText
                    my_cell.style.cssText = cell.style
                }
            })
        })
    })
}