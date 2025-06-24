package com.panaderia.repositorio;

import com.panaderia.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FacturaRepo extends JpaRepository<Factura, Long> {
    @Query("SELECT DISTINCT f.empresa FROM Factura f")
    List<String> findDistinctEmpresas();

    @Query("SELECT DISTINCT f.producto FROM Factura f WHERE f.empresa = :empresa")
    List<String> findProductosByEmpresa(String empresa);

    @Query("SELECT f.fecha FROM Factura f WHERE f.id = (SELECT MAX(f2.id) FROM Factura f2)")
    java.time.LocalDate findUltimaFecha();
}
