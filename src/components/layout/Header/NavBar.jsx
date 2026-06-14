import React from "react";
import { NavLink } from "react-router";
import { ChevronDown, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = ({ links }) => {
  // دالة فرعية لمعالجة وعرض العناصر المتداخلة بشكل تكراري (Recursive)
  const renderDropdownItems = (items) => {
    return items.map((item) => {
      // إذا كان العنصر يحتوي على قائمة فرعية داخلية (المستوى الثالث فما فوق)
      if (item.list && item.list.length > 0) {
        return (
          <DropdownMenuSub key={item.id}>
            <DropdownMenuSubTrigger className="flex items-center justify-between gap-2 w-full ">
              <span>{item.name}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className=" min-w-[8rem]">
                {renderDropdownItems(item.list)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
      }

      // عنصر نهائي داخل القائمة المنسدلة
      return (
        <DropdownMenuItem key={item.id} asChild>
          <NavLink to={item.url} className="w-full  block px-2 py-1.5">
            {item.name}
          </NavLink>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <nav
      className={`flex items-center gap-4`}
    >
      {links.map((link) => {
        // إذا كان الرابط الرئيسي في الـ Navbar يحتوي على قائمة فرعية (المستوى الثاني)
        if (link.list && link.list.length > 0) {
          return (
            <DropdownMenu key={link.id}>
              <DropdownMenuTrigger className="nav_link flex items-center gap-1 focus:outline-none">
                {link.name}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" min-w-[12rem]">
                {/* رابط اختياري للعنصر الرئيسي نفسه إذا كنت تريده قابلاً للضغط */}
                <DropdownMenuItem asChild>
                  <NavLink to={link.url} className="w-full font-bold">
                    كل {link.name}
                  </NavLink>
                </DropdownMenuItem>

                {/* استدعاء الدالة لعرض العناصر الفرعية */}
                {renderDropdownItems(link.list)}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        // رابط عادي بدون أي قوائم منسدلة
        return (
          <NavLink key={link.id} to={link.url} className="nav_link">
            {link.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default NavBar;
