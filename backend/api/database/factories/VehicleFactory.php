<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class VehicleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Vehicle::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $faker = new Faker();
        $faker->addProvider(new \Faker\Provider\Fakecar($faker));
        $v = $faker->vehicleArray();
        return [
            'vehicle_type'      => 'car',
            'vin'               => $faker->vin,
            'registration_no'   => $faker->vehicleRegistration,
            'type'              => $faker->vehicleType,
            'fuel'              => $faker->vehicleFuelType,
            'brand'             => $v['brand'],
            'model'             => $v['model'],
            'year'              => 2021
        ];
    }
}
