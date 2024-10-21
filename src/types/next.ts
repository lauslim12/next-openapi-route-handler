import type { HttpMethod } from "./http";
import type { OperationObject } from "@omer-x/openapi-types/operation";

type RouteHandlerProps<PathParams> = {
  params?: PathParams,
};

export type RouteMethodHandler<PathParamsInput, Req, Res> = ((
  request: Req,
  props: RouteHandlerProps<PathParamsInput>
) => Promise<Res>) & {
  apiData?: OperationObject,
};

export type RouteHandler<HM extends HttpMethod, PathParamsInput, Req, Res> = {
  [key in HM]: RouteMethodHandler<PathParamsInput, Req, Res>;
};
