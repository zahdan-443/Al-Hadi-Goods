let currentBilty = "";

function getBiltyNo(){

  let no = localStorage.getItem("bilty_no");

  if(!no){
    no = 1;
  } else {
    no = parseInt(no) + 1;
  }

  localStorage.setItem("bilty_no", no);

  return "AH-" + String(no).padStart(4,"0");
}

function generate(){

  const bilty = getBiltyNo();
  currentBilty = bilty;

  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const date = document.getElementById("date").value;

  const consignor = document.getElementById("consignor").value;
  const consignee = document.getElementById("consignee").value;

  const total = Number(document.getElementById("total").value || 0);
  const advance = Number(document.getElementById("advance").value || 0);
  const payable = total - advance;

  document.getElementById("biltyNo").innerText = bilty;

  document.getElementById("p_from").innerText = from;
  document.getElementById("p_to").innerText = to;
  document.getElementById("p_date").innerText = date;

  document.getElementById("p_consignor").innerText = consignor;
  document.getElementById("p_consignee").innerText = consignee;

  document.getElementById("p_total").innerText = total;
  document.getElementById("p_advance").innerText = advance;
  document.getElementById("p_payable").innerText = payable;

  // QR FIX
  document.getElementById("qr").innerHTML = "";

  new QRCode(document.getElementById("qr"), {
    text: bilty + " | " + from + " → " + to + " | Payable: " + payable,
    width: 120,
    height: 120
  });

}

function downloadPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("AL-HADI GOODS BILTY", 20, 20);
  doc.text("Bilty: " + currentBilty, 20, 30);

  doc.text("From: " + document.getElementById("p_from").innerText, 20, 50);
  doc.text("To: " + document.getElementById("p_to").innerText, 20, 60);

  doc.text("Total: " + document.getElementById("p_total").innerText, 20, 80);
  doc.text("Advance: " + document.getElementById("p_advance").innerText, 20, 90);
  doc.text("Payable: " + document.getElementById("p_payable").innerText, 20, 100);

  doc.save(currentBilty + ".pdf");
}
