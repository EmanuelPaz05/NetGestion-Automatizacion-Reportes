# Automatización comercial en Net-Gestión · Reportes y movimientos

**Proyecto de automatización para coloquio | Emanuel Paz | Node.js 18+**

> Reimplementación educativa, autónoma y con datos ficticios de un tipo de proceso que Emanuel desarrolló para Net-Gestión: la generación y el envío automatizado de reportes comerciales por correo. **No contiene código de producción** y no se conecta a Gmail, clientes ni bases reales. Ofrece una **integración opcional de prueba con Resend** usando credenciales propias, desactivada por defecto.

## Lo que automatiza el producto comercial

En Net-Gestión (más de 30 clientes) trabajé en procesos que se ejecutan sobre operaciones reales del comercio: **resúmenes semanales**, información de **facturación electrónica ARCA**, **cobros mediante transferencias** y comunicaciones con **Gmail y Resend**. La integración con **Tiendanube** conecta catálogo, stock y pedidos según la configuración de cada negocio.

Un resumen semanal puede servir para revisar importes del período, ventas y medios de pago. Registrar pagos por transferencia permite distinguirlos de efectivo, débito y crédito; un comprobante fiscal, cuando corresponde, se gestiona mediante ARCA. En el caso real, los disparadores, controles y reglas dependen de la implementación privada.

**Este repositorio es una demostración educativa independiente**, no una exportación del código real. Contiene dos circuitos ejecutables:

| Demo | Qué demuestra | Alcance |
| --- | --- | --- |
| **Reporte diario** | Lectura de ventas ficticias, cálculo, JSON y HTML, envío opcional por Resend | No conecta con Gmail ni con la base comercial |
| **Resumen semanal** | Ventas de una semana, desglose de cobros (incluidas transferencias) y estados ficticios de comprobantes | No consulta ARCA, ni concilia transferencias con bancos |

### Captura del sistema comercial que inspiró el caso

![Net-Gestión: interfaz real del punto de venta, con datos de prueba](https://emanuel-paz-portfolio.vercel.app/assets/img/netgestion-pos.webp)

Imagen de la interfaz de Net-Gestión publicada en el portfolio. **No corresponde a la interfaz de esta demo por línea de comandos.**

## Demostración semanal — ejecutable

Con Node.js 18+:

```bash
npm run weekly
```

Crea `output/resumen-semanal.json` y `output/resumen-semanal.html`. Abrí el HTML para mostrar el reporte con ventas y cobros simulados entre el **9 y el 15 de noviembre de 2026**.

También acepta un intervalo:

```bash
npm run weekly -- --from=2026-11-09 --to=2026-11-15
```

El archivo `data/operaciones-semana.json` contiene operaciones ficticias con efectivo, transferencia, tarjeta y cuenta corriente, además de estados de comprobante de ejemplo. **No valida pagos bancarios ni genera facturas ARCA.** El envío externo sigue desactivado por defecto: sólo ocurre al utilizar `--send` con credenciales propias de Resend.

Para comprobar la lógica:

```bash
npm test
```

## Problema que resuelve

Preparar manualmente un reporte de ventas, calcular resultados y enviarlo por correo consume tiempo y puede causar errores. Esta demo automatiza el flujo a partir de un conjunto de ventas de ejemplo:

```mermaid
flowchart LR
  A[Ventas ficticias JSON] --> B[Filtrar por fecha]
  B --> C[Calcular ingresos y unidades]
  C --> D[Generar JSON y HTML]
  D --> E{¿--send y credenciales?}
  E -->|No| F[Previsualización local]
  E -->|Sí| G[API de Resend]
```

## Arquitectura

- `data/ventas.json`: fuente ficticia, sin datos de clientes.
- `src/report.js`: validación, filtrado por fecha, cálculo de totales y plantillas HTML/texto.
- `src/transport.js`: simulación segura por defecto o envío opcional mediante API de Resend.
- `src/cli.js`: orquestación, archivos de salida y ejecución programada opcional cada N minutos.
- `tests/report.test.js`: tests de filtros, cálculos, validaciones, escapado HTML y envío simulado.

## Instalación

**Requisitos:** Node.js 18 o superior. No es necesario instalar paquetes externos.

Desde este repositorio:

```bash
git clone https://github.com/EmanuelPaz05/NetGestion-Automatizacion-Reportes.git
cd NetGestion-Automatizacion-Reportes
npm start -- --date=2026-11-11
```

El programa genera `output/reporte.json` y `output/reporte.html`. Abrí el archivo HTML en el navegador para mostrar el correo. **No envía ningún email real**.

Ejecutar pruebas:

```bash
npm test
```

### Automatización periódica

```bash
npm run watch -- --date=2026-11-11
```

En modo demostración, genera el reporte al iniciar y nuevamente cada minuto (se puede ajustar mediante `DEMO_INTERVAL_MINUTES`). El programa debe permanecer abierto. Si no se indica fecha, utiliza la fecha UTC actual. **No pretende replicar la programación de producción de Net-Gestión.**

### Envío real opcional por Resend

Sólo para una cuenta y dominio de pruebas controlados por vos:

```bash
# Linux / macOS
export RESEND_API_KEY="tu_clave_de_prueba"
export REPORT_FROM="Demo <demo@tu-dominio-verificado>"
export REPORT_TO="tu-correo-de-prueba@ejemplo.com"
node src/cli.js --date=2026-11-11 --send
```

No uses direcciones de terceros, certificados de ARCA, claves reales de clientes ni tokens de producción. Las variables son **sólo locales**, nunca deben subirse a GitHub. La API puede aceptar un envío sin que eso confirme entrega efectiva. Si no activás `--send`, no se hace ninguna solicitud externa.

## Demo en 60 segundos

1. Abrir `data/ventas.json` y mostrar cinco operaciones ficticias.
2. Ejecutar `npm start -- --date=2026-11-11`.
3. Mostrar el cálculo de ventas y los archivos generados.
4. Abrir `output/reporte.html`, mostrando el mensaje ya armado sin intervención manual.
5. Mostrar cómo se puede programar con `npm run watch -- --date=2026-11-11`.

## Relación con el producto real

En [Net-Gestión](https://netgestion.ar/) también se desarrollaron integraciones con ARCA, Tiendanube y reportes por Gmail/Resend. Este repositorio **sólo** demuestra de forma independiente la automatización de generación de reportes y un transporte opcional de Resend. No afirma que su arquitectura, proveedor, programación o código sean iguales a los del producto comercial.

**Proyecto principal:** [Net-Gestión Demo](https://github.com/EmanuelPaz05/NetGestion-Presentacion) · **Autor:** Emanuel Paz · [Portfolio](https://emanuel-paz-portfolio.vercel.app/) · [Guía del coloquio](https://github.com/EmanuelPaz05/EmanuelPaz05/blob/main/COLOQUIO.md)
