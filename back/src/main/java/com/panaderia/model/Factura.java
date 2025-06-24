package com.panaderia.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "factura")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idFactura")
    @JsonProperty("id")
    private Long id;

    @Column(name = "Empresa emisora")
    private String empresa;

    @Column(name = "fecha de la factura")
    private LocalDate fecha;

    @Column(name = "producto")
    private String producto;

    @Column(name = "cantidad")
    private Double cantidad;

    @Column(name = "Valor total")
    private Double valorTotal;

    @Column(name = "Valor unitario")
    private Double valorUnitario;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public String getProducto() { return producto; }
    public void setProducto(String producto) { this.producto = producto; }
    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }
    public Double getValorUnitario() { return valorUnitario; }
    public void setValorUnitario(Double valorUnitario) { this.valorUnitario = valorUnitario; }
}
