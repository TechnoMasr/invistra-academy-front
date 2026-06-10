import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCartItemsCount } from "@/api/cartServices";
import { Button } from "@/components/ui/button";
import { GrCart } from "react-icons/gr";

const CartIcon = ({ user }) => {
  const { data: cartCount = 0 } = useQuery({
    queryKey: ["cart_count"],
    queryFn: getCartItemsCount,
    enabled: !!user,
  });

  return (
    <Link to="/cart" className="relative">
      <Button variant="secondary" size="icon" className="rounded-full">
        <GrCart />
      </Button>

      {cartCount > 0 && (
        <span
          className="absolute -top-2 -inset-e-1 bg-destructive text-white text-sm rounded-full w-4 h-4 
            flex items-center justify-center"
        >
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
