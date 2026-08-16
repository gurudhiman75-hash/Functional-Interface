import { Router, type IRouter } from "express";

export function lazyRouter(loader: () => Promise<{ default: IRouter }>): IRouter {
  const proxy: IRouter = Router();
  let loaded: Promise<IRouter> | null = null;

  proxy.use((req, res, next) => {
    loaded ??= loader().then((module) => module.default);
    void loaded.then(
      (router) => router(req, res, next),
      (error) => next(error),
    );
  });

  return proxy;
}
