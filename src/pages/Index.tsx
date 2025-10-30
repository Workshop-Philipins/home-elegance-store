import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-decor.jpg";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
}

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, slug, price, image_url")
        .eq("featured", true)
        .limit(4);

      if (!error && data) {
        setFeaturedProducts(data);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-background/40" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Transform Your Space
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-foreground/90">
            Curated home decor for modern living
          </p>
          <Link to="/shop">
            <Button size="lg" className="text-lg px-8">
              Shop Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-lg text-muted-foreground">
              Handpicked pieces for your home
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} imageUrl={product.image_url} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {["Living Room", "Bedroom", "Kitchen & Dining", "Lighting", "Wall Art", "Textiles"].map(
              (category) => (
                <Link
                  key={category}
                  to={`/shop?category=${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group"
                >
                  <div className="aspect-square bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all">
                    <div className="flex h-full items-center justify-center">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {category}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Haven. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
