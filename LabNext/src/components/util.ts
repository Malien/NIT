type ClassSpecifier<R> = {
    [key in keyof R]: boolean | undefined;
}
export function classes<T>(cls: ClassSpecifier<T>): string {
    return Object.entries(cls)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(" ")
}