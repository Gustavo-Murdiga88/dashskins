/**
 * @param T Type main
 * @param K Keys of you don't want be required on type T
 */
export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
