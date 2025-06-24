package com.panaderia.controladores;

import com.panaderia.model.Factura;
import com.panaderia.repositorio.FacturaRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturaControlador {
    @Autowired
    private FacturaRepo facturaRepo;

    @PostMapping
    public ResponseEntity<?> crearFactura(@RequestBody Factura factura) {
        Factura guardada = facturaRepo.save(factura);
        return ResponseEntity.ok(guardada);
    }

    @GetMapping
    public List<Factura> obtenerFacturas() {
        return facturaRepo.findAll();
    }

    @GetMapping("/empresas")
    public List<String> obtenerEmpresas() {
        return facturaRepo.findDistinctEmpresas();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarFactura(@PathVariable Long id) {
        if (!facturaRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        facturaRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/productos")
    public List<String> obtenerProductosPorEmpresa(@RequestParam String empresa) {
        return facturaRepo.findProductosByEmpresa(empresa);
    }

    @GetMapping("/ultima-fecha")
    public java.time.LocalDate obtenerUltimaFecha() {
        return facturaRepo.findUltimaFecha();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarFactura(@PathVariable Long id, @RequestBody Factura factura) {
        return facturaRepo.findById(id)
                .map(f -> {
                    f.setEmpresa(factura.getEmpresa());
                    f.setProducto(factura.getProducto());
                    f.setCantidad(factura.getCantidad());
                    f.setValorTotal(factura.getValorTotal());
                    f.setValorUnitario(factura.getValorUnitario());
                    f.setFecha(factura.getFecha());
                    facturaRepo.save(f);
                    return ResponseEntity.ok(f);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
