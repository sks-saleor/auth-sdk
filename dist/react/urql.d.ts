import { ClientOptions, Client } from 'urql';

declare const useUrqlClient: (opts: ClientOptions) => {
    urqlClient: Client;
    reset: () => void;
    refetch: () => void;
};

export { useUrqlClient };
