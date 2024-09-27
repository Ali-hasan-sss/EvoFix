"use client";

import { useEffect } from "react";

const ClientBootstrap = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
};

export default ClientBootstrap;
