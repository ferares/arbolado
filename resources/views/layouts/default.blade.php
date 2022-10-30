<!doctype html>
<html lang="es">
  @include('includes.head')
  <body class="{{ isset($templateName) ? $templateName : '' }}">
    <a class="visually-hidden-focusable" href="#main">
      @lang('Saltar al contenido')
    </a>
    @include('includes.header')
    <main id="main">
      @yield('content')
    </main>
    @include('includes.loader')
  </body>
</html>