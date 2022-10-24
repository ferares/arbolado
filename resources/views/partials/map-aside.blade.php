<aside class="map-aside">
  <form class="map-form" action="">
    <input type="hidden" name="user_latlng">
    <input type="hidden" name="radio" value="1000">

    <div class="map-form__group">
      <h2 class="map-form__title">
        ¿Dónde?
      </h2>
      <div class="map-form__option-group">
        <input type="radio" id="input-marker-all" name="marker" class="map-form__input map-form__input--radio" value="">
        <label class="map-form__label" for="input-marker-all">
          En todo el mapa
        </label>
      </div>

      <div class="map-form__option-group">
        <input type="radio" id="input-marker-point" name="marker" class="map-form__input map-form__input--radio" value="1">
        <label class="map-form__label" for="input-marker-point">
          Marcar en el mapa
        </label>
      </div>
    </div>
    <div class="map-form__group">
      <label class="map-form__title" for="input-species">
        ¿Qué especie?
      </label>
      <select name="" id=""></select>
    </div>

    <div class="map-form__group">
      <h2 class="map-form__title">
        Sabores
      </h2>
      <div class="map-form__option-group">
        <input type="checkbox" class="map-form__input map-form__input--checkbox" id="input-flavors" name="flavors">
        <label class="map-form__label" for="input-flavors">
          Frutales y medicinales
        </label>
      </div>
    </div>


    <div class="map-form__group">
      <h2 class="map-form__title">
        Región de origen
      </h2>
      <div class="map-form__option-group">
        <input type="checkbox" id="input-region-pampeana" name="pampeana" class="map-form__input map-form__input--checkbox" value="1">
        <label class="map-form__label" for="input-region-pampeana">
          Pampeana
        </label>
      </div>
      <div class="map-form__option-group">
        <input type="checkbox" id="input-region-nea" name="nea" class="map-form__input map-form__input--checkbox" value="1">
        <label class="map-form__label" for="input-region-nea">
          NEA
        </label>
      </div>
      <div class="map-form__option-group">
        <input type="checkbox" id="input-region-noa" name="noa" class="map-form__input map-form__input--checkbox" value="1">
        <label class="map-form__label" for="input-region-noa">
          NOA
        </label>
      </div>
      <div class="map-form__option-group">
        <input type="checkbox" id="input-region-cuyana" name="cuyana" class="map-form__input map-form__input--checkbox" value="1">
        <label class="map-form__label" for="input-region-cuyana">
          Cuyana
        </label>
      </div>
      <div class="map-form__option-group">
        <input type="checkbox" id="input-region-patagonica" name="patagonica" class="map-form__input map-form__input--checkbox" value="1">
        <label class="map-form__label" for="input-region-patagonica">
          Patagónica
        </label>
      </div>
    </div>

    <button type="submit" class="btn btn--primary">
      Buscar
    </button>
  </form>
</aside>