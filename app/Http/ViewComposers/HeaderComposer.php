<?php

namespace App\Http\ViewComposers;

use Illuminate\View\View;
use Illuminate\Http\Request;

class HeaderComposer
{
    public $navbar = [];

    /**
     * Create a header composer.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->navbar = [
            [
                'label' => 'Sobre el mapa',
                'url' => '',
                'icon' => '/assets/imgs/icons/help.svg',
            ],
            [
                'label' => 'Donaciones',
                'url' => '',
                'icon' => '/assets/imgs/icons/coffe.svg',
            ],
            [
                'label' => 'Seguinos',
                'url' => '',
                'icon' => '/assets/imgs/icons/heart.svg',
            ],
        ];
    }

    /**
     * Bind data to the view.
     *
     * @param  View  $view
     * @return void
     */
    public function compose(View $view)
    {
        return $view->with('navbar', $this->navbar);
    }
}
