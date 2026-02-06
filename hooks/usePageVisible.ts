import { useEffect, useState } from "react";

export function usePageVisible() {
  const [visible, setVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return document.visibilityState === "visible";
  });

  useEffect(() => {
    const onChange = () => {
      setVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", onChange);
    return () =>
      document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}
