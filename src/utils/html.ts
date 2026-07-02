/**
 * A pass-through tag function for template literals.
 * In development, this does absolutely nothing.
 * In production, the Vite minifier sees the `html` tag and strips all whitespace
 */
export function html(strings: TemplateStringsArray, ...values: any[]): string {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
}