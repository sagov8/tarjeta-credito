import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css'],
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = "Agregar Tarjeta";
  id: string | undefined;

  constructor(private fb: FormBuilder, 
    private _tarjetaService: TarjetaService,
    private toastr: ToastrService
    ) {

    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: [
        '',
        [
          Validators.required,
          Validators.minLength(16),
          Validators.maxLength(16),
        ],
      ],
      fechaExpiracion: ['', Validators.required],
      cvv: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
    });
  }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data=>{
      this.id = data.id;
      this.titulo = "Editar Tarjeta";
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    })
  }

  guardarTarjeta() {

    if(this.id === undefined){
      this.agregarTarjeta();
    }else{
      this.editarTarjeta(this.id);
    } 
  }

  editarTarjeta(id: string){
    const TARJETA: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaActualizacion: new Date(),
    }  
    this.loading = true;
    this._tarjetaService.editarTarjeta(id, TARJETA).then(()=>{
      this.loading = false;
      this.titulo = 'Agregar Tarjeta'
      this.form.reset();
      this.toastr.info('La tarjeta fue actualizada con éxito!', 'Registro Actualizado')
    }, error => {
      this.loading = false;
      console.log(error)
    });
  }

  agregarTarjeta(){
    const TARJETA: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }
    
    this.loading = true;

    this._tarjetaService.guardarTarjeta(TARJETA).then(()=>{
      console.log('tarjeta registrada');
      this.loading = false;
      this.form.reset();
      this.toastr.success('La tarjeta ha sido agregada con éxito', 'Tarjeta registrada');
    }, error => {
      this.loading = false;
      this.toastr.error('Opps... ocurrió un error', 'Error al registrar tarjeta');
      console.log(error);
    });
  }
}
