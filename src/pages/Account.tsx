import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Account = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    const fetchOrders = async () => {
      const { data } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setOrders(data);
    };
    fetchOrders();
  }, [user, navigate]);

  return (
    <div className="min-h-screen"><Navbar /><div className="container mx-auto px-4 py-12"><h1 className="text-4xl font-bold mb-8">My Account</h1><Button onClick={signOut} variant="outline">Sign Out</Button><h2 className="text-2xl font-bold mt-8 mb-4">Order History</h2>{orders.length === 0 ? <p>No orders yet</p> : <div className="space-y-4">{orders.map(order => <div key={order.id} className="p-4 bg-card rounded-lg border"><p className="font-semibold">Order #{order.id.slice(0, 8)}</p><p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p><p className="text-primary font-semibold">${order.total}</p><p className="text-sm">Status: {order.status}</p></div>)}</div>}</div></div>
  );
};

export default Account;
