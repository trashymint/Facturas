function setFechaPredeterminada() {
    fetch('http://localhost:8081/api/facturas/ultima-fecha')
        .then(res => res.json())
        .then(fecha => {
            if (fecha) {
                document.getElementById('fecha').value = fecha;
            }
        });
}

window.addEventListener('DOMContentLoaded', setFechaPredeterminada);