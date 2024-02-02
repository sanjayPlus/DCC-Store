import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LoadScriptOnRouteChange = ({ scriptSrc }) => {
  const location = useLocation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [location, scriptSrc]);

  return null;
};

export default LoadScriptOnRouteChange;
