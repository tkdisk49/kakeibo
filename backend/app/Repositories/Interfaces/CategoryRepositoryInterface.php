<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function getOrderedList(): Collection;
}
