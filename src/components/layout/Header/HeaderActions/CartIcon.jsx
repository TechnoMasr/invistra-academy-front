import { Link } from "react-router";
import { SlHandbag } from "react-icons/sl";
import { useQuery } from "@tanstack/react-query";
import { getCartItemsCount } from "@/api/cartServices";

const CartIcon = ({ user }) => {
  const { data: cartCount = 0 } = useQuery({
    queryKey: ["cart_count"],
    queryFn: getCartItemsCount,
    enabled: !!user,
  });

  return (
    <Link to="/cart" className="relative">
      <SlHandbag className="header_icon" />

      {cartCount > 0 && (
        <span
          className="absolute -top-2 -inset-e-1 bg-secondary text-primary text-sm rounded-full w-4 h-4 
            flex items-center justify-center"
        >
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
