const empresa = document.getElementById('Empresa');
const fecha = document.getElementById('fecha');
const valorTotal = document.getElementById('monto');
const cantidad = document.getElementById('cantidad');
const producto = document.getElementById('producto');
const enviarBtn = document.getElementById('enviar');

function validarCampos() {
    if (
        empresa.value.trim() &&
        fecha.value &&
        valorTotal.value &&
        cantidad.value &&
        producto.value
    ) {
        enviarBtn.disabled = false;
    } else {
        enviarBtn.disabled = true;
    }
}

empresa.addEventListener('input', validarCampos);
fecha.addEventListener('input', validarCampos);
valorTotal.addEventListener('input', validarCampos);
cantidad.addEventListener('input', validarCampos);
validarCampos();

// Obtener referencia a la tabla
const tablaFacturas = document.getElementById('tablaFacturas').getElementsByTagName('tbody')[0] ||
    (function () {
        const table = document.getElementById('tablaFacturas');
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        return tbody;
    })();

enviarBtn.addEventListener('click', function () {
    const cantidadVal = parseFloat(cantidad.value);
    const valorTotalVal = parseFloat(valorTotal.value);
    const valorUnitario = cantidadVal > 0 ? valorTotalVal / cantidadVal : 0;

    const data = {
        empresa: empresa.value,
        producto: producto.value,
        cantidad: cantidadVal,
        valorTotal: valorTotalVal,
        valorUnitario: valorUnitario,
        fecha: fecha.value
    };

    fetch('http://localhost:8081/api/facturas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                empresa.value = '';
                fecha.value = '';
                producto.value = '';
                valorTotal.value = '';
                cantidad.value = '';
                validarCampos();
                cargarFacturas();
                if (typeof cargarEmpresas === 'function') {
                    cargarEmpresas(); // Actualiza el datalist en tiempo real
                }
                if (typeof setFechaPredeterminada === 'function') {
                    setFechaPredeterminada();
                }
            } else {
                alert('Error al guardar la factura');
            }
        })
        .catch(() => {
            alert('Error de conexión');
        });
});

let facturasGlobal = [];

function cargarFacturas() {
    fetch('http://localhost:8081/api/facturas')
        .then(res => res.json())
        .then(data => {
            facturasGlobal = data;
            mostrarFacturas(data);
        });
}

function mostrarFacturas(facturas) {
    tablaFacturas.innerHTML = '';
    let total = 0;
    const meses = [
        '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    facturas.forEach(factura => {
        const row = tablaFacturas.insertRow();
        row.insertCell().textContent = factura.empresa;
        row.insertCell().textContent = factura.producto;
        row.insertCell().textContent = factura.cantidad;
        row.insertCell().textContent = factura.valorTotal != null ? `$${Number(factura.valorTotal).toLocaleString('es-CO')}` : '';
        row.insertCell().textContent = factura.valorUnitario != null ? `$${Number(factura.valorUnitario).toLocaleString('es-CO')}` : '';
        if (factura.valorTotal != null && !isNaN(factura.valorTotal)) {
            total += Number(factura.valorTotal);
        }
        if (factura.fecha) {
            const [year, month, day] = factura.fecha.split('-');
            const mesNombre = meses[parseInt(month, 10)];
            row.insertCell().textContent = `${day}/${mesNombre}/${year}`;
        } else {
            row.insertCell().textContent = '';
        }
        // Botón editar
        const btnModificarCell = row.insertCell(6);
        const btnModificar = document.createElement('button');
        btnModificar.textContent = 'Modificar';
        btnModificar.className = 'btn btn-primary btn-sm';
        btnModificar.onclick = function () {
            habilitarEdicion(row, factura);
        };
        btnModificarCell.appendChild(btnModificar);

        // Botón eliminar
        const btnCell = row.insertCell(7);
        const btn = document.createElement('button');
        btn.textContent = 'Eliminar';
        btn.className = 'btn btn-danger btn-sm';
        btn.onclick = function () {
            eliminarFactura(factura.idFactura || factura.id); // Ajusta según tu backend
        };
        btnCell.appendChild(btn);
    });
    // Mostrar el valor total
    const valorTotalDisplay = document.getElementById('valorTotalDisplay');
    if (valorTotalDisplay) {
        valorTotalDisplay.textContent = `Valor total: $${total.toLocaleString('es-CO')}`;
    }
}

