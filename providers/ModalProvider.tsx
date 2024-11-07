"use client";

import CardModal from "@/components/modals/CardModal";
import ProModal from "@/components/modals/ProModal";
import { useEffect, useState } from "react";


const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(()=>{
    setIsMounted(true)
  },[])
  if (!isMounted) return null;
  return (
    <>
      <ProModal/>
      <CardModal/>
    </>
  )
}

export default ModalProvider