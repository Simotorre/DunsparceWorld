const rarityMatrix = {
    '1st Ed.': '1st',
    'Unlimited': 'Unl',
    'Regular': 'Reg',
    'Regular No E-Reader': 'Reg_No_ER',
    'Reverse': 'Rev',
    'Full Art': 'FA',
    'Trainer Gallery': 'TG',
    'Reverse Pokeball': 'Pok',
    'Reverse Masterball': 'Mas',
    'Promo': 'Pr',
    'World Championships 2004 - Reed Weichler': 'WCS04_RW',
    'World Championships 2004 - Kevin Nguyen': 'WCS04_KN',
    'World Championships 2004 - Chris Fulop': 'WCS04_CF',
    'World Championships 2005 - Takashi Yoneda': 'WCS05_TY',
    'World Championships 2005 - Michael Gonzalez': 'WCS05_MG',
    'Custom Art': 'CA'
}

//Pic	Set Code	Set Name	#	Edizione della carta	Note	Release Date	Have	ID
const head = ['Pic', 'Set Code', 'Set Name', '#', 'Edizione della carta', 'Note', 'Release Date', 'Have', 'Line ID'];
var pic = '';
var stc = '';
var stn = '';
var num = '';
var ed = '';
var not = '';
var rdt = '';
var hv = '';
var id = '';
const hide = ['Have', 'Line ID'];
const hide_sm = ['#']; // ['Set Code'];
const hide_md = ['Set Name']; // ['Set Name'];
const hide_lg = ['Release Date', 'Note']; // ['#', 'Note'];

