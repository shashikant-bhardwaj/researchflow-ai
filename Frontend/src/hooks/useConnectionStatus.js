import { useEffect, useState, useCallback } from "react";
import { checkBackendHealth } from "../services/researchApi";
import { CONNECTION_STATUS } from "../components/ConnectionIndicator";

export function useConnectionStatus() {
  const [status, setStatus] = useState(CONNECTION_STATUS.CHECKING);

  const check = useCallback(async () => {
    setStatus(CONNECTION_STATUS.CHECKING);
    const result = await checkBackendHealth();
    setStatus(result.connected ? CONNECTION_STATUS.CONNECTED : CONNECTION_STATUS.DISCONNECTED);
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { status, check };
}
