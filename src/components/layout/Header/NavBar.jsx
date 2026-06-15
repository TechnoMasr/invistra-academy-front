import React, { useState } from "react";
import { NavLink } from "react-router";
import { ChevronDown } from "lucide-react";
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
  // نضيف State للتحكم في فتح وإغلاق القائمة الرئيسية
  const [open, setOpen] = useState(false);

  const renderSubCategories = (subCategories, parentCategoryId) => {
    return subCategories.map((subItem) => {
      return (
        <DropdownMenuItem key={subItem.id} asChild>
          <NavLink
            to={`/courses?category_id=${parentCategoryId}&sub_category_id=${subItem.id}`}
            className="w-full block px-2 py-1.5 text-right"
          >
            {subItem.name}
          </NavLink>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <nav className="flex items-center gap-4">
      {links.map((link) => {
        if (link.list && link.list.length > 0) {
          return (
            // نربط القائمة بالـ State هنا
            <DropdownMenu key={link.id} open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="nav_link flex items-center gap-1 focus:outline-none">
                {link.name}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[14rem]">
                <DropdownMenuItem asChild>
                  <NavLink to={link.url} className="w-full font-bold">
                    كل {link.name}
                  </NavLink>
                </DropdownMenuItem>

                {link.list.map((category) => {
                  const hasSubCategories =
                    category.sub_categories &&
                    category.sub_categories.length > 0;

                  if (hasSubCategories) {
                    return (
                      <DropdownMenuSub key={category.id}>
                        {/* جعلنا الـ SubTrigger يتصرف كـ Child ونقلنا الـ NavLink للخارج لحل مشكلة الإغلاق والتوجيه معاً */}
                        <DropdownMenuSubTrigger className="flex items-center justify-between gap-2 w-full p-0">
                          <NavLink
                            to={`/courses?category_id=${category.id}`}
                            className="w-full h-full px-2 py-1.5 text-right"
                            onClick={(e) => {
                              // نمنع انتشار الحدث حتى لا يفتح القائمة الفرعية ويغلق الرئيسية بدلاً من ذلك
                              e.stopPropagation();
                              setOpen(false);
                            }}
                          >
                            <span>{category.name}</span>
                          </NavLink>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="min-w-[10rem]">
                            {renderSubCategories(
                              category.sub_categories,
                              category.id,
                            )}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    );
                  }

                  return (
                    <DropdownMenuItem key={category.id} asChild>
                      <NavLink
                        to={`/courses?category_id=${category.id}`}
                        className="w-full block px-2 py-1.5"
                      >
                        {category.name}
                      </NavLink>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

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
