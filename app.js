let currentBilty = "";
let historyData = [];

function showTab(tab){
  document.getElementById("create").classList.add("hidden");
  document.getElementById("search").classList.add("hidden");

  document.getElementById(tab).classList.remove("hidden");
}

function getBiltyNo(){

  let no = localStorage.getItem("bilty_no");
  if(!no) no = 1;
  else no = parseInt(no) + 1;

  localStorage.setItem("bilty_no", no);

  return "AH-" + String(no).padStart(4,"0");
}

function generate(){

  const bilty = getBiltyNo();
  currentBilty = bilty;

  const from = fromVal("from");
  const to = fromVal("to");
  const date = fromVal("date");

  const consignor = fromVal("consignor");
  const consignee = fromVal("consignee");

  const total = num("total");
  const advance = num("advance");
  const payable = total - advance;

  set("biltyNo", bilty);

  set("p_from", from);
  set("p_to", to);
  set("p_date", date);
  set("p_consignor", consignor);
  set("p_consignee", consignee);

  set("p_total", total);
  set("p_advance", advance);
  set("p_payable", payable);

  // QR
  document.getElementById("qr").innerHTML = "";

  new QRCode(document.getElementById("qr"), {
    text: JSON.stringify({bilty,from,to,total,advance,payable}),
    width:120,
    height:120
  });

  // SAVE LOCAL HISTORY (for search page)
  historyData.push({bilty,from,to,consignor,consignee,total,advance,payable,date});

}

function downloadPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  doc.addImage(document.getElementById("pdfLogo"), "PNG", 10, 10, 20, 20);

  doc.setFontSize(16);
  doc.text("AL-HADI GOODS", 40, 20);

  doc.setFontSize(12);
  doc.text("Bilty: " + currentBilty, 10, 40);

  doc.text("From: " + get("p_from"), 10, 55);
  doc.text("To: " + get("p_to"), 10, 62);

  doc.text("Total: " + get("p_total"), 10, 80);
  doc.text("Advance: " + get("p_advance"), 10, 88);
  doc.text("Payable: " + get("p_payable"), 10, 96);

  // QR inside PDF
  const qrCanvas = document.querySelector("#qr canvas");
  if(qrCanvas){
    const qrImg = qrCanvas.toDataURL("image/png");
    doc.addImage(qrImg, "PNG", 150, 40, 40, 40);
  }

  doc.save(currentBilty + ".pdf");
}

function searchBilty(){

  let key = document.getElementById("searchInput").value;

  let found = historyData.find(x => x.bilty === key);

  let res = document.getElementById("result");

  if(!found){
    res.innerHTML = "Not Found";
    return;
  }

  res.innerHTML = `
    <h3>${found.bilty}</h3>
    <p>${found.from} → ${found.to}</p>
    <p>Total: ${found.total}</p>
    <p>Payable: ${found.payable}</p>
  `;
}

// helpers
function set(id,val){ document.getElementById(id).innerText = val; }
function get(id){ return document.getElementById(id).innerText; }
function fromVal(id){ return document.getElementById(id).value; }
function num(id){ return Number(document.getElementById(id).value||0); }
