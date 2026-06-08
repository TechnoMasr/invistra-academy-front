import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { NavLink } from "react-router";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/modals/modalsSlice";

const MobileNav = () => {
  const { modalName } = useSelector((state) => state.modals);

  const open = modalName === "mobileNav";

  const dispatch = useDispatch();

  const closeOnLinkClick = () => {
    dispatch(closeModal());
  };

  return createPortal(<div>nav</div>, document.body);
};

export default MobileNav;
