# FCSA Number

An Angular directive that validates numbers and adds commas for the thousands separator or vice versa depending of the configuration.

So when the user enters `1000` into a textbox and tabs out, the value will be formatted to include the thousands separator and display: `1,000` or `1.000`

If an invalid number is entered, the textbox will be invalid with the `fcsaNumber` error.

## Installation

#### With Bower

    bower install angular-fcsa-number

Then reference `angular-fcsa-number/src/fcsaNumber.js` in your project.

#### Manually

Copy `src/fcsaNumber.js` into your project and reference it.

## Quick Start

Add the `fcsa-number` module as a dependency to you Angular app.
 
    angular.module('yourApp', ['fcsa-number']);

Add the `fcsa-number` attribute to textboxes you want to have validated and formatted with thousands separators.

    <input type='text' ng-model='company.employeeCount' fcsa-number />

When an invalid number is entered by the user, the form and control will become invalid and the 'fcsa-number-invalid' class will be added to the text box.

## Options

Without any options passed to it, fcsa-number will validate that the input is a valid number and will also add commas for the thousand separators.


#### max

Validates the number is not above the max number.

    fcsa-number="{ max: 100 }"

 * Valid: 100
 * Invalid: 101

#### min

Validates the number is not below the min number.

    fcsa-number="{ min: -5 }"

 * Valid: -5
 * Invalid: -6

#### maxDecimals

Validates the number does not have more than the specified number of decimals.

    fcsa-number="{ maxDecimals: 2 }"

 * Valid: 1.23
 * Invalid: 1.234

#### maxDigits

Validates the number does not have more than the specified number of digits.

    fcsa-number="{ maxDigits: 2 }"

 * Valid: 76
 * Invalid: 123

#### preventInvalidInput

By default users are allowed to enter invalid characters, and then the textbox is marked invalid. 
If you want to prevent users from entering invalid characters altogether, then use the `preventInvalidInput` option.
If the user presses the 'a' key, the directive will catch it and prevent 'a' from being shown in the textbox.

    fcsa-number="{ preventInvalidInput: true }"

#### prepend

Prepends the specified text before the number.

    fcsa-number="{ prepend: '$' }"

#### append

Appends the specified text after the number.

    fcsa-number="{ append: '%' }"

## Default Options

It's possible to set the options globally too. You do this by calling `fcsaNumberConfigProvider.setDefaultOptions()` 
inside a config function in your app.

Here's a code example that sets the default options:

```javascript
var app = angular.module('yourApp', ['fcsa-number']);
app.config(['fcsaNumberConfigProvider', function(fcsaNumberConfigProvider) {
  fcsaNumberConfigProvider.setDefaultOptions({
    max: 100,
    min: 0
  });
}]);
```

Here's a code example that sets the thousands separator to ".":

```javascript
   fcsaNumberConfigProvider.setDefaultOptions({
        preventInvalidInput: true,
        autoFormat: true,
        keepThousandsOnInput: true,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        renderOnKeyup: true,
        maxDigits: 24,
    });
```


The default options can be overridden locally by passing in an options object: `fcsa-number="{ max: 10 }"`

## Developing

Grunt is used to compile the CoffeeScript files and run the tests. To get started run the following commands on the command line:

    // installs the required node modules
    npm install

    // installs the required bower components
    bower install

Run the following command to automatically compile and run the unit and end to end tests whenever you make a change to a file.

    grunt karma:unit:start express:dev watch

To just run the protractor tests, you can run the following command.

    grunt express:dev e2e


# FCSA Number (Español)

Una directiva Angular que valida números y agrega comas para el separador de miles o viceversa dependiendo de la conconfiguración.

Por lo tanto, cuando el usuario introduce `1000` en un cuadro de texto y se separa, el valor se formateará para incluir el separador de miles y mostrar:` 1,000` o `1.000`

Si se introduce un número no válido, el cuadro de texto no será válido con el error `fcsaNumber`.

