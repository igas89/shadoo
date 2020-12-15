

export const delay = <R = unknown>(timeout: number, callback?: (id: number) => R): Promise<R> => new Promise(resolve => {
    const id: number = setTimeout(() => {
        resolve(callback instanceof Function ? callback(id) : undefined);
    }, timeout)
});

export const isPromise = <T>(promise: Promise<T>): boolean => promise instanceof Promise;

export const executePromise = (gen: Function): Promise<unknown> => new Promise((resolve, reject) => {
    const generator: Generator<Promise<unknown>> = gen();

    const handle = (iteratorResult: IteratorResult<Promise<unknown>>): Promise<unknown> => {
        if (iteratorResult.done) {
            return iteratorResult.value;
        }

        const result = isPromise(iteratorResult.value) ? iteratorResult.value : Promise.resolve(iteratorResult.value);

        return result.then(
            (res: unknown) => handle(generator.next(res)),
            (err: unknown) => handle(generator.throw(err)),
        );
    };

    try {
        resolve(handle(generator.next()));
    } catch (error) {
        reject(error);
    }
});


export const getAppContainer = executePromise(function* () {
    const container = yield new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", (event: Event) => {
            resolve(document.querySelector('.app'));
        });
    })

    return container;
})