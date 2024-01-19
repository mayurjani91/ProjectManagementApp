<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProjectsTableSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        foreach (range(1, 10) as $index) {
            DB::table('projects')->insert([
                'name' => $faker->word,
                'start_date' => $faker->date,
                'end_date' => $faker->date,
                'status' => $faker->randomElement(['Pending', 'In Progress', 'Completed']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
