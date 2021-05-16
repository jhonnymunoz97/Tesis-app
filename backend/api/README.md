## Sistema de Gestion 

<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>
Instrucciones

-   Creas un archivo .env a partir del archivo de ejemplo

```sh
cp .env.example .env
```

-   Modificas el archivo con tus variables

-   Inicias un servidor con Docker (Laravel Sail)

```sh
# Borrar instancias de Sail
./vendor/bin/sail down --rmi all -v
# Crear alias para trabajar con sail
alias sail='bash vendor/bin/sail'
# Iniciar imagen de Sail
sail up -d
```

Esto configura un servidor en el puerto 80 de tu computador

-   Ahora, ejecuta las migraciones

```sh
php artisan migrate:fresh --seed
```
