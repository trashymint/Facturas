function cargarEmpresas() {
    fetch('http://localhost:8081/api/facturas/empresas')
        .then(res => res.json())
        .then(empresas => {
            const datalist = document.getElementById('listaEmpresas');
            datalist.innerHTML = '';
            empresas.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa;
                datalist.appendChild(option);
            });
        });
}

window.addEventListener('DOMContentLoaded', cargarEmpresas);

//Seleccionar producto a partir de la empresa
function cargarProductosPorEmpresa() {
    const empresa = document.getElementById('Empresa').value.trim();
    if (!empresa) {
        document.getElementById('listaProductos').innerHTML = '';
        return;
    }
    fetch(`http://localhost:8081/api/facturas/productos?empresa=${encodeURIComponent(empresa)}`)
        .then(res => res.json())
        .then(productos => {
            const datalist = document.getElementById('listaProductos');
            datalist.innerHTML = '';
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto;
                datalist.appendChild(option);
            });
        });
}

// Actualiza productos cada vez que cambie el campo empresa
document.getElementById('Empresa').addEventListener('input', cargarProductosPorEmpresa);