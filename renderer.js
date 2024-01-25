// renderer.js
const { ipcRenderer } = require('electron');
// Requerir jQuery y asignarlo a la ventana global
window.$ = window.jQuery = require('jquery');

// Requerir Chosen
require('chosen-js');

window.onload = () => {
    ipcRenderer.send('solicitarParametros');
};

ipcRenderer.on('respuestaParametros', (event, datos) => {
    // Actualizar el modal con los datos recibidos
    document.getElementById('id').value = datos[0].id;
    document.getElementById('ip').value = datos[0].ip;
    document.getElementById('user').value = datos[0].user;
    document.getElementById('pass').value = datos[0].pass;
    document.getElementById('bbdd').value = datos[0].bbdd;

    // Aquí puedes mostrar tu modal, dependiendo de cómo esté implementado
});



function grabar_bbdd() {
    // Recoger los datos del formulario
    const id = document.getElementById('id').value;
    const ip = document.getElementById('ip').value;
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    const bbdd = document.getElementById('bbdd').value;
    const express = document.getElementById('express').checked;

    // Enviar los datos al proceso principal
    ipcRenderer.send('actualizar-parametros', { id, ip, user, pass, bbdd, express });
}

ipcRenderer.on('actualizacion-exito', (event, mensaje) => {
    alert(mensaje);
    // Aquí puedes cerrar el modal o mostrar un mensaje de éxito
});

ipcRenderer.on('actualizacion-error', (event, error) => {
    alert(error);
    // Aquí puedes mostrar un mensaje de error
});
