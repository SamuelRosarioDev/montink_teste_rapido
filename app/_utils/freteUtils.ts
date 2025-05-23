export function calcularFrete(cep: string) {
  const numericCep = cep.replace(/\D/g, "");
  if (numericCep.length !== 8) {
    return { freteMsg: null, freteVal: 0, error: "CEP inválido." };
  }

  const numeroCep = parseInt(numericCep);
  let freteMsg = "Frete: R$ 32,00";
  let freteVal = 32;

  if (numeroCep >= 30000000 && numeroCep <= 39999999) {
    freteMsg = "Frete: Grátis";
    freteVal = 0;
  } else {
    const faixasVizinhas = [
      [1000000, 19999999],
      [20000000, 28999999],
      [29000000, 29999999],
      [40000000, 48999999],
      [70000000, 72799999],
      [72800000, 76799999],
      [79000000, 79999999],
    ];

    for (const [inicio, fim] of faixasVizinhas) {
      if (numeroCep >= inicio && numeroCep <= fim) {
        freteMsg = "Frete: R$ 23,00";
        freteVal = 23;
        break;
      }
    }
  }

  return { freteMsg, freteVal, numericCep, error: null };
}
