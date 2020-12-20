export const delay = <R = unknown>(timeout: number, callback?: (id: number) => R): Promise<R | undefined> =>
    new Promise((resolve) => {
        const id: number = window.setTimeout(() => {
            resolve(callback ? callback(id) : undefined);
        }, timeout);
    });

export const isPromise = <T>(promise: Promise<T>): boolean => promise instanceof Promise;

/* Выполнение промисов (и не только) из генератора */
export const executePromise = <T, TReturn extends Promise<T> = Promise<T>>(
    gen: () => Generator<TReturn, T, T>,
): Promise<T> =>
    new Promise((resolve, reject) => {
        const generator = gen();

        const handle = (iteratorResult: IteratorResult<TReturn>): Promise<T> => {
            if (iteratorResult.done) {
                return iteratorResult.value;
            }

            const result = Promise.resolve(iteratorResult.value);

            return result.then(
                (res) => handle(generator.next(res)),
                (err) => handle(generator.throw(err)),
            );
        };

        try {
            resolve(handle(generator.next()));
        } catch (error) {
            reject(error);
        }
    });

export const getAppContainer = executePromise<HTMLDivElement>(function* () {
    const container = yield new Promise<HTMLDivElement>((resolve) => {
        document.addEventListener('DOMContentLoaded', (event: Event) => {
            resolve(document.querySelector('.app') as HTMLDivElement);
        });
    });

    return container;
});
