function habilitarEdicion(row, factura) {
    for (let i = 0; i <= 5; i++) {
        const cell = row.cells[i];
        const input = document.createElement('input');
        input.className = 'form-control';
        if (i === 0) { // Empresa
            input.type = 'text';
            input.value = factura.empresa;
        } else if (i === 1) { // Producto
            input.type = 'text';
            input.value = factura.producto;
        } else if (i === 2) { // Cantidad
            input.type = 'number';
            input.step = 'any';
            input.value = factura.cantidad;
        } else if (i === 3) { // Valor total
            input.type = 'number';
            input.step = 'any';
            input.value = factura.valorTotal;
        } else if (i === 4) { // Valor unitario
            input.type = 'number';
            input.step = 'any';
            input.value = factura.valorUnitario;
            input.readOnly = true;
        } else if (i === 5) { // Fecha
            input.type = 'date';
            input.value = factura.fecha;
        }
        cell.innerHTML = '';
        cell.appendChild(input);
    }

    // Referencias a los inputs de cantidad, valor total y valor unitario
    const cantidadInput = row.cells[2].firstChild;
    const valorTotalInput = row.cells[3].firstChild;
    const valorUnitarioInput = row.cells[4].firstChild;

    function actualizarValorUnitario() {
        const cantidad = parseFloat(cantidadInput.value) || 0;
        const valorTotal = parseFloat(valorTotalInput.value) || 0;
        valorUnitarioInput.value = (cantidad > 0) ? (valorTotal / cantidad).toFixed(2) : 0;
    }

    cantidadInput.addEventListener('input', actualizarValorUnitario);
    valorTotalInput.addEventListener('input', actualizarValorUnitario);

    // Cambia el botón "Modificar" por "Confirmar"
    const btnModificarCell = row.cells[6];
    btnModificarCell.innerHTML = '';
    const btnConfirmar = document.createElement('button');
    btnConfirmar.textContent = 'Confirmar';
    btnConfirmar.className = 'btn btn-success btn-sm';
    btnConfirmar.onclick = function () {
        confirmarEdicion(row, factura.id || factura.idFactura);
    };
    btnModificarCell.appendChild(btnConfirmar);

    // Cambia el botón "Eliminar" por "Cancelar"
    const btnEliminarCell = row.cells[7];
    btnEliminarCell.innerHTML = '';
    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.className = 'btn btn-danger btn-sm';
    btnCancelar.onclick = function () {
        cargarFacturas();
    };
    btnEliminarCell.appendChild(btnCancelar);
}

function confirmarEdicion(row, id) {
    const empresa = row.cells[0].firstChild.value;
    const producto = row.cells[1].firstChild.value;
    const cantidad = parseFloat(row.cells[2].firstChild.value);
    const valorTotal = parseFloat(row.cells[3].firstChild.value);
    const valorUnitario = parseFloat(row.cells[4].firstChild.value);
    const fecha = row.cells[5].firstChild.value;

    if (!fecha) {
        alert('La fecha no puede estar vacía');
        return;
    }

    const data = {
        empresa,
        producto,
        cantidad,
        valorTotal,
        valorUnitario,
        fecha
    };

    fetch(`http://localhost:8081/api/facturas/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                cargarFacturas();
            } else {
                alert('Error al modificar la factura');
            }
        })
        .catch(() => alert('Error de conexión al modificar la factura'));
}