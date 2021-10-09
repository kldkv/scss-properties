# scss-properties

A set of sass tools for manipulating color attributes using css properties.

Based on a fork of [kldkv/scss-properties](https://github.com/kldkv/scss-properties),
updated with new functions and to work with sass modules.

## Defining properties

Color properties must be declared using the `define` mixin.

```scss
@use 'scss-properties/index' as prop;

:root {
  @include prop.define((
    --brand: rgb(37, 100, 131)
  ));
}
```

This produces a css property for each color property.

```css
:root {
  --brand: hsla(var(--brand-h), var(--brand-s), var(--brand-l), var(--brand-a));
  --brand-r: 37;
  --brand-g: 100;
  --brand-b: 131;
  --brand-h: 199.7872340426deg;
  --brand-s: 55.9523809524%;
  --brand-l: 32.9411764706%;
  --brand-a: 1;
}
```

You can also nest define variables.

```scss
:root {
  @include prop.define((
    --brand: (
      color: hsl(200, 56%, 33%),
      --green: green
    ),
  ), $forceAlpha: false);
}
```
compile to
```css
:root {
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-r: 37;
  --brand-g: 100;
  --brand-b: 131;
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;
  --brand--green: hsl(var(--brand--green-h), var(--brand--green-s), var(--brand--green-l));
  --brand--green-r: 0;
  --brand--green-g: 128;
  --brand--green-b: 0;
  --brand--green-h: 120deg;
  --brand--green-s: 100%;
  --brand--green-l: 25.0980392157%;
}
```

If you want to prevent opaque hsl or rgb colors from outputting as hsla or rgba, you set the `$FORCE-ALPHA` variable to false.

```scss
@use 'scss-properties/index' as prop with ($FORCE-ALPHA: false);
```

This is true by default because that behavior is most consistent. Even with `FORCE-ALPHA` set to false, hsl colors can output hsla properties if they share a name with a previously-defined, semi-transparent color.

## Color functions

```scss
$brand: hsl(200, 56%, 33%);

:root {
  @include color\define((
    --brand: $brand,
  ));

  --brand-dark: #{color\adjust(--brand, $brand, $saturation: -20)};
  --brand-funny: #{color\adjust(--brand, $brand, $hue: 50, $saturation: 16, $lightness: 4, $alpha: -10%)};

  --brand-new: #{color\change(--brand, $brand, $hue: 50)};
  --brand-new-08: #{color\change(--brand, $brand, $hue: 50, $alpha: 0.8)};
}
```
compile to
```css
:root {
  // color\define
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;

  // color\adust
  --brand-dark: hsl(var(--brand-h), calc(var(--brand-s) + -20%), var(--brand-l));
  --brand-funny: hsla(calc(var(--brand-h) + 50deg), calc(var(--brand-s) + 16%), calc(var(--brand-l) + 4%), calc(var(--brand-a) * 0.9));

  // color\change
  --brand-new: hsl(50deg, var(--brand-s), var(--brand-l));
  --brand-new-08: hsla(50deg, var(--brand-s), var(--brand-l), 0.8);
}
```

And mix its
```scss
$brand: hsl(200, 56%, 33%);

:root {
  @include color\define((
    --brand: (
      color: $brand,
      --dark: #{color\adjust(--brand, $brand, $saturation: -20)}
    ),
  ));
}
```
compile to
```css
:root {
  --brand: hsl(var(--brand-h), var(--brand-s), var(--brand-l));
  --brand-h: 200deg;
  --brand-s: 56%;
  --brand-l: 33%;
  --brand--dark: hsl(var(--brand-h), calc(var(--brand-s) + -20%), var(--brand-l));
}
```
