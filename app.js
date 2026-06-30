let currentBilty = "";

function getBiltyNo(){

  let no = localStorage.getItem("bilty_no");

  if(!no) no = 1;
  else no = parseInt(no) + 1;

  localStorage.setItem("bilty_no", no);

  return "AH-" + String(no).padStart(4,"0");
}

function generate(){

  let biltyNo = getBiltyNo();
  currentBilty = biltyNo;

  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;
  let date = document.getElementById("date").value;

  let consignor = document.getElementById("consignor").value;
  let consignee = document.getElementById("consignee").value;

  let total = Number(document.getElementById("total").value || 0);
  let advance = Number(document.getElementById("advance").value || 0);
  let payable = total - advance;

  document.getElementById("biltyNo").innerText = biltyNo;

  document.getElementById("p_from").innerText = from;
  document.getElementById("p_to").innerText = to;
  document.getElementById("p_date").innerText = date;

  document.getElementById("p_consignor").innerText = consignor;
  document.getElementById("p_consignee").innerText = consignee;

  document.getElementById("p_total").innerText = total;
  document.getElementById("p_advance").innerText = advance;
  document.getElementById("p_payable").innerText = payable;

  // QR
  document.getElementById("qr").innerHTML = "";

  new QRCode(document.getElementById("qr"), {
    text: JSON.stringify({
      bilty: biltyNo,
      from, to, total, advance, payable
    }),
    width:120,
    height:120
  });

  // SAVE TO GITHUB
  saveToGitHub({
    bilty: biltyNo,
    from, to,
    consignor, consignee,
    total, advance,
    payable,
    date
  });

}

async function saveToGitHub(data){

  const repo = "YOUR_USERNAME/al-hadi-goods";
  const path = "data/history.json";
  const token = "YOUR_GITHUB_TOKEN";

  let res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
  let file = await res.json();

  let history = JSON.parse(atob(file.content));

  history.push(data);

  let updated = btoa(JSON.stringify(history, null, 2));

  await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method:"PUT",
    headers:{
      "Authorization": "token " + token,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      message:"New Bilty " + data.bilty,
      content: updated,
      sha: file.sha
    })
  });

}

function downloadPDF(){

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("AL-HADI GOODS", 20, 20);
  doc.text("Bilty: " + currentBilty, 20, 30);

  doc.text("From: " + document.getElementById("p_from").innerText, 20, 50);
  doc.text("To: " + document.getElementById("p_to").innerText, 20, 60);

  doc.text("Total: " + document.getElementById("p_total").innerText, 20, 80);
  doc.text("Advance: " + document.getElementById("p_advance").innerText, 20, 90);
  doc.text("Payable: " + document.getElementById("p_payable").innerText, 20, 100);

  doc.save(currentBilty + ".pdf");

}