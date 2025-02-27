import { BaseDist } from "../../dist/BaseDist.js";
import { Env } from "../../dist/env.js";
import { Ok } from "../../utility/result.js";
import { Lambda } from "../../reducer/lambda.js";
import {
  ReducerFn,
  Value,
  vBool,
  vDist,
  vNumber,
  vString,
} from "../../value/index.js";
import { FRFunction } from "./core.js";
import { FnDefinition, makeDefinition } from "./fnDefinition.js";
import { frBool, frDist, frNumber, frString } from "./frTypes.js";
import * as Result from "../../utility/result.js";
import { DistError } from "../../dist/DistError.js";
import { ReducerContext } from "../../reducer/Context.js";
import { SampleMapNeedsNtoNFunction } from "../../operationError.js";
import {
  ErrorMessage,
  REDistributionError,
  REOperationError,
} from "../../reducer/ErrorMessage.js";

type SimplifiedArgs = Omit<FRFunction, "nameSpace" | "requiresNamespace"> &
  Partial<Pick<FRFunction, "nameSpace" | "requiresNamespace">>;

type ArgsWithoutDefinitions = Omit<SimplifiedArgs, "definitions">;

export class FnFactory {
  nameSpace: string;
  requiresNamespace: boolean;

  constructor(opts: { nameSpace: string; requiresNamespace: boolean }) {
    this.nameSpace = opts.nameSpace;
    this.requiresNamespace = opts.requiresNamespace;
  }

  make(args: SimplifiedArgs): FRFunction {
    return {
      nameSpace: this.nameSpace,
      requiresNamespace: this.requiresNamespace,
      ...args,
    };
  }

  n2n({
    fn,
    ...args
  }: ArgsWithoutDefinitions & { fn: (x: number) => number }): FRFunction {
    return this.make({
      ...args,
      output: "Number",
      definitions: [
        makeDefinition(args.name, [frNumber], ([x]) => Ok(vNumber(fn(x)))),
      ],
    });
  }

  nn2n({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: number, y: number) => number;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Number",
      definitions: [
        makeDefinition(args.name, [frNumber, frNumber], ([x, y]) =>
          Ok(vNumber(fn(x, y)))
        ),
      ],
    });
  }

  nn2b({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: number, y: number) => boolean;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Bool",
      definitions: [
        makeDefinition(args.name, [frNumber, frNumber], ([x, y]) =>
          Ok(vBool(fn(x, y)))
        ),
      ],
    });
  }

  bb2b({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: boolean, y: boolean) => boolean;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Bool",
      definitions: [
        makeDefinition(args.name, [frBool, frBool], ([x, y]) =>
          Ok(vBool(fn(x, y)))
        ),
      ],
    });
  }

  ss2b({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: string, y: string) => boolean;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Bool",
      definitions: [
        makeDefinition(args.name, [frString, frString], ([x, y]) =>
          Ok(vBool(fn(x, y)))
        ),
      ],
    });
  }

  ss2s({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: string, y: string) => string;
  }): FRFunction {
    return this.make({
      ...args,
      output: "String",
      definitions: [
        makeDefinition(args.name, [frString, frString], ([x, y]) =>
          Ok(vString(fn(x, y)))
        ),
      ],
    });
  }

  d2s({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (dist: BaseDist, env: Env) => string;
  }): FRFunction {
    return this.make({
      ...args,
      output: "String",
      definitions: [
        makeDefinition(args.name, [frDist], ([dist], { environment }) =>
          Ok(vString(fn(dist, environment)))
        ),
      ],
    });
  }

  dn2s({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (dist: BaseDist, n: number, env: Env) => string;
  }): FRFunction {
    return this.make({
      ...args,
      output: "String",
      definitions: [
        makeDefinition(
          args.name,
          [frDist, frNumber],
          ([dist, n], { environment }) => Ok(vString(fn(dist, n, environment)))
        ),
      ],
    });
  }

  d2n({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: BaseDist, env: Env) => number;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Number",
      definitions: [
        makeDefinition(args.name, [frDist], ([x], { environment }) =>
          Ok(vNumber(fn(x, environment)))
        ),
      ],
    });
  }

  d2b({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (x: BaseDist, env: Env) => boolean;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Bool",
      definitions: [
        makeDefinition(args.name, [frDist], ([x], { environment }) =>
          Ok(vBool(fn(x, environment)))
        ),
      ],
    });
  }

  d2d({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (dist: BaseDist, env: Env) => BaseDist;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Dist",
      definitions: [
        makeDefinition(args.name, [frDist], ([dist], { environment }) =>
          Ok(vDist(fn(dist, environment)))
        ),
      ],
    });
  }

  dn2d({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (dist: BaseDist, n: number, env: Env) => BaseDist;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Dist",
      definitions: [
        makeDefinition(
          args.name,
          [frDist, frNumber],
          ([dist, n], { environment }) => Ok(vDist(fn(dist, n, environment)))
        ),
      ],
    });
  }

  dn2n({
    fn,
    ...args
  }: ArgsWithoutDefinitions & {
    fn: (dist: BaseDist, n: number, env: Env) => number;
  }): FRFunction {
    return this.make({
      ...args,
      output: "Number",
      definitions: [
        makeDefinition(
          args.name,
          [frDist, frNumber],
          ([dist, n], { environment }) => Ok(vNumber(fn(dist, n, environment)))
        ),
      ],
    });
  }

  fromDefinition(def: FnDefinition) {
    return this.make({
      name: def.name,
      definitions: [def],
    });
  }
}

export const unpackDistResult = <T>(result: Result.result<T, DistError>): T => {
  if (!result.ok) {
    return ErrorMessage.throw(REDistributionError(result.value));
  }
  return result.value;
};

export const repackDistResult = (
  result: Result.result<BaseDist, DistError>
): Result.result<Value, ErrorMessage> => {
  const dist = unpackDistResult(result);
  return Ok(vDist(dist));
};

export const doNumberLambdaCall = (
  lambda: Lambda,
  args: Value[],
  context: ReducerContext,
  reducer: ReducerFn
) => {
  const value = lambda.call(args, context, reducer);
  if (value.type === "Number") {
    return value.value;
  }
  return ErrorMessage.throw(REOperationError(SampleMapNeedsNtoNFunction));
};
