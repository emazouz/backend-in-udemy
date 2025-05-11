import ProductCard from "components/ui/ProductCard";
import { BASE_URL } from "constant/BasicUrl";
import type { IProduct } from "interfaces/productInterface";
import { useEffect, useState } from "react";

export default function AllProduct() {
  const [products, setProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    const fetchAllProduct = async () => {
      const response = await fetch(`${BASE_URL}/product`);
      const data = await response.json();
      setProducts(data);
    };
    fetchAllProduct();
  }, []);

  return (
    <div className="container grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
      {products?.map((p) => (
        <ProductCard {...p} key={p._id}/>
      ))}
    </div>
  );
}