## Instalación

#### Con Bower
    bower install angular-fcsa-number

Luego haga referencia a `angular-fcsa-number / src / fcsaNumber.js` en su proyecto.

#### Manualmente

Copie `src / fcsaNumber.js` en su proyecto y haga referencia a él.

## Inicio rápido

Agregue el módulo `fcsa-number` como una dependencia para usted.

    angular.module ('yourApp', ['fcsa-number']);

Agregue el atributo `fcsa-number` a los cuadros de texto que desee validar y formatear con separadores de miles.

    <input type = 'text' ng-modelo = 'company.employeeCount' fcsa-number />

Cuando el usuario ingresa un número no válido, el formulario y el control se convertirán en no válidos y la clase 'fcsa-number-invalid' se agregará al cuadro de texto.

## Opciones

Sin ninguna opción pasada a ella, fcsa-number validará que la entrada es un número válido y también agregará comas para los mil separadores.


#### max

Valida el número no está por encima del número máximo.

    fcsa-number = "{max: 100}"
    
     * Válido: 100
     * No válido: 101

#### min

Valida que el número no está por debajo del número mínimo.

        fcsa-number = "{min: -5}"
    
     * Válido: -5
     * No válido: -6

#### maxDecimals

Valida el número no tiene más que el número especificado de decimales.

        fcsa-number = "{maxDecimals: 2}"
    
     * Válido: 1.23
     * No válido: 1.234

#### maxDigits

Valida el número no tiene más que el número especificado de dígitos.

        fcsa-number = "{maxDigits: 2}"
    
     * Válido: 76
     * No válido: 123

#### preventInvalidInput

De forma predeterminada, se permite a los usuarios introducir caracteres no válidos y, a continuación, el cuadro de texto se marca como no válido.
Si desea evitar que los usuarios ingresen caracteres inválidos, utilice la opción `preventInvalidInput`.
Si el usuario pulsa la tecla 'a', la directiva lo capturará y evitará que se muestre 'a' en el cuadro de texto.

    fcsa-number = "{preventInvalidInput: true}"

#### prepend

Preinforma el texto especificado antes del número.

    fcsa-number = "{prepend: '$'}"

#### adjuntar

Añade el texto especificado después del número.

    fcsa-number = "{append: '%'}"

## Opciones predeterminadas

También es posible configurar las opciones globalmente. Para ello, llame a `fcsaNumberConfigProvider.setDefaultOptions ()`
dentro de una función de configuración en tu aplicación.

He aquí un ejemplo de código que establece las opciones predeterminadas:


```javascript
var app = angular.module('yourApp', ['fcsa-number']);
app.config(['fcsaNumberConfigProvider', function(fcsaNumberConfigProvider) {
  fcsaNumberConfigProvider.setDefaultOptions({
    max: 100,
    min: 0
  });
}]);
```

He aquí un ejemplo de código que establece el separador de miles en ".":

```javascript
   fcsaNumberConfigProvider.setDefaultOptions({
        preventInvalidInput: true,
        autoFormat: true,
        keepThousandsOnInput: true,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        renderOnKeyup: true,
        maxDigits: 24,
    });
```
Las opciones predeterminadas se pueden sobrescribir localmente pasando un objeto de opciones: `fcsa-number =" {max: 10} "`

## Desarrollando

Grunt se utiliza para compilar los archivos CoffeeScript y ejecutar las pruebas. Para empezar, ejecute los siguientes comandos en la línea de comandos:

    // instala los módulos de nodo requeridos
    npm instalar

    // instala los componentes de bower necesarios
    instalación de bower

Ejecute el siguiente comando para compilar y ejecutar automáticamente la unidad y las pruebas de extremo a extremo siempre que realice un cambio en un archivo.

    grunt karma: unidad: start express: dev watch

Para ejecutar las pruebas del transportador, puede ejecutar el siguiente comando.

    grunt express: dev e2e