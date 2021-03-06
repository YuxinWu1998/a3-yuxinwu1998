function reset() {
  document.form.name.value = "";
  document.form.min.value = "";
  document.form.age.value = "";
  document.form.weight.value = "";
}

function addWater() {
  let current = document.getElementById("addItem").innerText;
  if(current === "CALCULATE") {
    let name = document.form.name.value;
    let min = document.form.min.value;
    let age = document.form.age.value;
    let weight = document.form.weight.value;

    if (name && min && age && weight) {
        let data = {};
        data['name'] = name.toString();
        data['min'] = min.toString();
        data['age'] = age.toString();
        data['weight'] = weight.toString();
        let sendData = JSON.stringify(data);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = handle_res;
        xhr.open("post", "/addItem");
        xhr.send(sendData);

        function handle_res() {
            if (this.readyState !== 4) return;
            if (this.status !== 200) return;
            let sentBackObj = JSON.parse(this.responseText);
            //insert the row
            let currentRows = document.getElementById("table").rows.length;
            let insertTr = document.getElementById("table").insertRow(currentRows);
            for (let i = 0; i < 5; i++) {
                let insertTd = insertTr.insertCell(i);
                insertTd.innerHTML = '<class = "tbl-body">';
                insertTr.className = 'tbl-data';
            }
            let insertCheckbox = insertTr.insertCell(5);
            insertCheckbox.innerHTML = ' <label class="container">\n' +
                '                                        <input class="tbl-ckb" type="Checkbox" id="checkbox" name="checkbox" onclick="ifAllChecked()">\n' +
                '                                        <span class="ckm"></span></label>';

                let insertID = insertTr.insertCell(6);
                insertID.className = "id";

            let table = document.getElementById("table");
            table.rows[currentRows].cells[0].innerText = sentBackObj.name;
            table.rows[currentRows].cells[1].innerText = sentBackObj.min;
            table.rows[currentRows].cells[2].innerText = sentBackObj.age;
            table.rows[currentRows].cells[3].innerText = sentBackObj.weight;
            table.rows[currentRows].cells[4].innerText = sentBackObj.cal;
            table.rows[currentRows].cells[6].innerText = sentBackObj.id;
        }
    } else {
      alert("Please Fill Out All the Information Correctly!");
    }
  } else {
        let name = document.form.name.value;
        let min = document.form.min.value;
        let age = document.form.age.value;
        let weight = document.form.weight.value;
        let id = document.form.idInput.value;
            let data = {};
            data['name'] = name.toString();
            data['min'] = min.toString();
            data['age'] = age.toString();
            data['weight'] = weight.toString();
            data['cal'] = 123321123;
            data['id'] = id;
            let sendData = JSON.stringify(data);
            let xhr = new XMLHttpRequest();
            xhr.open("post", "/updateSection");
            xhr.send(sendData);
            document.getElementById("addItem").innerText = "CALCULATE";

            let leg = document.getElementById("table").rows.length;
            for (let j = leg -1; j > 0; j--) {
                    document.getElementById("table").deleteRow(j);
                }
            reset();
            loadDB();      
  }
}

function updateRow() {
    let checkbox = document.getElementsByName("checkbox");
    let table = document.getElementById("table");
  
    let name = document.getElementById("name");
    let min = document.getElementById("min");
    let age = document.getElementById("age");
    let weight = document.getElementById("weight");
    let idInput = document.getElementById("idInput");
  
    let leg = checkbox.length ;
    for (let j = leg - 1; j > 0; j--) {
        if (checkbox[j].checked === true) {
            name.value = table.rows[j].cells[0].innerHTML;
            min.value = table.rows[j].cells[1].innerHTML;
            age.value = table.rows[j].cells[2].innerHTML;
            weight.value = table.rows[j].cells[3].innerHTML;
            idInput.value = table.rows[j].cells[6].innerHTML;
        }
    }
    document.getElementById("addItem").innerText = "UPDATE ITEM";
  }

function delRow() {
  let checkbox = document.getElementsByName("checkbox");
  let table = document.getElementById("table");
  let leg = checkbox.length ;

  let sendData = [];
  let xhr = new XMLHttpRequest();
  xhr.open("post", "/deleteSection");

  for(let j = 1; j < leg; j++) {
      if(checkbox[j].checked === true) {
          sendData.push(table.rows[j].cells[6].innerText);
          console.log(table.rows[j].cells[6].innerText);
      }
  }
  xhr.send(sendData);

  for (let j = leg - 1; j > 0; j--) {
      if (checkbox[j].checked === true) {
          document.getElementById("table").deleteRow(j);
      }
      let delButton = document.getElementById("del");
      let updateButton = document.getElementById("update");
      document.getElementById("addItem").innerText = "CALCULATE";
      delButton.style.visibility = "hidden";
      updateButton.style.visibility = "hidden";
  }
  document.getElementById("allcheck").checked = false;
  reset();
  buttonDisabled("del");
  buttonDisabled("update");
}

