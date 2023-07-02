import gql from 'graphql-tag';

declare const getTokenIss: (token: string) => string;
declare const isExpiredToken: (token: string) => boolean;
declare const getRequestData: <TVars extends object>(query: ReturnType<typeof gql>, variables: TVars) => {
    method: string;
    headers: {
        "Content-Type": string;
    };
    body: string;
};
declare class InvariantError extends Error {
    constructor(message: string);
}
declare function invariant(condition: unknown, message?: string): asserts condition;

export { InvariantError, getRequestData, getTokenIss, invariant, isExpiredToken };
