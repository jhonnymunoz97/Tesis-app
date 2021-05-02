<?php

use App\Models\Driver;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class CreateDriversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('dni')->unique();
            $table->string('name');
            $table->string('surname');
            $table->string('email')->unique();
            $table->string('telefono')->nullable();
            $table->string('licencia')->nullable();
            $table->string('password')->nullable();
            $table->dateTime('last_login')->nullable();
            $table->boolean('verified')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Driver::create([
            'dni' => '0850539479',
            'name' => 'Ángel Conductor',
            'surname' => 'Quiroz Candela',
            'email' => 'guirudj007@gmail.com',
            'password' => Hash::make('29011998@Angel'),
            'telefono' => '0939851015',
            'licencia' => '123456789',
            'verified' => true,
        ]);
        Driver::create([
            'dni' => '1234567890',
            'name' => 'Jhonny Conductor',
            'surname' => 'Muñoz Cedeño',
            'email' => 'jmunoz2154@fci.edu.ec',
            'password' => Hash::make('1234567890'),
            'telefono' => '0987654321',
            'licencia' => '2364578910',
            'verified' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('drivers');
    }
}
