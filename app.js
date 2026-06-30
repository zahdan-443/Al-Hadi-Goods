let currentBilty = "";

function showTab(id){

  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function getBiltyNo(){

  let no = localStorage.getItem("bilty_no") || 0;
  no = parseInt(no) + 1;

  localStorage.setItem("bilty_no", no);

  return "AH-" + String(no).padStart(4,"0");
}

function generate(){

  currentBilty = getBiltyNo();

  let from = val("from");
  let to = val("to");
  let date = val("date");

  let consignor = val("consignor");
  let consignee = val("consignee");

  let total = num("total");
  let advance = num("advance");
  let payable = total - advance;

  set("biltyNo", currentBilty);
  set("p_from", from);
  set("p_to", to);
  set("p_date", date);
  set("p_consignor", consignor);
  set("p_consignee", consignee);
  set("p_total", total);
  set("p_advance", advance);
  set("p_payable", payable);

  // QR FIX (NO EMPTY ERROR)
  let qrDiv = document.getElementById("qr");
  qrDiv.innerHTML = "";

  new QRCode(qrDiv, {
    text: currentBilty + " | " + from + " → " + to,
    width:120,
    height:120
  });
}

function downloadPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  doc.setFontSize(16);
  doc.text("AL-HADI GOODS", 60, 20);

  doc.setFontSize(12);
  doc.text("Bilty: " + currentBilty, 10, 40);

  doc.text("From: " + get("p_from"), 10, 55);
  doc.text("To: " + get("p_to"), 10, 62);

  doc.text("Total: " + get("p_total"), 10, 80);
  doc.text("Advance: " + get("p_advance"), 10, 88);
  doc.text("Payable: " + get("p_payable"), 10, 96);

  doc.save(currentBilty + ".pdf");
}

function searchBilty(){
  document.getElementById("result").innerHTML =
    "Search feature will be connected to storage upgrade next step.";
}

/* helpers */
function val(id){ return document.getElementById(id).value || ""; }
function num(id){ return Number(document.getElementById(id).value || 0); }
function set(id,val){ document.getElementById(id).innerText = val; }
function get(id){ return document.getElementById(id).innerText; }
