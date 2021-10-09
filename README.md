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

This project provides several functions for manipulating the color attributes of css properties. Most of these functions mimic the API and behavior of [sass color functions](https://sass-lang.com/documentation/modules/color), minus support for `$whiteness` and `$blackness` arguments.

### Adjust

The 'adjust' function adds or subtracts a fixed amount from a color property.

```scss
:root {
  @include prop.define((
    --brand: hsl(200, 56%, 33%),
  ));

  --brand-red: #{prop.adjust(--brand, $blue: -20)};
  --brand-funny: #{prop.adjust(--brand, $hue: 50deg, $saturation: 16%, $lightness: 4%, $alpha: -0.1)};
}
```

compiles to

```css
:root {
  /* property definitions... */

  --brand-red: rgba(var(--brand-r), var(--brand-g), calc(var(--brand-b) + -20), var(--brand-a));;
  --brand-funny: hsla(calc(var(--brand-h) + 50deg), calc(var(--brand-s) + 16%), calc(var(--brand-l) + 4%), calc(var(--brand-a) + -0.1));
}
```

### Change

The change function sets one or more color properties to new values. 

```scss
:root {
  @include prop.define((
    --brand: hsl(200, 56%, 33%),
  ));

  --brand-dark: #{prop.change(--brand, $saturation: 50%, $lightness: 25%)};
}
```

compiles to

```css
:root {
  /* property definitions... */

  --brand-dark: hsla(var(--brand-h), 50%, 25%, var(--brand-a));
}
```

### Scale

Scales one or more properties by a percentage towards their minimum or maximum values.

```scss
:root {
  @include prop.define((
    --brand: hsl(200, 56%, 33%),
  ));

  --brand-dark: #{prop.scale(--brand, $lightness: -50%)};
  --brand-green: #{prop.scale(--brand, $green: 70%)};
}
```

compiles to

```css
:root {
  /* property definitions... */

  --brand-dark: hsla(var(--brand-h), var(--brand-s), calc(var(--brand-l) + ((var(--brand-l) - 0%) * -0.5)), var(--brand-a));
  --brand-green: rgba(var(--brand-r), calc(var(--brand-g) + ((255 - var(--brand-g)) * 0.7)), var(--brand-b), var(--brand-a));
}
```

### Mix

Mix two colors together by a set amount.

```scss
:root {
  @include prop.define((
    --color-a: teal,
    --color-b: fuchsia
  ));

  --mix: #{prop.mix(--color-a, --color-b)};
  --mix-w: #{prop.mix(--mix-a, --mix-b, $weight: 32%)};
}
```

compiles to

```css
:root {
  /* property definitions... */

  --mix: rgba(calc((var(--color-a-r) * 0.5) + (var(--color-b-r) * 0.5)), calc((var(--color-a-g) * 0.5) + (var(--color-b-g) * 0.5)), calc((var(--color-a-b) * 0.5) + (var(--color-b-b) * 0.5)), calc((var(--color-a-a) * 0.5) + (var(--color-b-a) * 0.5)));
  --mix-w: rgba(calc((var(--color-a-r) * 0.32) + (var(--color-b-r) * 0.68)), calc((var(--color-a-g) * 0.32) + (var(--color-b-g) * 0.68)), calc((var(--color-a-b) * 0.32) + (var(--color-b-b) * 0.68)), calc((var(--color-a-a) * 0.32) + (var(--color-b-a) * 0.68)))
}
```

The mix function defaults to rgba mixing, since averaging hues often produces unpredictable results.

You can also set individual weights for hsla and rgba properties, on top of a default weight.

```scss
:root {
  /* property declaration... */

  --mix: #{prop.mix(--color-a, --color-b, $lightness: 25%, $saturation: 70%)};
}
```

compiles to

```css
:root {
  /* property definitions... */

  --mix: hsla(calc((var(--color-a-h) * 0.5) + (var(--color-b-h) * 0.5)), calc((var(--color-a-s) * 0.7) + (var(--color-b-s) * 0.3)), calc((var(--color-a-l) * 0.25) + (var(--color-b-l) * 0.75)), calc((var(--color-a-a) * 0.5) + (var(--color-b-a) * 0.5)))
}
```

### Set

The set function allows you to combine different color functions to manipulate different attributes of a color at once. It defines these manipulations using keyword arguments and either maps or lists, where the key or first value corresponds to a function/color property, and the rest to the function arguments.

```scss
:root {
  /* property declaration... */

  --set: #{props.set(--mix-a,
    $lightness: change 50%,
    $saturation: scale -50%,
    $alpha: change 1)};
  --mix: #{props.set(--mix-a,
    $adjust: alpha -0.4,
    $mix: (
      red: --mix-b 30%,
      green: --mix-b 100%,
      blue: --mix-b 60% ))};
}
```

compiles to

```css
:root {
  /* property definitions... */

  --set: rgba(calc((var(--mix-a-r) * 0.3) + (var(--mix-b-r) * 0.7)), calc((var(--mix-a-g) * 1) + (var(--mix-b-g) * 0)), calc((var(--mix-a-b) * 0.6) + (var(--mix-b-b) * 0.4)), calc(var(--mix-a-a) + -0.4));
  --mix: hsla(var(--mix-a-h), calc(var(--mix-a-s) + ((var(--mix-a-s) - 0%) * -0.5)), 50%, 1);
}
```
