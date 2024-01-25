const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const { ipcMain } = require('electron');

let win
let db = new sqlite3.Database('./sincro.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');
});

ipcMain.on('actualizar-parametros', (event, params) => {
    db.run(`UPDATE parametros SET ip = ?, user = ?, pass = ?, bbdd = ?, express = ? WHERE id = ?`, 
        [params.ip, params.user, params.pass, params.bbdd, params.express, params.id], 
        function(err) {
            if (err) {
                // Enviar un mensaje de error al renderer
                event.reply('actualizacion-error', err.message);
            } else {
                // Enviar un mensaje de éxito al renderer
                event.reply('actualizacion-exito', 'Actualización exitosa');
            }
        }
    );
});


ipcMain.on('solicitarParametros', async (event) => {
    try {
        let datos = await leerParametros();
        event.reply('respuestaParametros', datos);
        console.log(datos);
    } catch (err) {
        console.log(err);
    }
});


function leerParametros() {
    return new Promise((resolve, reject) => {
        db.all("SELECT id, ip,user, pass, bbdd,express FROM parametros", [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
}

// Aquí puedes ejecutar consultas SQL...

// No olvides cerrar la base de datos cuando hayas terminado
/*
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Cerrando la conexión a la base de datos.');
});
*/
function createWindow() {
    win = new BrowserWindow({ 
        width: 1400, 
        height: 800,
        webPreferences: {
            nodeIntegration: true, // Habilitar integración de Node
            contextIsolation: false // Deshabilitar aislamiento de contexto
        }
     })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Abrir la herramienta de desarrollo
    win.webContents.openDevTools();

    // Cuando la ventana principal se cierre, liberar la memoria
    win.on('closed', function () {
        win = null;
    });

}

app.on('ready', createWindow) 