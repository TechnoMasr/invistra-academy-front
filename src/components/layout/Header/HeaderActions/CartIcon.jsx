import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getCartItemsCount } from "@/api/cartServices";
import { Button } from "@/components/ui/button";
import { GrCart } from "react-icons/gr";

const CartIcon = ({ user }) => {
  const { data: cartCount = 0 } = useQuery({
    queryKey: ["cartItemsCount"],
    queryFn: getCartItemsCount,
    enabled: !!user,
  });

  const count = cartCount?.count > 9 ? "9+" : cartCount?.count;

  return (
    <Link to="/cart" className="relative">
      <Button size="icon" className="rounded-full">
        <GrCart />
      </Button>

      {count > 0 && (
        <span
          className="absolute -top-2 -inset-e-1 bg-destructive text-white text-sm rounded-full w-4 h-4 
            flex items-center justify-center"
        >
          {count}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
