"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { setWithExpiry, getWithExpiry } from "@/app/_utils/localStorageUtils";
import { Product } from "@/app/_types/products.type";
import { InputCep } from "@/app/_utils/cepInput";
import { Address } from "@/app/_types/address.type";
import { SavedState } from "@/app/_types/SavedState.type";

export function ProductCard({ product }: { product: Product }) {
  const storageKey = `product-${product.id}`;

  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<string | null>(null);
  const [freteValor, setFreteValor] = useState(0);
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveState = (state: SavedState) => {
    setWithExpiry(storageKey, state, 15 * 60 * 1000);
  };

  useEffect(() => {
    const saved = getWithExpiry<SavedState>(storageKey);

    if (saved) {
      setSelectedSize(saved.selectedSize);
      setSelectedColor(saved.selectedColor);
      setCep(saved.cep);
      setFrete(saved.frete);
      setFreteValor(saved.freteValor);
      setAddress(saved.address);
    }
  }, [storageKey]);

  useEffect(() => {
    saveState({ selectedSize, selectedColor, cep, frete, freteValor, address });
  }, [selectedSize, selectedColor, cep, frete, freteValor, address]);

  const handleFreteCalculated = (
    freteMsg: string | null,
    freteVal: number,
    addr: Address | null
  ) => {
    setFrete(freteMsg);
    setFreteValor(freteVal);
    setAddress(addr);
  };

  const priceNumber = parseFloat(product.price);
  const totalPrice = priceNumber + freteValor;

  return (
    <Card className="rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform">
      <Image
        src={mainImage}
        alt={product.name}
        width={600}
        height={400}
        className="w-full h-64 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
      />

      <div className="flex space-x-2 p-4">
        {product.images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setMainImage(img)}
            className={`border-2 ${
              mainImage === img ? "border-primary" : "border-transparent"
            } rounded-md overflow-hidden`}
          >
            <Image
              src={img}
              alt={`Miniatura ${idx + 1}`}
              width={80}
              height={80}
              className="object-cover w-20 h-20"
            />
          </button>
        ))}
      </div>

      <CardContent className="p-6 justify-between flex flex-col">
        <div>
          <Badge className="mb-2">{product.status}</Badge>
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 mt-2">{product.description}</p>
        </div>

        <div>
          {/* Tamanho */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-1">Tamanho</h3>
            <div className="flex gap-2">
              {product.variants.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-md border ${
                    selectedSize === size
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-1">Cor</h3>
            <div className="flex gap-2">
              {product.variants.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded-md border ${
                    selectedColor === color
                      ? "bg-primary text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* InputCep */}
          <InputCep
            cep={cep}
            setCep={setCep}
            onFreteCalculated={handleFreteCalculated}
            setError={setError}
          />

          {/* Mensagens */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {frete && !error && (
            <p className="text-green-600 mt-2 font-semibold">{frete}</p>
          )}

          {address && (
            <div className="mt-2 text-sm text-gray-700">
              <p>
                <strong>Endereço:</strong> {address.logradouro}, {address.bairro},{" "}
                {address.localidade}, {address.uf}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-xl font-semibold text-primary">
              {frete !== null
                ? `Total: R$ ${totalPrice.toFixed(2)}`
                : `Preço: R$ ${product.price}`}
            </div>
            <Button size="lg" className="rounded-xl">
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