$(document).ready(function () {
    //DARK-LIGHT MODE
    let darkLightBtn = document.getElementById("dark_light_btn");
    darkLightBtn.addEventListener('click', function () {
        console.log(this.textContent);
        let color = '';
        let backGroundColor = '';
        let mode = this.getAttribute("mode");
        if (mode === "dark") {
            backGroundColor = "#FFFFFF";
            color = "#000000";
            this.textContent = "Dark Mode";
            this.setAttribute("mode", "light");
        } else {
            backGroundColor = "#000000";
            color = "#FFFFFF";
            this.textContent = "Light Mode";
            this.setAttribute("mode", "dark");
        }
        let body = document.getElementsByTagName("body");
        body[0].style.backgroundColor = backGroundColor;

        //Table CSS
        let cssObj = {
            'border': `1px solid ${color}`,
            'color': `${color}`
        };

        $(".flag").css({ 'border': `2px solid ${color}` });
        $("#flag_table").toggleClass('table-dark', mode !== 'dark');
        $("#flag_table").find("th").css(cssObj);
        // $("#flag_table").find("td:not(.checkbox)").css(cssObj);
        $("#flag_table").find("tr:not(.table-success) > td").css(cssObj);
        $("#flag_table").find("tr.table-success > td").css({
            'border': `1px solid ${color}`,
            'color': `black`
        });
        // $("#flag_table").find("td.checkbox").css({ 'background-color': `${mode === 'dark' ? "#FFFFFF" : "#000000"}` });
        // $("#flag_table").find("td.checkbox label").css({ 'color': `${color}` });

        //Functions CSS
        // $("table.functions").find("td:first-child").css('color', color);
    });

    //VIEW - EDIT MODE
    /* let viewEditBtn = document.getElementById("view_edit_btn");
    viewEditBtn.addEventListener('click', function () {
        console.log(this.textContent);
        let display = '', displayLabel = '', displayCheck = '';
        let mode = this.getAttribute("mode");
        if (mode === "view") {
            display = 'block';
            displayLabel = 'inline-flex';
            displayCheck = 'block';
            this.textContent = "View Mode";
            this.setAttribute("mode", "edit");
        } else {
            display = 'none';
            displayLabel = 'none';
            displayCheck = 'none';
            this.textContent = "Edit Mode";
            this.setAttribute("mode", "view");
        }
        document.getElementsByClassName("functions")[0].style.display = display;

        //Modifico il display delle checkbox
        document.getElementsByClassName("functions")[0].style.display = display;
        $("#flag_table").find("input.line_check").css({ 'display': `${displayCheck}` });
        $("#flag_table").find("td.checkbox label").css({ 'display': `${displayLabel}` });
    }); */

    //TABLE SELECTOR
    let flags = document.getElementsByClassName("flag");
    console.log(flags)
    for (let flag of flags) {
        flag.addEventListener("click", function () {
            let languageCode = this.getAttribute("id").split('_')[1];
            console.log(languageCode);

            $(this).css('filter', 'brightness(100%)');
            // $(this).siblings().css('filter', 'brightness(50%)');
            $(`.flag:not(#${this.id})`).css('filter', 'brightness(50%)');

            $.ajax({
                url: `./csv/Dunsparce_${languageCode}.csv`,
                type: 'GET',
                dataType: 'text',
                success: function success(response) {
                    console.log('successo con la tabella ' + languageCode);

                    //Dark - Light Mode
                    let mode = document.getElementById("dark_light_btn").getAttribute("mode");
                    console.log(mode);
                    let color = mode === 'dark' ? "#FFFFFF" : "#000000";
                    console.log(color);
                    //View - Edit Mode
                    /* let viewEditMode = document.getElementById("view_edit_btn").getAttribute("mode");
                    console.log(viewEditMode);
                    let displayLabel = viewEditMode === 'view' ? "none" : "inline-flex";
                    let displayCheck = viewEditMode === 'view' ? "none" : "block";
                    console.log('Label', displayLabel, 'Checkbox', displayCheck); */

                    //Costruisco la tabella
                    let html = `<table id="flag_table" class="table table-striped${mode === 'dark' ? ' table-dark' : ''}" 
                    data-toggle="table" data-search="true" data-sortable="true" data-sort-name="Release Date" data-sort-order="asc">`;

                    const csvData = response.split('\n');  // Split CSV into lines
                    for (let i = 0; i < csvData.length; i++) {
                        if (csvData[i].trim() !== '') {
                            const currentLine = csvData[i].split(';');  // Split each line by column

                            //HEADER
                            //Pic	Set Code	Set Name	#	Edizione della carta	Note	Release Date	Have	Line ID
                            if (i == 0) {
                                html += '<thead><tr>'

                                for (let j = 0; j < 9; j++) {
                                    //Imposto i valori delle colonne
                                    if (currentLine[j].trim() == 'Pic') pic = j;
                                    if (currentLine[j].trim() == 'Set Code') stc = j;
                                    if (currentLine[j].trim() == 'Set Name') stn = j;
                                    if (currentLine[j].trim() == '#') num = j;
                                    if (currentLine[j].trim() == 'Edizione della carta') ed = j;
                                    if (currentLine[j].trim() == 'Note') not = j;
                                    if (currentLine[j].trim() == 'Release Date') rdt = j;
                                    if (currentLine[j].trim() == 'Have') hv = j;
                                    if (currentLine[j].trim() == 'Line ID') id = j;

                                    let classe = '';
                                    if (hide_lg.includes(currentLine[j].trim())) classe = "d-none d-lg-table-cell";
                                    if (hide_md.includes(currentLine[j].trim())) classe = "d-none d-md-table-cell";
                                    if (hide_sm.includes(currentLine[j].trim())) classe = "d-none d-sm-table-cell";
                                    if (hide.includes(currentLine[j].trim())) classe = "d-none";
                                    html += `<th ${classe != '' ? `class="${classe}"` : ''}  data-field="${currentLine[j].trim()}" `;
                                    if (currentLine[j].trim() == 'Pic') html += `data-sortable="true" data-sorter="sortByHaveThenDate"`;
                                    if (currentLine[j].trim() == 'Set Code') html += `data-sortable="true"`;
                                    if (currentLine[j].trim() == 'Set Name') html += `data-sortable="true" `;
                                    if (currentLine[j].trim() == 'Edizione della carta')`data-sortable="true"`;
                                    if (currentLine[j].trim() == 'Release Date') html += `data-sortable="true" data-sorter="sortDate"`;
                                    if (currentLine[j].trim() == 'Have')`data-sortable="true"`;
                                    if (currentLine[j].trim() == 'Line ID')`data-sortable="true"`;
                                    html += `><b>${currentLine[j]}</b></th>`;
                                }
                                html += '</tr></thead><tbody>'
                                console.log({ pic, stc, stn, num, ed, not, rdt, hv, id })
                            } else {
                                if ($.trim(currentLine[7])) {
                                    html += `<tr class="table-success" lineid="${currentLine[id]}">`;//style="background-color: green;"
                                } else {
                                    html += `<tr lineid="${currentLine[id]}">`;
                                }
                                for (let j = 0; j < 9; j++) {
                                    //SETUP PIC
                                    if (j == 0) {
                                        let imgName = currentLine[pic];
                                        if (currentLine[stc].trim() !== '') imgName += `_${currentLine[stc]}`;
                                        if (currentLine[ed].trim() !== '') imgName += `_${rarityMatrix[currentLine[ed]]}`;
                                        let caption = `Set: ${currentLine[stn]} (${currentLine[rdt]}), ${currentLine[num]}, ${currentLine[ed]}`
                                        html += `<td style="width: 105px;"><img class="image img-fluid" id="${imgName}_${i}" src="./images/${languageCode}/${imgName}.jpg" onError="this.onerror=null;this.src='./images/EN/${imgName}.jpg';"
                                        alt="${currentLine[pic]}" width="95" height="133" onclick="imageModal('${imgName}_${i}','${caption}')" ></td>`;
                                    } else {
                                        let classe = '';
                                        if (hide.includes(head[j].trim())) classe = "d-none";
                                        if (hide_md.includes(head[j].trim())) classe = "d-none d-md-table-cell";
                                        if (hide_sm.includes(head[j].trim())) classe = "d-none d-sm-table-cell";
                                        html += `<td  ${classe != '' ? `class="${classe}"` : ''}>${currentLine[j]}</td>`;
                                    }
                                }
                                /* html += `<td class="checkbox">
                                <label for="${currentLine[8]}"> 
                                <input type="checkbox" class="line_check" id="${currentLine[8]}" name="${currentLine[8]}" >${currentLine[8]}</label>
                                </td>`;*/
                                html += `</tr>`;
                            }
                        }
                    }
                    html += '</tbody></table>';

                    $("#flag_table_div").html(html);
                    // console.log($('#flag_table').html());
                    $("#flag_table").css({ 'border-collapse': 'collapse' });
                    let cssObj = {
                        'border': `1px solid ${color}`,
                        'padding': '2px 5px 2px 5px',
                        'color': `${color}`,
                    };
                    $("#flag_table").find("th").css(cssObj);
                    $("#flag_table").find("tr:not(.table-success) > td").css(cssObj);
                    $("#flag_table").find("tr.table-success > td").css({
                        'border': `1px solid ${color}`,
                        'padding': '2px 5px 2px 5px',
                        'color': `black`,
                    });
                    /* $("#flag_table").find("td.checkbox").css({
                                            'background-color': `${mode === 'dark' ? "#000000" : "#FFFFFF"}`,
                                            'border': '0px',
                                            'padding': '2px 5px 2px 5px',
                                            'vertical-align': 'middle',
                                            'color': `${color}`,
                                        });
                                        $("#flag_table").find("input.line_check").css({
                                            'display': `${displayCheck}`,
                                            'margin-right': '5px'
                                        });
                                        $("#flag_table").find("td.checkbox label").css({
                                            'display': `${displayLabel}`,
                                            'align-items': 'center'
                                        }); */

                    //Imposto il campo select lingua alla lingua selezionata
                    $(`select#language option[value=${languageCode}]`).attr("selected", true);
                    $(`select#language option[value=${languageCode}]`).siblings().attr("selected", false);

                    $("#flag_table").bootstrapTable();
                    setTimeout(() => {
                        console.log($('#flag_table thead').length); // Se è 2, Bootstrap Table sta duplicando
                    }, 100);
                },
                error: function fail(error) {
                    console.log('errore con la tabella ' + languageCode);
                    alert(error);
                }
            });
        });
    }

});

