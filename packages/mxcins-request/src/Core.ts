import {
  IRequestContext,
  IRequestMiddleware,
  IRequestOptions,
  IRequestOptionsInit,
} from './interface';
import Onion from './Onion';
import MapCache from './MapCache';

export default class Core {
  public onion: Onion;

  public cache: MapCache;

  constructor(options: IRequestOptionsInit, defaultMiddlewares: IRequestMiddleware[] = []) {
    this.onion = new Onion(defaultMiddlewares);
    this.cache = new MapCache(options);
  }

  public use(middleware: IRequestMiddleware): this {
    this.onion.use(middleware);
    return this;
  }

  public async request(
    uri: string,
    options: IRequestOptions = {},
  ): Promise<IRequestContext['res']> {
    const ctx: IRequestContext = {
      req: { uri, options },
      res: undefined,
      cache: this.cache,
    };

    return new Promise((resolve, reject) =>
      this.onion
        .excute(ctx)
        .then(() => resolve(ctx.res))
        .catch(error => {
          const { options: opts = {} } = ctx.req;
          const { errorHandler } = opts;
          if (errorHandler) {
            try {
              const d = errorHandler(error);
              resolve(d);
            } catch (error_) {
              reject(error_);
            }
          } else {
            reject(error);
          }
        }),
    );
  }
}
