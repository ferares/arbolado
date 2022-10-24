<header class="main-header">
  <nav class="main-navbar">
    <div class="main-navbar__brand">
      <img class="main-navbar__logo" src="" alt="">
      <h1 class="main-navbar__title">
        Arbolado Urbano
      </h1>
    </div>
    <ul class="main-navbar__links">
      @foreach($navbar as $link)
        <li class="main-navbar__item">
          <a class="main-navbar__link" href="{{ $link['url'] }}">
            <img class="main-navbar__icon" src="{{ $link['icon'] }}" alt="">
            {{ $link['label'] }}
          </a>
        </li>
      @endforeach
    </ul>
  </nav>
</header>