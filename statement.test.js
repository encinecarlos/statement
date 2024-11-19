const statement = require("./statement");

describe("statement", () => {
  const plays = {
    hamlet: { name: "Hamlet", type: "tragedy" },
    "as-like": { name: "As You Like It", type: "comedy" },
    othello: { name: "Othello", type: "tragedy" },
  };

  test("should return correct statement for multiple performances", () => {
    const invoice = {
      customer: "BigCo",
      performances: [
        { playID: "hamlet", audience: 55 },
        { playID: "as-like", audience: 35 },
        { playID: "othello", audience: 40 },
      ],
    };

    const result = statement(invoice, plays);
    
    const expected = `Statement for BigCo
  Hamlet: $650.00 (55 seats)
  As You Like It: $580.00 (35 seats)
  Othello: $500.00 (40 seats)
  Amount owed is $1,730.00
  You earned 47 credits`
      .replace(/\s+/g, " ")
      .trim();

    const normalizedResult = result.replace(/\s+/g, " ").trim();
    
    expect(normalizedResult).toBe(expected);
  });

  test("should throw error for unknown play type", () => {
    const invoice = {
      customer: "BigCo",
      performances: [{ playID: "unknown", audience: 55 }],
    };

    expect(() => statement(invoice, plays)).toThrowError();
  });

  test("should return correct statement for single performance", () => {
    const invoice = {
      customer: "BigCo",
      performances: [{ playID: "hamlet", audience: 55 }],
    };

    const result = statement(invoice, plays);
    expect(result).toBe(
      `Statement for BigCo\n` +
        ` Hamlet: $650.00 (55 seats)\n` +
        `Amount owed is $650.00\n` +
        `You earned 25 credits\n`
    );
  });

  test("should return correct statement for comedy play", () => {
    const invoice = {
      customer: "BigCo",
      performances: [{ playID: "as-like", audience: 35 }],
    };

    const result = statement(invoice, plays);
    expect(result).toBe(
      `Statement for BigCo\n` +
        ` As You Like It: $580.00 (35 seats)\n` +
        `Amount owed is $580.00\n` +
        `You earned 12 credits\n`
    );
  });
});
