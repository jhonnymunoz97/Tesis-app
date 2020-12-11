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
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('email')->unique();
            $table->string('telefono')->nullable();
            $table->string('licencia')->nullable();
            $table->string('password')->nullable();
            $table->dateTime('last_login')->nullable();
            $table->boolean('verificado')->default(false);
            $table->timestamps();
        });

        Driver::create([
            'dni' => '0850539479',
            'nombres' => 'Ángel Alexander',
            'apellidos' => 'Quiroz Candela',
            'email' => 'guirudj007@gmail.com',
            'password' => Hash::make('29011998@Angela'),
            'telefono' => '0939851015',
            'licencia' => '123456789',
            'verificado' => true,
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
