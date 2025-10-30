import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({ user_id: user.id, total: totalPrice, shipping_address: address })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      await clearCart();
      toast({ title: "Order placed successfully!" });
      navigate("/account");
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="space-y-4">
          <div>
            <Label>Shipping Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" />
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Order Total: ${totalPrice.toFixed(2)}</h3>
          </div>
          <Button onClick={handleCheckout} disabled={loading || !address} className="w-full" size="lg">
            {loading ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