function buttonDisabled(name){
  let button = document.getElementById(name);
  button.style.visibility = "visible";
  button.disabled = true;
  button.className = "delebtn btn_border btn_primary";
}

function buttonUnDisabled(name){
  let button = document.getElementById(name);
  button.style.visibility = "visible";
  button.disabled = false;
  button.className = "delebtn btn_border btn_primary btn_animated";
}

function showDel() {
  let checkbox = document.getElementsByName("checkbox");
  let buttonDelete = document.getElementById("del");
  let buttonUpdate = document.getElementById("update");

  buttonDelete.style.visibility = "visible";
  buttonUpdate.style.visibility = "visible";

  let length = checkbox.length;
  let checkTimes = 0;
  let flag = 1;
  for (let i = 1; i < length; i++) {
      if (checkbox[i].checked === true) {
          checkTimes++;
          flag = 0;
          updateRowNum = i;
      }
  }
  if (flag === 0) {
      buttonUnDisabled("del");
  }
  else {
      buttonDisabled("del");
      document.getElementById("addItem").innerText = "CALCULATE";
      reset();
  }
  if(checkTimes === 1) {
      buttonUnDisabled("del");
      buttonUnDisabled("update");
  }
  else {
      document.getElementById("addItem").innerText = "CALCULATE";
      reset();
      buttonDisabled("update");
  }
}

function ifAllChecked() {
  let checkbox = document.getElementsByName("checkbox");
  for (let m = 0; m < checkbox.length; m++) {
      if (checkbox[m].checked === false) {
          document.getElementById("allcheck").checked = false;
      }
  }
  showDel();
}

function selectAll() {
  let checkbox = document.getElementsByName("checkbox");
  for (let m = 1; m < checkbox.length; m++) {
      if (document.getElementById("allcheck").checked === true) {
          checkbox[m].checked = true;
      }
      else {
          checkbox[m].checked = false;
      }
  }
  showDel();
}

function toFloat(x) {
  return parseFloat(x).toFixed(2);
}

function loadDB() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handle_res2;
    xhr.open("post", "/loadDB");
    xhr.send();

    function handle_res2() {
        if (this.readyState !== 4) return;
        if (this.status !== 200) return;

        let sentBackObj = JSON.parse(this.responseText);
        console.log("responsetext "+sentBackObj);

        for (var j = 0; j < sentBackObj.length; j++) {
            let currentRows = document.getElementById("table").rows.length;
            let insertTr = document.getElementById("table").insertRow(currentRows);
            for (let i = 0; i < 5; i++) {
                let insertTd = insertTr.insertCell(i);
                insertTd.innerHTML = '<class = "tbl-body">';
                insertTr.className = 'tbl-data';
            }
            let insertCheckbox = insertTr.insertCell(5);
            insertCheckbox.innerHTML = ' <label class="container">\n' +
                '<input class="tbl-ckb" type="Checkbox" id="checkbox" name="checkbox" onclick="ifAllChecked()">\n' +
                '<span class="ckm"></span></label>';

            let insertID = insertTr.insertCell(6);
            insertID.className = "id";

            let table = document.getElementById("table");
            let cal111 = 0;
            table.rows[currentRows].cells[0].innerText = sentBackObj[j].w_name;
            table.rows[currentRows].cells[1].innerText = sentBackObj[j].w_min;
            table.rows[currentRows].cells[2].innerText = sentBackObj[j].w_age;
            table.rows[currentRows].cells[3].innerText = sentBackObj[j].w_weight;

            if (0 < sentBackObj[j].w_age <= 30) {
                cal111 = ((((sentBackObj[j].w_weight / 2.2) * 40) / 28.3) + sentBackObj[j].w_min * 0.4).toFixed(2);
              } else if (30 < sentBackObj[j].w_age <= 55) {
                cal111 = ((((sentBackObj[j].w_weight / 2.2) * 35) / 28.3) + sentBackObj[j].w_min * 0.4).toFixed(2);
              } else if (55 < sentBackObj[j].w_age) {
                cal111 = ((((sentBackObj[j].w_weight / 2.2) * 30) / 28.3) + sentBackObj[j].w_min * 0.4).toFixed(2);
              };

            table.rows[currentRows].cells[4].innerText = cal111;
            table.rows[currentRows].cells[6].innerText = sentBackObj[j]._id;
        }
    }
}