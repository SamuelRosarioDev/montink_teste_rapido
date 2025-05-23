"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { calcularFrete } from "@/app/_utils/freteUtils";
import { Address } from "@/app/_types/address.type";

interface InputCepProps {
  cep: string;
  setCep: (cep: string) => void;
  onFreteCalculated: (
    freteMsg: string | null,
    freteVal: number,
    address: Address | null
  ) => void;
  setError: (error: string | null) => void;
}

export function InputCep({
  cep,
  setCep,
  onFreteCalculated,
  setError,
}: InputCepProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckCep = async () => {
    const { freteMsg, freteVal, numericCep, error } = calcularFrete(cep);

    if (error) {
      setError(error);
      onFreteCalculated(null, 0, null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
      const data: Address & { erro?: boolean } = await res.json();

      if (data.erro) {
        setError("CEP não encontrado.");
        onFreteCalculated(null, 0, null);
      } else {
        onFreteCalculated(freteMsg, freteVal, data);
      }
    } catch {
      setError("Erro ao buscar o endereço.");
      onFreteCalculated(null, 0, null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCep("");
    setError(null);
    onFreteCalculated(null, 0, null);
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-gray-700 mb-1">
        Consultar Entrega (CEP)
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite o CEP, apenas números"
          className="border rounded-md p-2 w-full"
        />
        <Button onClick={handleCheckCep} disabled={loading}>
          {loading ? "Consultando..." : "Consultar"}
        </Button>
        {cep && (
          <Button variant="outline" onClick={handleClear}>
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
