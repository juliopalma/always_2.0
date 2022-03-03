//1. Realizar la conexión con PostgreSQL, utilizando la clase Pool y definiendo un máximo de 20 clientes, 5 segundos como tiempo máximo de inactividad de un cliente y 2 segundos de espera de un nuevo cliente.
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'always_music',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

/* async function consultar() {
    // 5. Capturar los posibles errores en todas las consultas.
    try {
        const client = await pool.connect();
        console.log("Error en el cliente");
    } catch (conn_error) {
        console.log(conn_error)
        return
    }
} */

// 2. Hacer 1 las consulta con un JSON como argumento definiendo la propiedad name para el Prepared Statement.
async function ingresar(nombre, rut, curso, nivel) {
    // 6. Retornar por consola un mensaje de error en caso de haber problemas de conexión.
    let client;
    try {
        client = await pool.connect()
    } catch (err) {
        console.log("El error es el siguiente: " + err);
        return;
    }

    // 5. Capturar los posibles errores en todas las consultas.
    try {
        // 3. Hacer las consultas con texto parametrizado.
        const res2 = await client.query(
            `insert into estudiantes (nombre, rut, curso, nivel) values ($1, $2, $3, $4)`, [nombre, rut, curso, nivel]
        )
    } catch (err) {
        console.log("El error es: " + err);
    }

    // 4. Liberar a un cliente al concluir su consulta.
    client.release()
    pool.end()
}

async function consulta() {
    let client
    try {
        client = await pool.connect();

    } catch (conn_error) {

        console.log("Error en el cliente");
        return;
    }

    let res;
    try {
        // 3. Hacer las consultas con texto parametrizado.
        res = await client.query({
            text: `select * from estudiantes`,
            rowMode: 'array'
        })
    } catch (err) {
        console.log("El error es: " + err);
        return;
    }

    console.log(res.rows);

    client.release();
    pool.end()
}

async function estudiante_rut(rut) {
    let client
    try {
        client = await pool.connect();

    } catch (conn_error) {

        console.log("Error en el cliente");
        return;
    }

    let res;
    try {
        // 3. Hacer las consultas con texto parametrizado.
        res = await client.query({
            text: `select * from estudiantes where rut=$2`,
            values: [rut],
            rowMode: 'array'
        })
    } catch (err) {
        console.log("El error es: " + err);
        return;
    }

    console.log(res.rows);
    client.release();
    pool.end()
}

async function actualizar(nombre, rut, curso, nivel) {

    let client
    try {
        client = await pool.connect();

    } catch (conn_error) {

        console.log("Error en el cliente");
        return;
    }

    try {
        await client.query({
            text: `update estudiantes set nombre = $1, rut = $2, curso = $3, nivel = $4 where rut = $2`,
            values: [nombre, rut, curso, nivel],
            name: 'actualizar'
        });
    } catch (err) {
        console.log("El error es el siguiente: " + err);
    }
    client.release();
    pool.end()
}

async function eliminar(rut) {

    let client
    try {
        client = await pool.connect();

    } catch (conn_error) {

        console.log("Error en el cliente");
        return;
    }

    try {
        await client.query({
            text: `delete from estudiantes where rut = $1`,
            values: [rut],
            name: 'eliminar'
        });
    } catch (err) {
        console.log("El error es el siguiente: " + err);
    }
    client.release();
    pool.end()
}

function init() {

    if (process.argv.length < 3) {
        console.log("Error, faltan argumentos");
        process.exit();
    }

    if (process.argv[2] == "nuevo") {

        console.log("Prueba de inserción");
        ingresar(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);

    } else if (process.argv[2] == "consulta") {

        consulta();

    } else if (process.argv[2] == "actualizar") {

        console.log("datos a actualizar");

        actualizar(process.argv[3], process.argv[4], process.argv[5], process.argv[6]);

    } else if (process.argv[2] == "rut") {

        estudiante_rut(process.argv[3]);

    } else if (process.argv[2] == "eliminar") {

        console.log("datos a eliminar");
        eliminar(process.argv[3]);

    } else {
        console.log("Acción no implementada");
    }
}

init();