// src/react/urql.ts
import { useState } from "react";
import { createClient } from "urql";
var useUrqlClient = (opts) => {
  const createNewClient = () => createClient(opts);
  const [urqlClient, setUrqlClient] = useState(createNewClient());
  const reset = () => setUrqlClient(createNewClient());
  return { urqlClient, reset, refetch: reset };
};
export {
  useUrqlClient
};
