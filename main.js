var showData;
var edtRecord;
var delRecord;
var tempData;
var targetPage;
var totalPages;
var rowPerPage = 10;
var currPage = 1;

var base = "https://script.google.com/macros/s/AKfycbx8ul_MtfTK_DZ-PUaHVRh0DXckJ7_2zdxNRxr_Q2AtaliXcEVJtjk8zgU9Q_VqHwuI/exec";
getData();

//Get-API to call for data from GSheet and then send the data to show in the table

function getData(){
  fetch(base)
  .then(res=>res.json())
  .then( data => {
      if (data.length > 0) {
        tempData = data;
        pageControl()
      }
      else{
        console.error("No data retrieved")
      }
  })
  .catch(error => console.error(error))
  }

function pageControl(){
    totalPages = Math.ceil((tempData.length/rowPerPage));
    currPage = sessionStorage.getItem("currPage");
    (currPage == null)? currPage = 1: currPage;
    (currPage>totalPages)? currPage = totalPages: currPage;
    document.getElementById("inputCurrentPage").value = currPage;
    document.getElementById("inputTotalPages").value = totalPages;
    myPagination(currPage);
}

document.getElementById("btnPrevious").addEventListener("click",()=>{
    let currTarget = document.getElementById("inputCurrentPage").value;
    targetPage = parseInt(currTarget)-1;
    (targetPage<1)? targetPage = 1: targetPage;
    document.getElementById("inputCurrentPage").value = targetPage;
    sessionStorage.setItem("currPage", targetPage);
    myPagination(targetPage);
})
document.getElementById("btnNext").addEventListener("click",()=>{
    let currTarget = document.getElementById("inputCurrentPage").value;
    targetPage = parseInt(currTarget)+1;
    (targetPage>totalPages)? targetPage = totalPages: targetPage;
    document.getElementById("inputCurrentPage").value = targetPage;
    sessionStorage.setItem("currPage", targetPage);
    myPagination(targetPage);
})
document.getElementById("inputCurrentPage").addEventListener("change",()=>{
    let targetPage = document.getElementById("inputCurrentPage").value;
    (targetPage>totalPages)? targetPage = totalPages: targetPage;
    (targetPage<1)? targetPage = 1: targetPage;
    document.getElementById("inputCurrentPage").value = targetPage;
    sessionStorage.setItem("currPage", targetPage);
    myPagination(targetPage);
})

function myPagination(targetPage){
  let pageIndex = targetPage-1;
  const startingRow = (rowPerPage*pageIndex);
  var lastRow;

  switch (targetPage){
     case 1:
        (tempData.length < rowPerPage)? lastRow = (rowPerPage*pageIndex)+tempData.length: lastRow = (rowPerPage*pageIndex)+rowPerPage;
        break;
     case totalPages:
        (tempData.length%rowPerPage == 0)? lastRow = (rowPerPage*pageIndex)+rowPerPage: lastRow = (rowPerPage*pageIndex)+(tempData.length%rowPerPage);
        break;
     default:
        lastRow =  (rowPerPage*pageIndex)+rowPerPage;
  }

  var myHTML="";
  var newData = tempData.slice(startingRow, lastRow)
      for (let i=0; i<newData.length ; i++){
        myHTML +=`<tr><td>${newData[i][0]}</td><td>${newData[i][1]}</td><td>${newData[i][2]}</td><td>
        <div class="action">
        <button type="button" class="btnEdt" dataid=${newData[i][0]} name=${newData[i][1]} surname=${newData[i][2]} id="btnEdt${i}" onclick="modalEdt(this.id)" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        <span class="material-symbols-outlined">edit_document</span></button>
        <button type="button" class="btnDel" dataid=${newData[i][0]} id="btnDel${i}" onclick="modalDel(this.id)"  data-bs-toggle="modal" data-bs-target="#staticBackdrop2"><span class="material-symbols-outlined">
        delete</span></button>
        </div></td></tr>`
      }
  document.getElementById('showTable').innerHTML = myHTML;
}

async function addData(){
  let name = document.getElementById("mdl3_name").value;
  let surname = document.getElementById("mdl3_surname").value;
  let parameter = `?action=append&name=${name}&surname=${surname}`
  let options = {
    method: "POST",
    mode: "no-cors"
  }
  const res = await fetch(base+parameter, options)
  document.getElementById("btnClose3").click();
  getData();
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        showConfirmButton: false,
        timer: 1500
      });
}

function modalEdt(e){
  edtRecord = [document.getElementById(e).getAttribute("dataid"),
                document.getElementById(e).getAttribute("name"),
                document.getElementById(e).getAttribute("surname")] ;
  document.getElementById("mdl_name").value = edtRecord[1];
  document.getElementById("mdl_surname").value = edtRecord[2];
}

async function edtData(){
  let id = edtRecord[0];
  let name = document.getElementById("mdl_name").value;
  let surname = document.getElementById("mdl_surname").value;
  let parameter = `?action=edt&id=${id}&name=${name}&surname=${surname}`
  let options = {
    method: "POST",
    mode: "no-cors"
  }
  const res = await fetch(base+parameter, options)
  document.getElementById("btnClose").click();
  getData();
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        showConfirmButton: false,
        timer: 1500
      });
}

function modalDel(e){
    delRecord = document.getElementById(e).getAttribute("dataid");
}

async function delData(){
  let parameter = `?action=del&id=${delRecord}`
  let options = {
    method: "POST",
    mode: "no-cors"
  }
  const res = await fetch(base+parameter, options)
  document.getElementById("btnClose2").click();
  getData()
      Swal.fire({
          position: "center",
          icon: "success",
          title: "Success",
          showConfirmButton: false,
          timer: 1500
        });
}