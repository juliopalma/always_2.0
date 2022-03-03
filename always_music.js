const { Client } = require('pg');
const chalk = require('chalk');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'always_music',
    password: '1234',
    port: 5432
});

client.connect(err => {
    if (err) {
        console.log('Error en la conexión a postgres', err);
    }
});

/*async function crear_tabla() {
    const res = await client.query(
        "create table estudiantes(nombre varchar(255) not null, rut varchar(25) not null, curso varchar(255) not null, nivel int not null)");
};

crear_tabla(); */


async function insertar(nombre, rut, curso, nivel) {
    await client.query(`insert into estudiantes (nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}', '${nivel}')`);

    console.log(chalk.blue('Hello world!'));
}

async function consultar() {
    const consulta = await client.query(`select * from estudiantes`);
    //console.log(consulta.rows);
    console.log(chalk.blue(consulta.rows[0].nombre));
}

/* async function todosLosEstudiantes() {
    console.log("mostrar los estudiantes")
    await client.query("select * from estudiantes");
}

todosLosEstudiantes() */

async function actualizar(nombre, rut, curso, nivel) {
    console.log("datos actualizados");
    await client.query(`update estudiantes set nombre='${nombre}', curso='${curso}', nivel='${nivel}'  where rut = '${rut}'`);
}

async function eliminar(rut) {
    console.log("datos eliminados");
    await client.query(`delete from estudiantes where rut='${rut}'`);
}

async function consultaRut(rut) {

    const res = await client.query(`select * from estudiantes where rut='${rut}'`);
    console.log(res.rows);
}

/**************************************************************************************************/

function init() {

    if (process.argv.length < 3) {

        console.log("Error, faltan argumentos");
        process.exit();
    }

    if (process.argv[2] == "nuevo") {

        console.log("Prueba de inserción");

        insertar(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);

    } else if (process.argv[2] == "consulta") {

        consultar();

    } else if (process.argv[2] == "actualizar") {

        console.log("datos a actualizar");

        actualizar(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);

    } else if (process.argv[2] == "rut") {

        consultaRut(process.argv[3]);

    } else if (process.argv[2] == "eliminar") {

        console.log("datos a eliminar");
        eliminar(process.argv[4]);

    } else {

        console.log("Acción no implementada");

    }
}

init();