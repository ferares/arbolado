<template js-template="species-input">
  <div class="dropdown-menu-wrapper">
    <input type="text" autocomplete="off" required js-input>
    <button type="button" js-clean class="clean" title="Borrar">
      <i class="fa-solid fa-eraser"></i>
    </button>
    <ul class="dropdown-menu" role="menu" tabindex="-1" js-dropdown-menu>
    </ul>
  </div>
</template>
<template js-template="species-input-option">
  <li role="menuitem" js-option>
    <button type="button" class="dropdown-item" js-button>
    </button>
  </li>
</template>
