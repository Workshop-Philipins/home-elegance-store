import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
}

export const ProductCard = ({ id, name, slug, price, imageUrl }: ProductCardProps) => {
  const { addToCart } = useCart();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${slug}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${slug}`}>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-semibold text-primary">
          ${price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => addToCart(id)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
