type ClassSpecifier<R> = {
    [key in keyof R]: boolean | undefined;
}
/**
 * Convinience method which creates className strings upon using many conditional CSS classes
 * @param cls Object with key: value pairs of className: boolean, where className is class to be apended, when value is set to true
 */
export function classes<T>(cls: ClassSpecifier<T>): string {
    return Object.entries(cls)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(" ")
}