import { NextApiRequest, NextApiResponse } from 'next';
import { SaleorExternalAuth } from '../SaleorExternalAuth.js';
import 'graphql-tag';
import '../types.js';

declare const createSaleorExternalAuthHandler: (auth: SaleorExternalAuth) => (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export { createSaleorExternalAuthHandler };
