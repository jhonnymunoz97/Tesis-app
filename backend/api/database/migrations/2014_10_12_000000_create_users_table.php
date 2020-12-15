<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('dni');
            $table->string('name');
            $table->string('surname');
            $table->string('email');
            $table->string('password');
            $table->boolean('verified')->default(false);
            $table->dateTime('last_login')->nullable();
            $table->enum('role', [
                User::ROLE_SUPER_USER,
                User::ROLE_DRIVER,
                User::ROLE_USER
            ])->default(User::ROLE_USER);
            $table->timestamps();
        });

        User::create([
            'dni' => '0850539479',
            'name' => 'Ángel Alexander',
            'surname' => 'Quiroz Candela',
            'email' => 'guirudj007@gmail.com',
            'password' => Hash::make('29011998@Angel'),
            'role' => User::ROLE_SUPER_USER,
        ]);

        User::create([
            'dni' => '1234567890',
            'name' => 'Jhonny Javier',
            'surname' => 'Muñoz Cedeño',
            'email' => 'jmunoz2154@fci.edu.ec',
            'password' => Hash::make('1234567890'),
            'role' => User::ROLE_SUPER_USER,
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