function eliminarFactura(id) {
    if (!confirm('¿Está seguro de eliminar esta factura?')) return;
    fetch(`http://localhost:8081/api/facturas/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                cargarFacturas();
            } else {
                alert('Error al eliminar la factura');
            }
        })
        .catch(() => alert('Error de conexión al eliminar la factura'));
}

// Filtrado
const filtroCampo = document.getElementById('filtroCampo');
const filtroValor = document.getElementById('filtroValor');
const filtroFechasRow = document.getElementById('filtroFechasRow');
const fechaInicio = document.getElementById('fechaInicio');
const fechaFin = document.getElementById('fechaFin');

// Mostrar/ocultar inputs según filtro seleccionado
filtroCampo.addEventListener('change', function () {
    if (filtroCampo.value === 'fecha') {
        filtroValor.style.display = 'none';
        filtroFechasRow.style.display = '';
    } else {
        filtroValor.style.display = '';
        filtroFechasRow.style.display = 'none';
    }
    filtroValor.value = '';
    if (fechaInicio) fechaInicio.value = '';
    if (fechaFin) fechaFin.value = '';
    filtrarFacturas();
});

// Filtrado dinámico
filtroValor.addEventListener('input', filtrarFacturas);
if (fechaInicio) fechaInicio.addEventListener('input', filtrarFacturas);
if (fechaFin) fechaFin.addEventListener('input', filtrarFacturas);

function filtrarFacturas() {
    const campo = filtroCampo.value;
    const valor = filtroValor.value.trim().toLowerCase();
    let filtradas = facturasGlobal;

    if (campo === 'fecha') {
        const inicio = fechaInicio.value;
        const fin = fechaFin.value;
        if (inicio || fin) {
            filtradas = facturasGlobal.filter(factura => {
                if (!factura.fecha) return false;
                return (!inicio || factura.fecha >= inicio) && (!fin || factura.fecha <= fin);
            });
        }
    } else if (campo !== 'ninguno' && valor) {
        filtradas = facturasGlobal.filter(factura => {
            let campoValor = factura[campo];
            if (campo === 'monto') campoValor = String(campoValor);
            if (campo === 'fecha') campoValor = String(campoValor);
            return campoValor && campoValor.toString().toLowerCase().includes(valor);
        });
    }

    mostrarFacturas(filtradas);
}

const filtroCampo2 = document.getElementById('filtroCampo2');
const filtroValor2 = document.getElementById('filtroValor2');
const filtroFechasRow2 = document.getElementById('filtroFechasRow2');
const fechaInicio2 = document.getElementById('fechaInicio2');
const fechaFin2 = document.getElementById('fechaFin2');

filtroCampo2.addEventListener('change', function () {
    if (filtroCampo2.value === 'fecha') {
        filtroValor2.style.display = 'none';
        filtroFechasRow2.style.display = '';
    } else {
        filtroValor2.style.display = '';
        filtroFechasRow2.style.display = 'none';
    }
    filtroValor2.value = '';
    if (fechaInicio2) fechaInicio2.value = '';
    if (fechaFin2) fechaFin2.value = '';
    filtrarFacturas();
});

// Filtrado dinámico (para el segundo filtro)
filtroValor2.addEventListener('input', filtrarFacturas);
if (fechaInicio2) fechaInicio2.addEventListener('input', filtrarFacturas);
if (fechaFin2) fechaFin2.addEventListener('input', filtrarFacturas);

function filtrarFacturas() {
    let filtradas = facturasGlobal;

    // Primer filtro
    const campo1 = filtroCampo.value;
    const valor1 = filtroValor.value.trim().toLowerCase();
    if (campo1 === 'fecha') {
        const inicio = fechaInicio.value;
        const fin = fechaFin.value;
        if (inicio || fin) {
            filtradas = filtradas.filter(factura => {
                if (!factura.fecha) return false;
                return (!inicio || factura.fecha >= inicio) && (!fin || factura.fecha <= fin);
            });
        }
    } else if (campo1 !== 'ninguno' && valor1) {
        filtradas = filtradas.filter(factura => {
            let campoValor = factura[campo1];
            if (campo1 === 'monto') campoValor = String(campoValor);
            if (campo1 === 'fecha') campoValor = String(campoValor);
            return campoValor && campoValor.toString().toLowerCase().includes(valor1);
        });
    }

    // Segundo filtro (aplicado sobre el resultado del primero)
    const campo2 = filtroCampo2.value;
    const valor2 = filtroValor2.value.trim().toLowerCase();
    if (campo2 === 'fecha') {
        const inicio2 = fechaInicio2.value;
        const fin2 = fechaFin2.value;
        if (inicio2 || fin2) {
            filtradas = filtradas.filter(factura => {
                if (!factura.fecha) return false;
                return (!inicio2 || factura.fecha >= inicio2) && (!fin2 || factura.fecha <= fin2);
            });
        }
    } else if (campo2 !== 'ninguno' && valor2) {
        filtradas = filtradas.filter(factura => {
            let campoValor = factura[campo2];
            if (campo2 === 'monto') campoValor = String(campoValor);
            if (campo2 === 'fecha') campoValor = String(campoValor);
            return campoValor && campoValor.toString().toLowerCase().includes(valor2);
        });
    }

    mostrarFacturas(filtradas);
}

// Cargar facturas al cargar la página
window.addEventListener('DOMContentLoaded', cargarFacturas);
