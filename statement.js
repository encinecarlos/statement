const { generateStatementData } = require("./generateStatementData");

function statement(invoice, plays) {
  return RenderPlainText(generateStatementData(invoice, plays));
}

function htmlstatement(invoice, plays) {
  return renderHtml(generateStatementData(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`;
  
  result += "<table>\n";
  result += "<tr>th>Play</th><yh>Seats</th><th>Cost</th></tr>";
  
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }

  result += "</table>\n";
  result += `<p>Amount owned is <em>${usd(data.totalAmount)}</em> credits</p>\n`;
  
  return result; 
}


function RenderPlainText(data) {
  let result = `Statement for ${data.customer}\n`;
  
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
  }
  
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}


module.exports = statement;