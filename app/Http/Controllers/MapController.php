<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;

use App\Models\Species;
use App\Models\Tree;

class MapController extends BaseController
{
    public function view() {
        $species = Species::select(['nombre_cientifico', 'nombre_comun', 'especies.id'])
        ->join('registros', 'registros.especie_id', '=', 'especies.id')
        ->groupBy(['especies.id', 'nombre_cientifico', 'nombre_comun'])
        ->orderBy('nombre_cientifico')->get();

        return view('pages.map', [
            'templateName' => 'template-map',
            'species' => json_encode($species),
            'mapboxToken' => env('MAPBOX_TOKEN', ''),
        ]);
    }

    public function tree($id) {
        $tree = Tree::select([
            'registros.id',
            'registros.calle',
            'registros.calle_altura',
            'registros.altura',
            'registros.espacio_verde',
            'registros.especie_id',
            'registros.fecha_creacion',
            'registros.streetview',
            'registros.lat',
            'registros.lng',
            'especies.nombre_cientifico',
            'especies.nombre_comun',
            'especies.origen',
            'especies.region_pampeana',
            'especies.region_nea',
            'especies.region_noa',
            'especies.region_cuyana',
            'especies.region_patagonica',
            'especies.procedencia_exotica',
            'tipos.tipo',
            'familias.familia',
            'fuentes.nombre',
            'fuentes.descripcion',
            'fuentes.url',
            'fuentes.facebook',
            'fuentes.twitter',
            'fuentes.instagram',
          ])
          ->join('especies', 'especie_id', '=', 'especies.id')
          ->join('tipos', 'tipos.id', '=', 'especies.tipo_id')
          ->join('familias', 'familias.id', '=', 'especies.familia_id')
          ->join('fuentes', 'fuentes.id', '=', 'registros.fuente_id')
          ->where('registros.id', $id)->first();

        if (!$tree['streetview']) {
            $googleMapsApiKey = env('GOOGLE_MAPS_API_KEY', '');
            $googleStreetViewUrl = env('GOOGLE_MAPS_STREET_VIEW_URL', '');
            $tree['streetview'] = $googleStreetViewUrl."&key=".$googleMapsApiKey."&location=".$tree['lat'].",".$tree['lng'];
        }
  
        return view('partials.tree-data', ['tree' => $tree]);
    }

    public function search(Request $request) {
        $results = Tree::select(['registros.id', 'lat', 'lng', 'especie_id', 'icono'])
        ->join('especies', 'especie_id', '=', 'especies.id');

        if (!empty($request->input('especie_id')) && ($request->input('especie_id'))) {
            $results->where('especie_id', $request->input('especie_id'));
        }

        if (!empty($request->input('user_sabores')) && ($request->input('user_sabores'))) {
            $results->where(function ($query) {
                $query->where('comestible', 'Sí')->orWhere('medicinal', 'Sí');
            });
        }

        if (!empty($request->input('user_origen')) && ($request->input('user_origen'))) {
            $results->where('origen', 'like', '%'.$request->input('user_origen').'%');
        }

        if (!empty($request->input('borigen_pampeana')) && ($request->input('borigen_pampeana'))) {
            $results->where('region_pampeana', true);
        }

        if (!empty($request->input('borigen_nea')) && ($request->input('borigen_nea'))) {
            $results->where('region_nea', true);
        }

        if (!empty($request->input('borigen_noa')) && ($request->input('borigen_noa'))) {
            $results->where('region_noa', true);
        }

        if (!empty($request->input('borigen_cuyana')) && ($request->input('borigen_cuyana'))) {
            $results->where('region_cuyana', true);
        }

        if (!empty($request->input('borigen_patagonica')) && ($request->input('borigen_patagonica'))) {
            $results->where('region_patagonica', true);
        }

        if ((!empty($request->input('user_latlng'))) &&
          ($request->input('user_latlng')) &&
          (!empty($request->input('radio'))) &&
          ($request->input('radio'))
        ) {
            $radio = $request->input('radio');
            $user_latlng = explode(" ", $request->input('user_latlng'));
            $user_lat = $user_latlng[0];
            $user_lng = $user_latlng[1];
            if (($user_lat) && ($user_lng) && is_numeric($user_lat) && is_numeric($user_lng) && (is_numeric($radio))) {
                $results->whereRaw("(6371 * acos(cos(radians($user_lat)) * cos(radians(lat)) * cos(radians(lng) - radians($user_lng)) + sin (radians($user_lat)) * sin(radians(lat)))) < $radio / 1000");
            }
        }

        return response()->json($results->get());
    }
}
