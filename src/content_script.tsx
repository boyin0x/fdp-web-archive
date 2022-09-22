


const html2pdf = require("html2pdf.js")

function reportStatus(status: string) {
  chrome.runtime.sendMessage({ status: status })
}

chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
  if (msg.generate) {
    createPdf()
    sendResponse("Creating pdf...")
  }
});

async function createPdf() {

  
  const options = {
    filename: "testname.pdf",
    html2canvas: { scale: 4 }
  }
  let res: any
  const pdf = await html2pdf().set(options).from(document.body).toPdf().get('pdf')
  res = pdf.output('bloburl')

  reportStatus("Pdf Created...")
  chrome.runtime.sendMessage({
    pdf: res,
    url: window.location.href,
    title: document.title,
    text: document.body.innerText  || ""
  })
}

