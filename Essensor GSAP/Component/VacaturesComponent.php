<?php

use Freekattema\Wp\Components\Component;

final class VacaturesComponent extends Component {
    function get_template(): string
    {
        return __DIR__ . '/VacaturesComponent.template.php';
    }
}
