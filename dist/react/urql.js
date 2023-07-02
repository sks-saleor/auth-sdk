"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/urql.ts
var urql_exports = {};
__export(urql_exports, {
  useUrqlClient: () => useUrqlClient
});
module.exports = __toCommonJS(urql_exports);
var import_react = require("react");
var import_urql = require("urql");
var useUrqlClient = (opts) => {
  const createNewClient = () => (0, import_urql.createClient)(opts);
  const [urqlClient, setUrqlClient] = (0, import_react.useState)(createNewClient());
  const reset = () => setUrqlClient(createNewClient());
  return { urqlClient, reset, refetch: reset };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useUrqlClient
});
