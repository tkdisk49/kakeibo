<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $expenseCategories = ['食費', '日用品', '交通費', '住居費', '水道光熱費', '通信費', '医療費', '娯楽費', 'その他'];
        $incomeCategories = ['給与', '副収入', 'その他'];

        foreach ($expenseCategories as $name) {
            Category::create(['name' => $name, 'type' => 'expense']);
        }

        foreach ($incomeCategories as $name) {
            Category::create(['name' => $name, 'type' => 'income']);
        }
    }
}
