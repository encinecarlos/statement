function generateStatementData(invoice, plays) {
  const statementData = {};

  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = calculateTotalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);

  return statementData;

  function enrichPerformance(performance) {
    const calulator = createPerformanceCalculator(performance, playFor(performance));

    const result = Object.assign({}, performance);
    result.play = calulator.play;
    result.amount = calulator.amount;
    result.volumeCredits = calulator.volumeCredits;
    return result;
  }

  function playFor(performance) {
    return plays[performance.playID];
  }

  function calculateTotalAmount(data) {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, perf) => total + perf.volumeCredits, 0);
  }

  function createPerformanceCalculator(performance, play) {
    switch(play.type) {
      case "tragedy": return new TragedyCalculator(performance, play);
      case "comedy": return new ComedyCalculator(performance, play);
      default: throw new Error(`unknwon type: ${play.type}`); 
    }
  }
}

class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  } 
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }

    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;

    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

exports.generateStatementData = generateStatementData;
