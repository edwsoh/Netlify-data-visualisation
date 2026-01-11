import * as d3 from 'd3';

export async function loadData() {
  try {
    const data = await d3.csv('/medical-charges.csv', d => {
      return {
        age: +d.age,
        sex: d.sex,
        bmi: +d.bmi,
        children: +d.children,
        smoker: d.smoker,
        region: d.region,
        charges: +d.charges
      };
    });
    return data;
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
}

export function calculateMetrics(data) {
  const total = data.length;
  const avgCharge = d3.mean(data, d => d.charges);
  
  const smokerCharges = d3.mean(data.filter(d => d.smoker === 'yes'), d => d.charges);
  const nonSmokerCharges = d3.mean(data.filter(d => d.smoker === 'no'), d => d.charges);
  const smokerDifference = smokerCharges - nonSmokerCharges;

  return {
    total,
    avgCharge,
    smokerDifference
  };
}
