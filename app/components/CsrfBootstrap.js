"use client";

import { useEffect } from "react";

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export default function CsrfBootstrap() {
  useEffect(() => {
    if (!getCookie("csrfToken")) {
      const token = crypto.randomUUID();
      document.cookie = `csrfToken=${token}; path=/; SameSite=Strict`;
    }
  }, []);

  return null;
}
