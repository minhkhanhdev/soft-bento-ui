# Adopting the kit

Use the downloaded starter, or copy its `src/soft-bento/` into a React 19+ project.
The folder contains tokens, HeroUI overrides, primitives and patterns; it does not
contain authentication, business records or a database connection.

Install HeroUI v3, @heroui/styles, Tailwind v4, lucide-react and tailwind-variants.
Import CSS in this order: tailwindcss, @heroui/styles, ./soft-bento/styles.css.
Use `useTheme` for data-theme, color-scheme and preference persistence.

The starter is source distribution, not a claim that @soft-bento/ui was published
on npm. Use relative imports or install the local package folder through your
workspace tooling. Merge the provided agent/design guidance into existing rules.

Check CSS slot overrides against the installed HeroUI version after upgrading.
Replace synthetic example data with typed application adapters outside the kit.