//FUNZIONI DA RICHIAMARE, DEVONO ESSERE PRESENTI PRIMA DEL READY
function imageModal(imgId, caption) {
    let modal = document.getElementById('image_modal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    let img = document.getElementById(imgId);
    let modalImg = document.getElementById("image_modal_img");
    let captionText = document.getElementById("caption");

    //Inserisco i dati nel modale
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = caption;


    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
}

function sortDate(a, b) {
    const format = "DD/MM/YYYY";
    const dateA = moment(a, format);
    const dateB = moment(b, format);

    // Handle invalid dates just in case
    if (!dateA.isValid()) return 1;
    if (!dateB.isValid()) return -1;

    return dateA - dateB;
}

// Ora il sorter personalizzato per la colonna Pic
// bootstrap-table sorter signature: (a, b, rowA, rowB)
// Riordina per Have e poi in maniera crescente per data
function sortByHaveThenDate(a, b, rowA, rowB) {
    const sortOrder = $('#flag_table').bootstrapTable('getOptions').sortOrder || 'asc';

    const haveA = rowA.Have || "";
    const haveB = rowB.Have || "";

    // Primo criterio: ordinamento per 'Have'
    if (haveA === "x" && haveB !== "x") return -1;
    if (haveA !== "x" && haveB === "x") return 1;

    // Se sono uguali, ordino la data in base all'ordine globale
    const k = sortOrder === 'asc' ? 1 : -1;
    return k * sortDate(rowA['Release Date'], rowB['Release Date']);
}


