<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;

use App\Models\Species;

class MapController extends BaseController
{
    public function view() {
        $species = Species::select(['nombre_cientifico', 'nombre_comun', 'especies.id'])
        ->join('registros', 'registros.especie_id', '=', 'especies.id')
        ->groupBy(['especies.id', 'nombre_cientifico', 'nombre_comun'])
        ->orderBy('nombre_cientifico')->get();

        return view('pages.map', [
            'templateName' => 'template-map',
            'species' => $species,
        ]);
    }
}
