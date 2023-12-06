export default interface NumericIdGenerator {
    next(): Promise<number>
}
