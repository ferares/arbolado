<h1>
  {{ $tree['nombre_cientifico'] }}
  <br>
  <small>
    {{ $tree['nombre_comun'] }}
  </small>
</h1>
<p>
  {{ $tree['tipo'] }}
  <br>
  Familia: {{ $tree['familia'] }}
  <br>
  Origen: {{ $tree['origen'] }}
  <br>
  @if ($tree['procedencia_exotica'])
    <span>
      Procedencia: {{ $tree['procedencia_exotica'] }}
    </span>
    <br>
  @endif
  @if ($tree['regiones'])
    <span>
      Región de origen: {{ $tree['regiones'] }}
    </span>
    <br>
  @endif
  @if ($tree['altura'])
    <span>
      Altura: {{ $tree['altura'] }}
    </span>
    <br>
  @endif
</p>
<p>
  {{-- TODO: <fa-icon [icon]="icons.faMapMarkerAlt"></fa-icon> --}}
  @if ($tree['espacio_verde'])
    <span>
      Espacio verde: {{ $tree['espacio_verde'] }}
    </span>
  @else
    <span>
      {{ $tree['calle'] }}
      {{ $tree['calle_altura'] === 0 ? "s/n" : $tree['calle_altura'] }}
    </span>
  @endif
</p>
<div class="card border-primary mb-4">
  <div class="card-header bg-primary">
    <h4>
      Fuentes
    </h4>
  </div>
  <div class="card-body">
    <p>
      Dato aportado por
      <strong>
        {{ $tree['nombre'] }}
      </strong>
    </p>
    <p>
      <small>
        {{ $tree['fecha_creacion'] }}
        <br>
        {{ $tree['descripcion'] }}
      </small>
    </p>
    @if ($tree['url'])
      <a href="{{ $tree['url'] }}" target="_blank" class="tree-info__link badge badge-pill badge-secondary mr-2">
        {{-- TODO: <fa-icon [icon]="icons.faLink"></fa-icon> --}}
      </a>
    @endif
    @if ($tree['facebook'])
      <a href="{{ $tree['facebook'] }}" target="_blank" class="tree-info__link badge badge-pill badge-secondary mr-2">
        {{-- TODO: <fa-icon [icon]="icons.faFacebookF"></fa-icon> --}}
      </a>
    @endif
    @if ($tree['instagram'])
      <a href="{{ $tree['instagram'] }}" target="_blank" class="tree-info__link badge badge-pill badge-secondary mr-2">
        {{-- TODO: <fa-icon [icon]="icons.faInstagram"></fa-icon> --}}
      </a>
    @endif
    @if ($tree['twitter'])
      <a href="{{ $tree['twitter'] }}" target="_blank" class="tree-info__link badge badge-pill badge-secondary mr-2">
        {{-- TODO: <fa-icon [icon]="icons.faTwitter"></fa-icon> --}}
      </a>
    @endif
  </div>
</div>
<div class="card">
  <iframe src="{{ $tree['streetview'] }}" allowfullscreen="" width="100%" height="400" frameborder="0">
  </iframe>
</div>
<div class="autor card my-4">
  <div class="card-header">
    <h4>
      Este árbol
    </h4>
  </div>
  <div class="card-body">
    <p>
      El siguiente código sirve para identificar a este árbol:
      <kbd class="mr-1">{{ $tree['id'] }}</kbd>
      <a href="/arbol/{{ $tree['id'] }}" target="_blank">
        {{-- TODO: <fa-icon [icon]="icons.faExternalLinkAlt"></fa-icon> --}}
      </a>
    </p>
    <p>
      Podés usarlo para reportar datos incorrectos enviando el código con
      los comentarios que quieras hacer por medio de
      <a class="text-primary" href="https://www.facebook.com/arboladomapa/" target="_blank">
        {{-- <fa-icon [icon]="icons.faFacebookSquare">/arboladomapa</fa-icon> --}}
      </a>
      <br>
      ¡Gracias!
    </p>
  </div>
</div>
